from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.hashers import check_password
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.core.files.base import ContentFile
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import user_passes_test
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.urls import reverse

from .models import Users, Services, UserProfiles, HeaderLinks, Sections, UserPages, News, Projects, Seminar, Archive, TextModule, PdfModuleContent, TextTitleModuleContent, ImageModuleContent, ModuleType, UserModule, ManifestationScientifique, ArchiveUser
from .forms import LoginForm, RegisterForm, NewsForm, ServiceForm, UserProfileForm , ProjectForm, SeminarForm

from datetime import date
import json
import os


######################################### AFFICHAGE HTML #########################################


def employee_list(request):
    services = Services.objects.prefetch_related('users__profile').all()
    news_list = News.objects.order_by('-published_date')[:5]
    projects = Projects.objects.all()
    seminars = Seminar.objects.order_by('date').all()
    manifestations = ManifestationScientifique.objects.all()

    return render(request, 'employee_list.html', {'services': services, 'news_list': news_list, 'projects': projects, 'seminars': seminars, 'manifestations': manifestations})


def employee_detail(request, slug):
    profile = get_object_or_404(UserProfiles, slug=slug)
    sections = Sections.objects.filter(user__profile__slug=slug)
    user_modules = UserModule.objects.filter(section__in=sections).select_related('module_type_id')
    module_types = ModuleType.objects.all()

    print(f"Profile: {profile}")
    print(f"Sections: {sections}")
    for section in sections:
        print(f"Section: {section}")
        print(f"Number of modules in section: {section.usermodules.count()}")
        for user_module in section.usermodules.all():
            print(f"User Module: {user_module}")
            print(f"Module ID: {user_module.id}")
            print(f"Module Type: {user_module.module_type.name}")

    return render(request, 'employee_detail.html', {
        'profile': profile,
        'sections': sections,
        'user_modules': user_modules,
        'module_types': module_types
    })


def archives_view(request):
    archived_news = Archive.objects.all()  # Récupération des news archivées
    archived_users = ArchiveUser.objects.all()  # Récupération des utilisateurs archivés

    return render(request, 'archive.html', {
        'archived_news': archived_news,
        'archived_users': archived_users,
    })

GLOBAL_PASSWORD = 'Paris8Larbi'

def global_password_protect(request):
    if request.method == 'POST':
        password = request.POST.get('password')

        if password == GLOBAL_PASSWORD:
            # Si le mot de passe est correct, le stocker dans la session
            request.session['global_password_valid'] = True
            return redirect(reverse('login'))  # Redirection vers la page login ou register

    return render(request, 'global_password_protect.html')



######################################### LOGIN #########################################

def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('employee_list')
            else:
                form.add_error(None, 'Nom d\'utilisateur ou mot de passe incorrect')
    else:
        form = LoginForm()
    
    return render(request, 'login.html', {'form': form})


######################################### REGISTER #########################################


def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')  # Redirect to login page after successful registration
        else:
            # If the form is not valid, print the errors (for debugging)
            print(form.errors)
    else:
        form = RegisterForm()

    return render(request, 'register.html', {'form': form})

# @receiver(post_save, sender=Users)
# def create_sections_and_modules(sender, instance, created, **kwargs):
#     if created:
#         print(f"Creating sections and modules for user: {instance.username}")
#         for i in range(3):
#             section = Sections.objects.create(user=instance, name=f"Section {i+1}")
#             print(f"Created section: {section.id} for user: {instance.username}")
#             for j in range(4):
#                 module = Module.objects.create(section=section, name=f"Module {j+1} for Section {i+1}")
#                 print(f"Created module: {module.id} for section: {section.id}")
#                 instance.modules.add(module)




######################################### PROFILE UPDATE #########################################


@csrf_exempt
def update_profile(request, field):
    if request.method == 'POST' and request.user.is_authenticated:
        profile = request.user.profile

        if field == 'email':
            value = request.POST.get('value', '')
            request.user.email = value
            request.user.save()
        elif field == 'first_name':
            value = request.POST.get('value', '')
            profile.first_name = value
        elif field == 'last_name':
            value = request.POST.get('value', '')
            profile.last_name = value
        elif field == 'bio':
            value = request.POST.get('value', '')
            profile.bio = value
        elif field == 'department':
            value = request.POST.get('value', '')
            profile.department = value
        elif field == 'profile_pic':
            if 'profile_pic' in request.FILES:
                profile_pic = request.FILES['profile_pic']
                file_name = default_storage.save(profile_pic.name, ContentFile(profile_pic.read()))
                profile.profile_pic = file_name

        profile.save()
        return JsonResponse({'status': 'success'})
    
    return JsonResponse({'status': 'error'}, status=400)


######################################### NAVBAR SAVE #########################################

@csrf_exempt
@require_POST
@login_required
def save_link(request):
    data = json.loads(request.body)
    link_id = data.get('link_id')
    link_title = data.get('link_title')
    link_url = data.get('link_url')
    user = request.user

    if link_id:
        try:
            link = HeaderLinks.objects.get(id=link_id, user=user)
            link.link_title = link_title
            link.link_url = link_url
            link.save()
            return JsonResponse({'success': True})
        except HeaderLinks.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Link not found'})
    else:
        HeaderLinks.objects.create(user=user, link_title=link_title, link_url=link_url)
        return JsonResponse({'success': True})
    
######################################### NAVBAR DELETE #########################################

@csrf_exempt
@require_POST
@login_required
def delete_link(request):
    data = json.loads(request.body)
    link_id = data.get('link_id')
    user = request.user

    try:
        link = HeaderLinks.objects.get(id=link_id, user=user)
        link.delete()
        return JsonResponse({'success': True})
    except HeaderLinks.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Link not found'})
    

######################################### NEWS CREATE OR UPDATE #########################################

def news_create_or_update(request):
    if request.method == 'POST':
        news_id = request.POST.get('news_id')
        if news_id:  # Si news_id est présent, nous mettons à jour la news existante
            news = get_object_or_404(News, pk=news_id, user=request.user)
            form = NewsForm(request.POST, instance=news)
        else:  # Sinon, nous créons une nouvelle news
            form = NewsForm(request.POST)
        
        if form.is_valid():
            news = form.save(commit=False)
            news.user = request.user  # Assurez-vous que le user est défini
            news.save()
            return redirect('employee_list')
        else:
            return render(request, 'employee_list.html', {
                'form': form,
                'news_list': News.objects.order_by('-published_date')[:5],
                'services': Services.objects.prefetch_related('users__profile').all(),
                'projects': Projects.objects.all(),
                'seminars': Seminar.objects.order_by('date').all(),
            })
    elif request.method == 'GET':  # Gestion de la requête GET pour récupérer les données de la news à modifier
        news_id = request.GET.get('news_id')  # Assurez-vous que vous envoyez news_id comme paramètre dans l'URL fetch
        if news_id:
            news = get_object_or_404(News, pk=news_id, user=request.user)
            data = {
                'id': news.id,
                'title': news.title,
                'content': news.content,
            }
            return JsonResponse(data)  # Renvoyer les données au format JSON
        else:
            return JsonResponse({'error': 'News not found'}, status=404)

    return redirect('employee_list')

def news_detail(request, pk):
    news = get_object_or_404(News, pk=pk, user=request.user)
    data = {
        'id': news.id,
        'title': news.title,
        'content': news.content,
    }
    return JsonResponse(data)

######################################### NEWS DELETE #########################################

@csrf_exempt
@login_required
def news_delete(request, pk):
    news = get_object_or_404(News, pk=pk, user=request.user)
    if request.method == 'POST':
        news.delete()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False})

######################################### ARCHIVE NEWS #########################################

@csrf_exempt
def archive_news(request, news_id):
    if request.method == 'POST':
        news = get_object_or_404(News, id=news_id)

        # Récupération des dates de début et de fin de rétention
        start_date = request.POST.get('startDate')
        end_date = request.POST.get('endDate')

        # Création de l'archive de la news
        Archive.objects.create(
            title=news.title,
            content=news.content,
            published_date=news.published_date,
            archive_date=end_date,  # Archive à la date de fin
            user=news.user
        )

        # Suppression de la news de la table d'origine
        news.delete()

        return JsonResponse({'status': 'success'})

    return JsonResponse({'status': 'error'}, status=400)


######################################### ADD SERVICE #########################################

def add_service(request):
    if request.method == 'POST':
        form = ServiceForm(request.POST)
        if form.is_valid():
            form.save()
            return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'error': 'Invalid request'}, status=400)


######################################### SAVE MODULE #########################################


@csrf_exempt
@login_required
def add_section(request):
    if request.method == 'POST':
        section_name = request.POST.get('section_name')

        # Création de la section
        section = Sections.objects.create(
            name=section_name,
            user=request.user  # Assurez-vous que cette relation est correcte
        )

        # Récupérer les types de modules depuis la base de données
        module_types = ModuleType.objects.all()

        # Créer quatre modules dans la section avec différents types de modules
        for i in range(4):
            module_type = module_types[i % len(module_types)]  # Boucler sur les types de module disponibles
            user_module = UserModule.objects.create(
                section=section,
                module_type=module_type
            )

        return JsonResponse({'status': 'success', 'section_id': section.id})

    return JsonResponse({'status': 'error'}, status=400)

@csrf_exempt  # Temporaire pour simplifier la gestion du CSRF, à adapter pour la production
@login_required
def delete_section(request, section_id):
    if request.method == 'POST':
        try:
            section = get_object_or_404(Sections, id=section_id, user=request.user)
            section.delete()
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'error_message': str(e)}, status=500)

    return JsonResponse({'status': 'error', 'error_message': 'Invalid request method'}, status=400)

@csrf_exempt
def add_module(request, slug):
    if request.method == 'POST':
        section_id = request.POST.get('section_id')
        module_type_id = request.POST.get('module_id')  # Utiliser 'module_id' pour récupérer module_type_id

        section = get_object_or_404(Sections, id=section_id)
        module_type = get_object_or_404(ModuleType, id=module_type_id)
        
        # Ajout du module à la section
        UserModule.objects.create(section=section, module_type_id=module_type_id)  # Utiliser module_type_id

        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'failed'}, status=400)

@login_required
def edit_section_name(request):
    if request.method == 'POST':
        section_id = request.POST.get('section_id')
        new_name = request.POST.get('new_name')
        section = get_object_or_404(Sections, id=section_id)
        section.custom_name = new_name
        section.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'fail'}, status=400)

import logging

logger = logging.getLogger(__name__)

@csrf_exempt
@login_required
def edit_module_content(request):
    if request.method == 'POST':
        # Récupérer les données du formulaire
        module_id = request.POST.get('module_id')
        new_content = request.POST.get('new_content')
        new_title = request.POST.get('new_title')
        new_image = request.FILES.get('new_image')
        new_pdf = request.FILES.get('new_pdf')

        # Log des valeurs reçues
        logger.info(f"module_id: {module_id}, new_content: {new_content}, new_title: {new_title}, new_image: {new_image}, new_pdf: {new_pdf}")

        # Récupérer le module en fonction de l'ID
        module = get_object_or_404(UserModule, id=module_id)

        # Gestion des types de modules
        if module.module_type.name == 'text':
            text_module, created = TextModule.objects.get_or_create(module=module)
            if new_content:  # Vérifie que du contenu a bien été fourni
                text_module.text_content = new_content
            text_module.save()

        elif module.module_type.name == 'image':
            image_module, created = ImageModuleContent.objects.get_or_create(module=module)
            if new_image:  # Vérifie qu'une nouvelle image a été fournie
                image_module.image_path = new_image
            image_module.save()

        elif module.module_type.name == 'pdf':
            pdf_module, created = PdfModuleContent.objects.get_or_create(module=module)
            if new_pdf:  # Vérifie qu'un nouveau fichier PDF a été fourni
                pdf_module.pdf_file = new_pdf
            pdf_module.save()

        elif module.module_type.name == 'text_title':
            text_with_title_module, created = TextTitleModuleContent.objects.get_or_create(module=module)
            if new_title:  # Vérifie qu'un nouveau titre a été fourni
                text_with_title_module.title = new_title
            if new_content:  # Vérifie que du contenu a été fourni
                text_with_title_module.content = new_content
            text_with_title_module.save()

        return JsonResponse({'status': 'success'})

    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)



@csrf_exempt
@login_required
def delete_module(request):
    if request.method == 'POST':
        module_id = request.POST.get('module_id')

        try:
            # Suppression du module en fonction de son ID
            UserModule.objects.filter(id=module_id).delete()
            return JsonResponse({'status': 'success'})
        except UserModule.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Le module spécifié n\'existe pas.'}, status=404)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    return JsonResponse({'status': 'error', 'message': 'Méthode non autorisée.'}, status=405)



@user_passes_test(lambda u: u.is_superuser)
def add_project(request):
    if request.method == "POST":
        form = ProjectForm(request.POST)
        if form.is_valid():
            form.save()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'errors': form.errors}, status=400)
    return JsonResponse({'success': False, 'error': 'Invalid request'}, status=400)

@user_passes_test(lambda u: u.is_superuser)
def edit_project(request, pk):
    project = get_object_or_404(Projects, pk=pk)
    if request.method == "POST":
        form = ProjectForm(request.POST, instance=project)
        if form.is_valid():
            form.save()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'errors': form.errors}, status=400)

@user_passes_test(lambda u: u.is_superuser)
def delete_project(request, pk):
    project = get_object_or_404(Projects, pk=pk)
    project.delete()
    return JsonResponse({'success': True})



@user_passes_test(lambda u: u.is_superuser)
def add_seminar(request):
    if request.method == "POST":
        form = SeminarForm(request.POST)
        if form.is_valid():
            form.save()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'errors': form.errors}, status=400)
    return JsonResponse({'success': False, 'error': 'Invalid request'}, status=400)


@user_passes_test(lambda u: u.is_superuser)
def edit_seminar(request, pk):
    seminar = get_object_or_404(Seminar, pk=pk)
    if request.method == "POST":
        form = SeminarForm(request.POST, instance=seminar)
        if form.is_valid():
            form.save()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'errors': form.errors}, status=400)

@user_passes_test(lambda u: u.is_superuser)
def delete_seminar(request, pk):
    seminar = get_object_or_404(Seminar, pk=pk)
    if request.method == 'POST':
        seminar.delete()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'error': 'Invalid request'}, status=400)


@user_passes_test(lambda u: u.is_superuser)
def add_manifestation(request):
    if request.method == "POST":
        title = request.POST.get('title')
        description = request.POST.get('description')
        date = request.POST.get('date')
        location = request.POST.get('location')
        type = request.POST.get('type')

        manifestation = ManifestationScientifique.objects.create(
            title=title,
            description=description,
            date=date,
            location=location,
            type=type
        )

        return JsonResponse({'success': True})
    
    return JsonResponse({'success': False, 'error': 'Invalid request'}, status=400)

@user_passes_test(lambda u: u.is_superuser)
def edit_manifestation(request, pk):
    manifestation = get_object_or_404(ManifestationScientifique, pk=pk)
    if request.method == "POST":
        # Remplir les données du formulaire avec la requête POST
        title = request.POST.get('title')
        description = request.POST.get('description')
        date = request.POST.get('date')
        location = request.POST.get('location')
        type = request.POST.get('type')

        # Mise à jour de la manifestation
        manifestation.title = title
        manifestation.description = description
        manifestation.date = date
        manifestation.location = location
        manifestation.type = type
        manifestation.save()

        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'error': 'Invalid request'}, status=400)


@user_passes_test(lambda u: u.is_superuser)
def delete_manifestation(request, pk):
    manifestation = get_object_or_404(ManifestationScientifique, pk=pk)
    if request.method == 'POST':
        manifestation.delete()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'error': 'Invalid request'}, status=400)


@csrf_exempt
def archive_user(request, user_id):
    if request.method == 'POST':
        user = get_object_or_404(Users, id=user_id)
        user_profile = user.profile  # Assurez-vous que vous avez une relation OneToOneField avec UserProfile
        
        # Récupération des dates de début et de fin de rétention depuis la requête POST
        start_date = request.POST.get('startDate')
        end_date = request.POST.get('endDate')
        
        # Création de l'archive de l'utilisateur
        ArchiveUser.objects.create(
            email=user.email,
            first_name=user_profile.first_name,
            last_name=user_profile.last_name,
            work_start_date=start_date,
            work_end_date=end_date
        )
        
        # Désactivation du compte utilisateur ou autre logique d'archivage (optionnel)
        user.is_active = False
        user.save()
        
        return JsonResponse({'status': 'success'})
    
    return JsonResponse({'status': 'error'}, status=400)


def delete_user(request, user_id):
    user = get_object_or_404(Users, id=user_id)
    if request.method == 'POST':
        user.delete()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)