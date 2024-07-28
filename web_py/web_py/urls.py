from django.contrib import admin
from django.urls import path, include  
from django.views.generic.base import RedirectView 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('employees.urls')), 
    path('', RedirectView.as_view(url='/employee_list/', permanent=False)),  # Redirection automatique
]