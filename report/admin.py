from django.contrib import admin
from .models import Shape, Patient, PatientColonscropyRecord, Focus

# Register your models here.
admin.site.register(Shape)
admin.site.register(Patient)
admin.site.register(PatientColonscropyRecord)
admin.site.register(Focus)
