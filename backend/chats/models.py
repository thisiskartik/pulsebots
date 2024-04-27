from uuid import uuid4
from django.db import models
from chatbots.models import ChatBot
from users.models import User


class Chat(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    chatbot = models.ForeignKey(ChatBot, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.chatbot.name} | {self.user.first_name}"


class Message(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    message = models.TextField()
    message_type = models.CharField(max_length=200, choices=(
        ('system', 'System'),
        ('human', 'Human'),
        ('ai', 'AI')
    ))
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.message} | {self.chat}"
