# Generated by Django 5.0 on 2024-01-10 15:37

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('knowledgebases', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name='knowledgebase',
            name='vectorized',
        ),
        migrations.AddField(
            model_name='knowledgebase',
            name='user',
            field=models.ForeignKey(default='fa1c2e8e-5e9b-4074-9e90-15afbffb03fd', on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='knowledgebase',
            name='vectorized_status',
            field=models.CharField(choices=[('loading', 'Loading'), ('success', 'Success'), ('failed', 'Failed')], default='loading', max_length=200),
        ),
    ]
