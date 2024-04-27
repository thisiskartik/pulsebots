from abc import ABC
from threading import Thread
from queue import Queue
from langchain.chains import ConversationalRetrievalChain
from langchain.callbacks.base import BaseCallbackHandler
from knowledgebases.vector_store import build_retriever
from .memory import build_memory
from .llm import build_llm


class StreamingHandler(BaseCallbackHandler, ABC):
    def __init__(self, queue):
        self.queue = queue
        self.streaming_run_ids = set()

    def on_chat_model_start(self, serialized, messages, run_id, **kwargs):
        if serialized['kwargs']['streaming']:
            self.streaming_run_ids.add(run_id)

    def on_llm_new_token(self, token, **kwargs):
        self.queue.put(token)

    def on_llm_end(self, response, run_id, **kwargs):
        if run_id in self.streaming_run_ids:
            self.queue.put(None)
            self.streaming_run_ids.remove(run_id)

    def on_llm_error(self, error, run_id, **kwargs):
        if run_id in self.streaming_run_ids:
            self.queue.put(None)
            self.streaming_run_ids.remove(run_id)


class StreamableChain:
    def stream(self, input):
        queue = Queue()
        handler = StreamingHandler(queue)

        def invoke():
            self.invoke(input, config={'callbacks': [handler]})
        Thread(target=invoke).start()
        while True:
            token = queue.get()
            if token is None:
                break
            yield token


class StreamingConversationalRetrievalChain(StreamableChain, ConversationalRetrievalChain):
    pass


def build_chain(chat_id, chatbot):
    retriever = build_retriever(chatbot)
    llm = build_llm(streaming=True)
    memory = build_memory(chat_id)
    return StreamingConversationalRetrievalChain.from_llm(
        llm=llm,
        memory=memory,
        retriever=retriever,
        verbose=True,
        condense_question_llm=build_llm(streaming=False)
    )
