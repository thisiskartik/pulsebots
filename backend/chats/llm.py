from langchain_openai import ChatOpenAI


def build_llm(streaming):
    return ChatOpenAI(streaming=streaming)
