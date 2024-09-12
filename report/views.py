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
from collections import defaultdict
import os
from .import_data import readfile
import re

def serialize_datetime(obj): 
    if isinstance(obj, datetime.date): 
        # return obj.isoformat() 
        return obj.strftime("%Y/%m/%d")
    raise TypeError("Type not serializable") 

def home_view(request):
    return render(request, 'report/main.html')

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
    result = ""
    if request.method == 'POST':
        uploaded_files = request.FILES.getlist('file')
        files_data = request.POST.get('files-data', 'default_value')
        try:
            files_data = json.loads(files_data)
        except json.JSONDecodeError:
            return HttpResponse("Invalid files data", status=400)
        if not uploaded_files:
            return HttpResponse("No files uploaded", status=400)
        # for uploaded_file in uploaded_files:
        image_folder_path = os.path.join(settings.MEDIA_ROOT, 'images')
        os.makedirs(image_folder_path, exist_ok=True)
        treatment_image_folder_path = os.path.join(settings.MEDIA_ROOT, 'treatment_image')
        os.makedirs(treatment_image_folder_path, exist_ok=True)
        folders = defaultdict(list) # 建立一個字典，key 是 folder name(病歷號+日期)，value 是一個 list
        paired_files = list(zip(uploaded_files, files_data)) # 將上傳的檔案和對應的資料合併成一個 list
        # print("paired_files:", paired_files)

        # 將檔案分類到對應的 folder 並實際儲存到網站的資料夾
        for file, info in paired_files:
            folder_name = info['secondDir'] # 病歷號+日期
            filename = info['filename'] # 檔案名稱
            folders[folder_name].append([filename, file]) # 分類檔案到對應的 folder
            if "img" in file.name: # 如果檔案名稱有 img，就存到 image 資料夾，iteam[0] 是上傳的檔案
                # 定義儲存路徑
                file_path_1 = os.path.join(image_folder_path, folder_name+filename)
                os.makedirs(os.path.dirname(file_path_1), exist_ok=True)
                with open(file_path_1, 'wb') as destination:
                    for chunk in file.chunks():
                        destination.write(chunk)
            if "tim" in  file.name:
                file_path_2 = os.path.join(treatment_image_folder_path, folder_name+filename)
                os.makedirs(os.path.dirname(file_path_2), exist_ok=True)
                with open(file_path_2, 'wb') as destination:
                    for chunk in file.chunks():
                        destination.write(chunk)        
        # 生成格式化的字符串
        context = []
        for folder_name, filenames in folders.items():
            context.append(folder_name)
            for filename in filenames:
                context.append(f"|- {filename[0]}")
            context.append("")
        result = "\n".join(context)
        # print("folders: ", folders) # folders 的 key 是 folder name(病歷號+日期)，value 是一個 list，list 中的元素是一個 list，包含檔案名稱和檔案本身
        # print()
        # print("folders.items(): ",folders.items()) # folders.items() 是一個迭代器，每次迭代返回一個元素，元素是一個 tuple，tuple 的第一個元素是 key，第二個元素是 value
        # 根據 folders 將相同 folder_name 的檔案中，每當檔案讀到每一組imgN和timN時，就存到資料庫（N是從1開始的變數），當imgN 沒有對應的 timN 時，就只存imgN到資料庫
        for folder_name, filename_and_file in folders.items():
            # 檢查是否有對應的 img 和 tim 檔案名稱，並儲存img 的N值和tim 的N值
            img_filenames = [filename for filename, file in filename_and_file if "img" in filename]
            tim_filenames = [filename for filename, file in filename_and_file if "tim" in filename]
            # print("img_files:",img_filenames)
            # print("tim_files",tim_filenames)  

            print("folder_name:",folder_name)
            # print("filename_and_file:",filename_and_file)

            for filename, file in filename_and_file:
                if filename=='report.txt':
                    print("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
                    # content = file.read().decode('utf-8')
                    # print(content)
                    patientName, focusdata = readfile(file)
                    print("PatientName:",patientName)
                    for num, focus, position, mark, size in focusdata:
                        print(f"num:{num}, focus:{focus}, position:{position}, mark:{mark}, size:{size}")
                    
                    print("-----------------------------")
                    break
            for img in img_filenames:
                # 檢查 img 檔案名稱是否符合 imgN.jpg 或 imgN.png 的格式
                match = re.search(r'^img(\d+)\.(jpg|png)$', img)
                # print("img:",img)
                if match:
                    img_num = match.group(1)
                    corresponding_tim = f'tim{img_num}.jpg'
                    # print("corresponding_tim:",corresponding_tim)
                if corresponding_tim in tim_filenames:
                    # '存 img{img_num}.jpg 和 tim{img_num}.jpg'
                    # get_or_create() 方法，如果資料庫中已經有這筆資料，就不會再新增一筆
                    colon_case_report, created = ColonCaseReport.objects.get_or_create(
                        patient_id = folder_name.split('+')[0],
                        patient_name = patientName,
                        focus_name = focusdata[int(img_num)-1][1],
                        position = focusdata[int(img_num)-1][2],
                        mark = focusdata[int(img_num)-1][3],
                        size = focusdata[int(img_num)-1][4],
                        checkdate = datetime.datetime.strptime(folder_name.split('+')[1], "%Y%m%d"),
                        image = "images/"+folder_name+img,
                        treatment_image = "treatment_image/"+folder_name+corresponding_tim,
                    )
                    if created:
                        print(f"Created new ColonCaseReport for {img} and {corresponding_tim}")
                    else:
                        print(f"ColonCaseReport already exists for {img} and {corresponding_tim}")
                else:
                    # '只存 img{img_num}.jpg'
                    colon_case_report, created = ColonCaseReport.objects.get_or_create(
                        patient_id=folder_name.split('+')[0],
                        patient_name = patientName,
                        focus_name = focusdata[int(img_num)-1][1],
                        position = focusdata[int(img_num)-1][2],
                        mark = focusdata[int(img_num)-1][3],
                        size = focusdata[int(img_num)-1][4],
                        checkdate=datetime.datetime.strptime(folder_name.split('+')[1], "%Y%m%d"),
                        image="images/"+folder_name+img,
                    )
                    if created:
                        print(f"Created new ColonCaseReport for {img}")
                    else:
                        print(f"ColonCaseReport already exists for {img}")
            print("*********************************")
    return render(request, 'report/import_data.html', {'result': result})