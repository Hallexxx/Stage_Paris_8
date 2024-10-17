from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User
from .models import Users, UserProfiles, Services, News, Projects,Seminar
from django.shortcuts import render, redirect
from django.utils.text import slugify

class LoginForm(AuthenticationForm):
    username = forms.CharField(max_length=150, required=True, label="Nom d'utilisateur")
    password = forms.CharField(widget=forms.PasswordInput, required=True, label="Mot de passe")

class RegisterForm(forms.ModelForm):
    first_name = forms.CharField(max_length=30, required=True, label="Prénom")
    last_name = forms.CharField(max_length=30, required=True, label="Nom")
    email = forms.EmailField(required=True, label="Email")
    password = forms.CharField(widget=forms.PasswordInput, label="Mot de passe")
    service = forms.ModelChoiceField(queryset=Services.objects.all(), empty_label=None, label="Service")

    class Meta:
        model = Users
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'service']

    def save(self, commit=True):
        user = super(RegisterForm, self).save(commit=False)
        user.set_password(self.cleaned_data['password'])
        user.is_active = True
        user.is_staff = False
        user.is_superuser = False
        
        if commit:
            user.save()

            profile_slug = slugify(f"{self.cleaned_data['first_name']} {self.cleaned_data['last_name']}")
            UserProfiles.objects.create(user=user, first_name=self.cleaned_data['first_name'], last_name=self.cleaned_data['last_name'], slug=profile_slug)

            user.service = self.cleaned_data['service']
            user.save()

        return user

    
class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfiles
        fields = ['profile_pic', 'bio', 'department']  

class NewsForm(forms.ModelForm):
    class Meta:
        model = News
        fields = ['title', 'content', 'archive_date']
        widgets = {
            'archive_date': forms.DateInput(attrs={'type': 'date'}),
        }

class ServiceForm(forms.ModelForm):
    class Meta:
        model = Services
        fields = ['name']

class ProjectForm(forms.ModelForm):
    class Meta:
        model = Projects
        fields = ['title', 'start_year', 'end_year', 'project_manager', 'partner', 'financial_resources', 'human_resources']


class SeminarForm(forms.ModelForm):
    class Meta:
        model = Seminar
        fields = ['seminar_number', 'title', 'speaker', 'date', 'summary']