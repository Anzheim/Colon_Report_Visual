# Generated by Django 5.0.4 on 2024-05-05 19:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('report', '0003_alter_patient_patient_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='patientcolonscropyrecord',
            name='Checkdate',
            field=models.DateTimeField(),
        ),
    ]
