from rest_framework.serializers import ModelSerializer, SerializerMethodField
from knowledgebases.serializers import KnowledgeBaseSerializer
from .models import ChatBot, StartPrompt


class StartPromptSerializer(ModelSerializer):
    class Meta:
        model = StartPrompt
        fields = (
            'id',
            'message'
        )


class ChatBotSerializer(ModelSerializer):
    start_prompts = SerializerMethodField()

    class Meta:
        model = ChatBot
        fields = (
            'id',
            'name',
            'icon',
            'description',
            'greeting_message',
            'start_prompts',
            'knowledgebases'
        )

    def get_start_prompts(self, obj):
        return StartPromptSerializer(obj.startprompt_set, many=True).data
