from django.urls import path
from .views import ( employee_list, employee_detail, login_view, register_view, update_profile, save_link, 
delete_link, news_create_or_update, news_delete, add_service, edit_module_content, delete_module, news_detail, 
add_project, edit_project, delete_project, add_seminar, edit_seminar, delete_seminar, add_section, add_module, edit_section_name, 
add_manifestation, edit_manifestation, delete_manifestation, delete_section, archive_user, delete_user)
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('employee_list/', employee_list, name='employee_list'),
    path('employee/<slug:slug>/', employee_detail, name='employee_detail'),
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('profile/', update_profile, name='profile_detail'),
    path('update_profile/<str:field>/', update_profile, name='update_profile'),
    path('save-link/', save_link, name='save_link'),
    path('delete-link/', delete_link, name='delete_link'),
    path('news/<int:pk>/', news_detail, name='news_detail'),
    path('news/create_or_update/', news_create_or_update, name='news_create_or_update'),
    path('news/<int:pk>/delete/', news_delete, name='news_delete'),
    path('add_service/', add_service, name='add_service'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('add_project/', add_project, name='add_project'),
    path('edit_project/<int:pk>/', edit_project, name='edit_project'),
    path('delete_project/<int:pk>/', delete_project, name='delete_project'),
    path('add_seminar/', add_seminar, name='add_seminar'),
    path('edit_seminar/<int:pk>/', edit_seminar, name='edit_seminar'),
    path('delete_seminar/<int:pk>/', delete_seminar, name='delete_seminar'),
    path('add_manifestation/', add_manifestation, name='add_manifestation'),
    path('edit_manifestation/<int:pk>/', edit_manifestation, name='edit_manifestation'),
    path('delete_manifestation/<int:pk>/', delete_manifestation, name='delete_manifestation'),
    path('edit_module/', edit_module_content, name='edit_module_content'),
    path('delete_module/', delete_module, name='delete_module'),
    path('add_section/', add_section, name='add_section'),
    path('employee/<slug:slug>/add_module/', add_module, name='add_module'),
    path('edit-section-name/', edit_section_name, name='edit_section_name'),
    path('delete_section/<int:section_id>/', delete_section, name='delete_section'),
    path('archive_user/<int:user_id>/', archive_user, name='archive_user'),
    path('delete_user/<int:user_id>/', delete_user, name='delete_user'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
