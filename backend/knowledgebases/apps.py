from django.apps import AppConfig


class KnowledgebasesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'knowledgebases'

    def ready(self):
        import knowledgebases.signals
