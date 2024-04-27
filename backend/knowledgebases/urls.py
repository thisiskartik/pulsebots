from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import KnowledgeBaseViewSet, test, get_knowledge_base_types


knowledgebases_router = DefaultRouter()
knowledgebases_router.register('', KnowledgeBaseViewSet, basename='knowledgebases')

urlpatterns = [
    path('types/', get_knowledge_base_types),
    path('test/', test),
    path('', include(knowledgebases_router.urls)),
]
