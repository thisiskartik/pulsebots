# Generated by Django 5.0.1 on 2024-01-12 09:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('knowledgebases', '0004_alter_knowledgebase_content_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='knowledgebase',
            name='type',
            field=models.CharField(choices=[('file/text', 'Text'), ('file/pdf', 'PDF'), ('file/docx', 'Microsoft Word'), ('file/pptx', 'Microsoft PowerPoint'), ('file/csv', 'CSV'), ('file/markdown', 'Markdown'), ('content/webpage', 'Webpage'), ('content/website', 'Website'), ('content/sitemap', 'Sitemap')], max_length=200),
        ),
    ]
