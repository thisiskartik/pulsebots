from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import KnowledgeBase


class KnowledgeBaseSerializer(ModelSerializer):
    embedding_count = SerializerMethodField()

    class Meta:
        model = KnowledgeBase
        fields = (
            'id',
            'name',
            'type',
            'file',
            'content_url',
            'vectorized_status',
            'embedding_count'
        )

    def get_embedding_count(self, obj):
        return obj.knowledgebasedocument_set.count()
