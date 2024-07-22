from django.shortcuts import render, get_list_or_404
from django.http import HttpResponse
import json
import datetime
from .forms import SearchForm
from .models import  ColonCaseReport
import json
import datetime
from django.db.models import Min
from django.conf import settings
import os
from .import_data import Command

def serialize_datetime(obj): 
    if isinstance(obj, datetime.date): 
        # return obj.isoformat() 
        return obj.strftime("%Y/%m/%d")
    raise TypeError("Type not serializable") 

def home_view(request):
    # 查完 patient_id 後的結果
    focuses = [ {
        "patient_name":y.patient_name,
        "check_date":serialize_datetime(y.checkdate),
        "focus_name":y.focus_name,
        "focus_diagnosis":y.focus_diagnosis,
        "mark": y.mark,
        "size": y.size,
        "position":y.position,
        "image": str(y.image),
        "treatment_image":str(y.treatment_image)
        } for y in ColonCaseReport.objects.all()]
    #shape_json = json.dumps(shapes)
    focuses_json = json.dumps(focuses)
    context = {'focuses': focuses_json}
    return render(request, 'report/main.html', context)

def search(request):
    form = SearchForm(request.GET or None)
    records = []
    first_date_records = []
    # patient_id = ""
    patient_id = request.GET.get('patient_id', '')  #從 GET 請求中取得 Patient_id
    patient_ids = ColonCaseReport.objects.values_list('patient_id', flat=True).distinct()
    if form.is_valid():
        patient_id = form.cleaned_data.get('patient_id')
        if patient_id:
            records = ColonCaseReport.objects.filter(patient_id__exact=patient_id).order_by('checkdate')
            first_dates = records.values('checkdate').annotate(first_id=Min('id'))
            first_date_records = ColonCaseReport.objects.filter(id__in=[item['first_id'] for item in first_dates])
    return render(request, 'report/search.html', {'form': form, 'records': first_date_records, 'patient_id': patient_id, 'patient_ids':patient_ids})

def report_detail(request, patient_id, checkdate):
    if(checkdate=="all"):
        # report = get_object_or_404(ColonCaseReport, patient_id=patient_id) # 只能回傳一筆
        report = ColonCaseReport.objects.filter(patient_id__exact=patient_id)
        records = report
    elif(checkdate):
        report = get_list_or_404(ColonCaseReport, patient_id=patient_id, checkdate=checkdate)
        records = ColonCaseReport.objects.filter(patient_id__exact=patient_id)
        records = records.filter(checkdate__exact=checkdate)
    else:
        pass
    focuses = [ {
        "patient_name":y.patient_name,
        "check_date":serialize_datetime(y.checkdate),
        "focus_name":y.focus_name,
        "focus_diagnosis":y.focus_diagnosis,
        "mark": y.mark,
        "size": y.size,
        "position":y.position,
        "image": str(y.image),
        "treatment_image":str(y.treatment_image)
        } for y in records]
    #shape_json = json.dumps(shapes)
    focuses_json = json.dumps(focuses)
    return render(request, 'report/report_detail.html', {'report': report, 'focuses': focuses_json})

def import_data(request):
    files = []
    if request.method == 'POST':
        uploaded_files = request.FILES.getlist('file_field')
        print(uploaded_files)
        if not uploaded_files:
            return HttpResponse("No files uploaded", status=400)
    
        for uploaded_file in uploaded_files:
            print(uploaded_file)
            print(uploaded_file.name.split('/')[0])
            files += uploaded_file.name.split('/')[0]
            # files += uploaded_files
        folder_path = os.path.join(settings.MEDIA_ROOT, 'uploaded_folder')
        os.makedirs(folder_path, exist_ok=True)
        for uploaded_file in uploaded_files:
            file_path = os.path.join(folder_path, uploaded_file.name)
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            with open(file_path, 'wb+') as destination:
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)
        import_command = Command()
        import_command.handle(directory=folder_path)
       # return render(request, 'report/import_result.html', {'result': 'Data imported successfully'})
    return render(request, 'report/import_data.html', {'result': files})

def import_test(request):
    files = []
    if request.method == 'POST':
        uploaded_files = request.FILES.getlist('file')
        print(uploaded_files)
        if not uploaded_files:
            return HttpResponse("No files uploaded", status=400)
    
        for uploaded_file in uploaded_files:
            print(uploaded_file)
            print(uploaded_file.name.split('/')[0])
            files += uploaded_file.name.split('/')[0]
            # files += uploaded_files
        folder_path = os.path.join(settings.MEDIA_ROOT, 'uploaded_folder')
        os.makedirs(folder_path, exist_ok=True)
        for uploaded_file in uploaded_files:
            file_path = os.path.join(folder_path, uploaded_file.name)
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            with open(file_path, 'wb+') as destination:
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)
        import_command = Command()
        import_command.handle(directory=folder_path)
       # return render(request, 'report/import_result.html', {'result': 'Data imported successfully'})
    return render(request, 'report/import_test.html', {'result': files})