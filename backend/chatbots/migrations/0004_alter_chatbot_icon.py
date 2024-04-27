# Generated by Django 5.0.1 on 2024-02-05 07:57

import chatbots.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chatbots', '0003_chatbot_knowledgebases'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chatbot',
            name='icon',
            field=models.FileField(blank=True, null=True, upload_to=chatbots.models.upload_icon),
        ),
    ]
