# 修改 import_data.py

import os
from datetime import datetime
from django.core.management.base import BaseCommand
from report.models import ColonCaseReport

class Command(BaseCommand):
    help = 'Import patient data from folders'

    def add_arguments(self, parser):
        parser.add_argument('directory', type=str, help='Directory containing patient data')

    @classmethod
    def handle(cls, *args, **kwargs):
        #print(args)
        #print(kwargs)
        directory = kwargs['directory']
        print(directory)
        for folder_name in os.listdir(directory):
            if os.path.isdir(os.path.join(directory, folder_name)):
                try:
                    patient_id, visit_date_str = folder_name.split('+')
                    checkdate = datetime.strptime(visit_date_str, '%Y%m%d').date()
                    
                    folder_path = os.path.join(directory, folder_name)
                    image_path = os.path.join(folder_path, 'image.jpg')
                    treatment_path = os.path.join(folder_path, 'treatment.jpg')
                    report_path = os.path.join(folder_path, 'report.txt')
                    
                    with open(report_path, 'r', encoding='utf-8') as file:
                        lines = file.readlines()
                    
                    focus_diagnosis = []
                    colon_position = []
                    patient_name = None
                    
                    for line in lines:
                        parts = line.strip().split()
                        if parts[0] == 'PatientName':
                            patient_name = ' '.join(parts[1:])
                        elif parts[0] == 'PatientID':
                            patient_id = parts[1]
                        elif parts[0] == 'CheckDate':
                            checkdate = datetime.strptime(parts[1], '%Y%m%d').date()
                        elif len(parts) >= 5:
                            colon_position.append(parts[0])
                            focus_diagnosis.append(' '.join(parts[1:5]))
                    
                    ColonCaseReport.objects.create(
                        patient_name=patient_name,
                        patient_id=patient_id,
                        checkdate=checkdate,
                        image=image_path,
                        treatment_image=treatment_path,
                        findings_endoscopic_diagnosis='\n'.join(focus_diagnosis)
                    )
                except Exception as e:
                    print(f'Failed to import data for {folder_name}: {e}')