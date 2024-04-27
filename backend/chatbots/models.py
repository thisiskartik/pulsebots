import os
from uuid import uuid4
from django.db import models
from django.dispatch import receiver
from django.core.exceptions import ObjectDoesNotExist
from users.models import User
from knowledgebases.models import KnowledgeBase


def upload_icon(instance, filename):
    return f"chatbots/{instance.id}{os.path.splitext(filename)[1]}"


class ChatBot(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    name = models.CharField(max_length=200)
    icon = models.FileField(upload_to=upload_icon, null=True, blank=True, max_length=500)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField()
    greeting_message = models.TextField()
    knowledgebases = models.ManyToManyField(KnowledgeBase)

    def __str__(self):
        return f"{self.name} | {self.user.first_name} {self.user.last_name}"


class StartPrompt(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    chatbot = models.ForeignKey(ChatBot, on_delete=models.CASCADE)
    message = models.TextField()

    def __str__(self):
        return f"{self.message} | {self.chatbot.name}"


@receiver(models.signals.pre_save, sender=ChatBot)
def auto_delete_file_on_change(sender, instance, **kwargs):
    try:
        chatbot = ChatBot.objects.get(id=instance.id)
    except ObjectDoesNotExist:
        return False

    old_icon = chatbot.icon
    if old_icon:
        if not old_icon == instance.icon:
            if os.path.isfile(old_icon.path):
                os.remove(old_icon.path)


@receiver(models.signals.post_delete, sender=ChatBot)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    if instance.icon:
        if os.path.isfile(instance.icon.path):
            os.remove(instance.icon.path)
