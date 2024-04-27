import os
from uuid import uuid4
from django.db import models
from users.models import User

KNOWLEDGE_BASE_TYPES = (
    ('file/text', 'Text'),
    ('file/pdf', 'PDF'),
    ('file/docx', 'Microsoft Word'),
    ('file/pptx', 'Microsoft PowerPoint'),
    ('file/markdown', 'Markdown'),
    ('content/webpage', 'Webpage'),
    ('content/website', 'Website')
)


def upload_file(instance, filename):
    return f"knowledgebases/{instance.id}{os.path.splitext(filename)[1]}"


class KnowledgeBase(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    name = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    type = models.CharField(max_length=200, choices=KNOWLEDGE_BASE_TYPES)
    file = models.FileField(upload_to=upload_file, null=True, blank=True, max_length=500)
    content_url = models.URLField(max_length=1000, null=True, blank=True)
    vectorized_status = models.CharField(max_length=200, default='loading', choices=(
        ('loading', 'Loading'),
        ('success', 'Success'),
        ('failed', 'Failed')
    ))

    def __str__(self):
        type_class = self.type.split('/')[0]
        if type_class == 'file':
            return f"{self.name} | {self.file.name}"
        elif type_class == 'content':
            return f"{self.name} | {self.content_url}"


class KnowledgeBaseDocument(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    chroma_id = models.UUIDField()

    knowledgebase = models.ForeignKey(KnowledgeBase, on_delete=models.CASCADE)
    text = models.TextField()

    def __str__(self):
        return f"{self.text} | {self.knowledgebase.name}"
