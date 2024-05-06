# Create your models here.
from django.db import models
from django.urls import reverse

class Patient(models.Model):
    patient_id = models.CharField(primary_key=True, max_length=10)
    patient_name = models.CharField(max_length=10)
    def __str__(self):
        return self.patient_id # 之後可改 self.patient_name
    def get_absolute_url(self):
        return self.patient_name

class PatientColonscropyRecord(models.Model):
    patient= models.ForeignKey('Patient', on_delete=models.SET_NULL, null=True)
    Checkdate = models.DateTimeField()
    diagnosis = models.TextField(max_length=1000, help_text='Enter the dignosis')
    def __str__(self):
        return f'{self.patient.patient_name} : {self.Checkdate}'
    def get_absolute_url(self):
        return reverse('patient detail:', args=[str(self.patient.patient_name)])

colon_position=(
    ('a', '升結腸'),
    ('d', '降結腸'),
    ('c', '橫結腸')
)

class Focus(models.Model):
    foucus_id = models.CharField("focus ID", max_length=10)
    focus_name = models.CharField(max_length=20)
    colonscropyRecord = models.ForeignKey('PatientColonscropyRecord', on_delete=models.CASCADE, null=True)
    focus_diagnosis = models.TextField(max_length=100, help_text='Enter the dignosis')
    size = models.CharField(max_length=6, blank=True) #最終可能要寫函式抓文本資料
    position = models.CharField(max_length=1, choices=colon_position) #要寫函式抓
    mark = models.CharField(max_length=20) # 形狀、等級、處置、要寫函式抓
    image = models.ImageField(upload_to='images/') # 圖片路徑設定
    treatment_image = models.ImageField(blank=True) # 圖片路徑設定
    def __str__(self):
        return f'{self.foucus_id}: {self.position} {self.size} {self.focus_name}\n{self.focus_diagnosis}'

SHAPES_CHOICES = (
    ("Sphere", "Sphere"),
    ("Box", "Box"),
    ("Cylinder", "Cylinder"),
)

class Shape(models.Model):
    type = models.CharField(max_length=8, choices=SHAPES_CHOICES)
    color = models.CharField(max_length=7, help_text='hex')
    def __str__(self):
        return str(self.id)