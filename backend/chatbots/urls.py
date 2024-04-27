from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReadChatBotViewSet, StartPromptViewSet


startprompts_router = DefaultRouter()
startprompts_router.register('startprompts', StartPromptViewSet, basename='startprompts')

# chatbots_router = DefaultRouter()
# chatbots_router.register('', ChatBotViewSet, basename="chatbots")
read_chatbots_router = DefaultRouter()
read_chatbots_router.register('', ReadChatBotViewSet, basename="read_chatbots")

urlpatterns = [
    # path('', include(chatbots_router.urls)),
    path('', include(read_chatbots_router.urls)),
    path('<str:chatbot_id>/', include(startprompts_router.urls)),
]
