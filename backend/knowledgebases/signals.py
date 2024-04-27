import os
from django.db import models
from django.dispatch import receiver
from django.core.exceptions import ObjectDoesNotExist
from .models import KnowledgeBase, KnowledgeBaseDocument
from .vector_store import vector_store
from .tasks import vectorize


@receiver(models.signals.pre_save, sender=KnowledgeBase)
def auto_delete_file_on_change(sender, instance, **kwargs):
    try:
        knowledgebase = KnowledgeBase.objects.get(id=instance.id)
    except ObjectDoesNotExist:
        return False

    old_file = knowledgebase.file
    if old_file:
        if not old_file == instance.file:
            if os.path.isfile(old_file.path):
                os.remove(old_file.path)


@receiver(models.signals.post_delete, sender=KnowledgeBase)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    if instance.file:
        if os.path.isfile(instance.file.path):
            os.remove(instance.file.path)


def delete_documents(knowledgebase):
    knowledgebasedocuments = KnowledgeBaseDocument.objects.filter(knowledgebase=knowledgebase)
    document_ids = [str(document_id) for document_id in list(
        knowledgebasedocuments.values_list('chroma_id', flat=True)
    )]
    if len(document_ids) > 0:
        vector_store.delete(document_ids)
        knowledgebasedocuments.delete()


@receiver(models.signals.pre_delete, sender=KnowledgeBase)
def auto_delete_vectors_on_delete(sender, instance, **kwargs):
    delete_documents(instance)


@receiver(models.signals.post_save, sender=KnowledgeBase)
def auto_vectorize_on_save(sender, instance, **kwargs):
    if instance.vectorized_status == 'loading':
        delete_documents(instance)
        vectorize.delay(instance.id)
