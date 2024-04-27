import chromadb
from langchain.vectorstores.chroma import Chroma
from langchain_openai import OpenAIEmbeddings


client = chromadb.PersistentClient(path="/chroma")
client.get_or_create_collection('pulsebots')

embeddings = OpenAIEmbeddings()
vector_store = Chroma(client=client, embedding_function=embeddings, collection_name='pulsebots')


def build_retriever(chatbot):
    knowledgebases_ids = [str(knowledgebase_id) for knowledgebase_id in list(
        chatbot.knowledgebases.values_list('id', flat=True)
    )]
    return vector_store.as_retriever(search_type="similarity_score_threshold",
                                     search_kwargs={
                                         'filter': {
                                             'knowledgebase': {'$in': knowledgebases_ids}
                                         },
                                         'score_threshold': 0.8,
                                         'k': 5,
                                     })
