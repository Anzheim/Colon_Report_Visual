# Generated by Django 5.0.4 on 2024-06-18 04:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('report', '0006_rename_foucus_id_focus_focus_id'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Shape',
        ),
        migrations.AlterField(
            model_name='focus',
            name='position',
            field=models.CharField(choices=[('a', '升結腸'), ('d', '降結腸'), ('t', '橫結腸')], max_length=1),
        ),
    ]
