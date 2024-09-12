# Create your models here.
from django.db import models

colon_position=(
    ('an', '近升結腸'),
    ('af', '遠升結腸'),
    ('dn', '近降結腸'),
    ('df', '遠降結腸'),
    ('tn', '近橫結腸'),
    ('tf', '遠橫結腸'),
    ('c', '盲腸'),
    ('s', '乙狀結腸'),
    ('r', '直腸')
)

class ColonCaseReport(models.Model):
    mark = models.CharField(max_length=20, null=True, blank=True) # 形狀、等級、處置、要寫函式抓
    size = models.CharField(max_length=10, null=True, blank=True)
    focus_diagnosis = models.TextField(max_length=100, null=True, blank=True)
    focus_name = models.CharField(max_length=20, null=True, blank=True)
    patient_name = models.CharField(max_length=10, null=True, blank=True)
    patient_id = models.CharField("病歷號", max_length=10, null=True, blank=True) #病歷號
    checkdate = models.DateField("檢查日期", null=True, blank=True) #檢查日期
    position = models.CharField(max_length=2, choices=colon_position, null=True, blank=True) #要寫函式抓
    image = models.ImageField(upload_to='images/', null=True, blank=True) # 圖片路徑設定
    treatment_image = models.ImageField(upload_to='treatment_image/', blank=True) # 圖片路徑設定
    treatment = models.TextField(max_length=100, null=True, blank=True)
    #indication = models.CharField(max_length=255) #適應症
    #consent = models.TextField() #同意書
    comorbidity = models.CharField(max_length=255, null=True, blank=True) #共病症
    sedation = models.CharField(max_length=255, null=True, blank=True) #是否適用鎮靜藥物
    medication = models.TextField(null=True, blank=True) #檢查用藥
    start_time = models.DateTimeField(null=True, blank=True) #開始時間
    reach_cecum_time = models.DateTimeField(null=True, blank=True) #到達盲腸開始退出時間
    end_time = models.DateTimeField(null=True, blank=True) #結束時間
    insertion_time = models.DurationField(null=True, blank=True) #插入總共時間
    withdraw_time = models.DurationField(null=True, blank=True) #拔出總共時間
    insertion_level = models.CharField(max_length=255, null=True, blank=True) #大腸鏡到達最長深度
    #colon_preparation = models.CharField(max_length=255) 
    cleansing_agent = models.CharField(max_length=255, null=True, blank=True) #清腸用藥
    colon_cleansing_level = models.CharField(max_length=255, null=True, blank=True) #清腸程度
    complication = models.CharField(max_length=255, null=True, blank=True) #大腸鏡檢後併發症
    count_of_specimen = models.IntegerField(null=True, blank=True) #檢體數量
    findings_endoscopic_diagnosis = models.TextField(null=True, blank=True) #診斷與處置
    recommendations = models.TextField(null=True, blank=True) #建議
    others = models.TextField(null=True, blank=True) #其他備註
    impression = models.TextField(null=True, blank=True) #初步診斷結果

    def __str__(self):
        return f"Record {self.patient_id} on {self.checkdate}" 