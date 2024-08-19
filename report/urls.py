from django.urls import path, re_path
from .views import home_view, search, report_detail, import_data

app_name = 'report'
urlpatterns = [
    path('', home_view, name="home"),
    path('search/', search, name='search'),
    re_path(r'^report/(?P<patient_id>[^/]+)/(?P<checkdate>[^/]*)/$', report_detail, name='report_detail'),
    path('import_data/', import_data, name='import_data'),
    path('import_result/', import_data, name='import_result'),
] 