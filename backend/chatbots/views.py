from rest_framework.viewsets import ModelViewSet, mixins, GenericViewSet
from rest_framework.permissions import IsAuthenticated
from .serializers import ChatBotSerializer, StartPromptSerializer
from .models import ChatBot


class StartPromptViewSet(ModelViewSet):
    serializer_class = StartPromptSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.chatbot_set.get(id=self.kwargs['chatbot_id']).startprompt_set

    def perform_create(self, serializer):
        serializer.save(chatbot=ChatBot.objects.get(id=self.kwargs['chatbot_id']))


class ReadChatBotViewSet(mixins.RetrieveModelMixin,
                         mixins.ListModelMixin,
                        mixins.CreateModelMixin,
                     mixins.UpdateModelMixin,
                     mixins.DestroyModelMixin,
                         GenericViewSet):
    serializer_class = ChatBotSerializer
    queryset = ChatBot.objects.all()

    def get_queryset(self):
        return self.request.user.chatbot_set

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ChatBotViewSet(mixins.CreateModelMixin,
                     mixins.UpdateModelMixin,
                     mixins.DestroyModelMixin,
                     GenericViewSet):
    serializer_class = ChatBotSerializer
    permission_classes = [IsAuthenticated]



