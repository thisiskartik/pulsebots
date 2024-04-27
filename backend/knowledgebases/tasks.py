from celery import shared_task
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader, PyPDFLoader, UnstructuredPowerPointLoader,\
    UnstructuredMarkdownLoader, Docx2txtLoader
from .models import KnowledgeBase, KnowledgeBaseDocument
from .vector_store import vector_store
from .utils import get_webpages_documents, get_website_documents


@shared_task
def vectorize(knowledgebase_id):
    knowledgebase = KnowledgeBase.objects.get(id=knowledgebase_id)
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=4000, chunk_overlap=500)

    try:
        if knowledgebase.type.split('/')[0] == 'file':
            if knowledgebase.type == 'file/text':
                loader = TextLoader(knowledgebase.file.path)
            elif knowledgebase.type == 'file/pdf':
                loader = PyPDFLoader(knowledgebase.file.path)
            elif knowledgebase.type == 'file/docx':
                loader = Docx2txtLoader(knowledgebase.file.path)
            elif knowledgebase.type == 'file/pptx':
                loader = UnstructuredPowerPointLoader(knowledgebase.file.path)
            elif knowledgebase.type == 'file/markdown':
                loader = UnstructuredMarkdownLoader(knowledgebase.file.path)
            docs = loader.load_and_split(text_splitter)
        elif knowledgebase.type.split('/')[0] == 'content':
            if knowledgebase.type == 'content/webpage':
                docs = get_webpages_documents([knowledgebase.content_url], text_splitter)
            elif knowledgebase.type == 'content/website':
                docs = get_website_documents(knowledgebase.content_url, text_splitter)

        for doc in docs:
            doc.metadata = {'knowledgebase': str(knowledgebase.id)}
        doc_ids = vector_store.add_documents(docs)

        for i, doc in enumerate(docs):
            KnowledgeBaseDocument.objects.create(chroma_id=doc_ids[i],
                                                 knowledgebase=knowledgebase,
                                                 text=doc.page_content.replace("\x00", "\uFFFD"))
        knowledgebase.vectorized_status = 'success'
        knowledgebase.save()
    except Exception as error:
        print(error)
        knowledgebase.vectorized_status = 'failed'
        knowledgebase.save()
