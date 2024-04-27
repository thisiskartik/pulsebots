from langchain.memory import ConversationBufferMemory
from langchain.schema import BaseChatMessageHistory, SystemMessage, HumanMessage, AIMessage
from .models import Chat, Message


class MessageHistory(BaseChatMessageHistory):
    def __init__(self, chat_id):
        self.chat_id = chat_id

    @property
    def messages(self):
        lc_messages = []
        for message in Chat.objects.get(id=self.chat_id).message_set.all():
            if message.message_type == 'system':
                lc_messages.append(SystemMessage(content=message.message))
            elif message.message_type == 'human':
                lc_messages.append(HumanMessage(content=message.message))
            elif message.message_type == 'ai':
                lc_messages.append(AIMessage(content=message.message))
        return lc_messages

    def add_message(self, message):
        new_message = Message.objects.create(chat=Chat.objects.get(id=self.chat_id),
                                             message=message.content,
                                             message_type=message.type)
        if new_message.message_type == 'system':
            return SystemMessage(content=new_message.message)
        elif new_message.message_type == 'human':
            return HumanMessage(content=new_message.message)
        elif new_message.message_type == 'ai':
            return AIMessage(content=new_message.message)

    def clear(self):
        pass


def build_memory(chat_id):
    return ConversationBufferMemory(
        chat_memory=MessageHistory(chat_id=str(chat_id)),
        return_messages=True,
        memory_key="chat_history",
        output_key="answer"
    )
