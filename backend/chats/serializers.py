from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import Chat, Message


class MessageSerializer(ModelSerializer):
    class Meta:
        model = Message
        fields = (
            'id',
            'message',
            'message_type',
            'created_at'
        )


class ChatSerializer(ModelSerializer):
    messages = SerializerMethodField()

    class Meta:
        model = Chat
        fields = (
            'id',
            'chatbot',
            'messages'
        )

    def get_messages(self, obj):
        return MessageSerializer(obj.message_set, many=True).data



