from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .serializers import KnowledgeBaseSerializer
from .vector_store import vector_store
from .models import KNOWLEDGE_BASE_TYPES, KnowledgeBase
from .utils import trailing_slash


class KnowledgeBaseViewSet(ModelViewSet):
    serializer_class = KnowledgeBaseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.knowledgebase_set

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        if 'file' in serializer.validated_data or \
                ('content_url' in serializer.validated_data and
                 trailing_slash(KnowledgeBase.objects.get(id=self.kwargs['pk']).content_url) !=
                 trailing_slash(serializer.validated_data.get('content_url'))):
            serializer.save(vectorized_status='loading')
        else:
            serializer.save()


@api_view(['GET'])
def test(request):
    print(vector_store.as_retriever(search_kwargs={'filter': {'knowledgebase':['275415c7-ef5f-4932-8a21-3f5df415127e', 'da5bcc7e-314e-44eb-95d2-a14e2d93140f']}}))
    return Response({'test': 'success'})


@api_view(['GET'])
def get_knowledge_base_types(request):
    serialized_types = [{
        'value': knowledge_base_type[0], 'label': knowledge_base_type[1]
    } for knowledge_base_type in KNOWLEDGE_BASE_TYPES]
    return Response(serialized_types)
