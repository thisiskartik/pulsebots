from django.urls import path
from .views import create_chat, get_chat, invoke_chat


urlpatterns = [
    path('', create_chat),
    path('<str:chat_id>/', get_chat),
    path('<str:chat_id>/invoke/', invoke_chat)
]
