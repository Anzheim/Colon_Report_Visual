# Generated by Django 4.2.12 on 2024-09-12 12:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('report', '0012_coloncasereport_size_alter_coloncasereport_position'),
    ]

    operations = [
        migrations.AddField(
            model_name='coloncasereport',
            name='treatment',
            field=models.TextField(blank=True, max_length=100, null=True),
        ),
    ]
