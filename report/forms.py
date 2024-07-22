# for download ...  not success yet
from django import forms
# from .models import ColonCaseReport

class SearchForm(forms.Form):
    patient_id = forms.CharField(max_length=10, required=False, label="病歷號", widget=forms.TextInput(attrs={'placeholder': '輸入病患ID', 'class':'form-control'}))
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # patients_ids = ColonCaseReport.objects.values_list('patient_id', flat=True).distinct()
        self.fields['patient_id'].widget.attrs.update(
            [{'list' , 'patient_ids'}])