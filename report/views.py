from django.shortcuts import render
from .models import Shape, Focus
import json
import datetime
# Create your views here.

def serialize_datetime(obj): 
    if isinstance(obj, datetime.datetime): 
        # return obj.isoformat() 
        return obj.strftime("%Y-%m-%d %H:%M:%S")
    raise TypeError("Type not serializable") 

def home_view(request):
    shapes = [{"type": x.type, "color": x.color} for x in Shape.objects.all()]
    # 查完 patient_id 後的結果
    focuses = [ {
        "patient_name":y.colonscropyRecord.patient.patient_name,
        "check_date":serialize_datetime(y.colonscropyRecord.Checkdate),
        "focus_name":y.focus_name,
        "focus_diagnosis":y.focus_diagnosis,
        "mark": y.mark,
        "position":y.position,
        "image": str(y.image),
        } for y in Focus.objects.all()]
    shape_json = json.dumps(shapes)
    focuses_json = json.dumps(focuses)
    context = {'shapes': shape_json, 'focuses': focuses_json}
    return render(request, 'report/main.html', context)