from djongo import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.conf import settings

class HeaderLinks(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING)
    link_title = models.CharField(max_length=150)
    link_url = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'header_links'

class Services(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        db_table = 'services'

    def __str__(self):
        return self.name

class Projects(models.Model):
    title = models.CharField(max_length=255)
    start_year = models.IntegerField()
    end_year = models.IntegerField()
    project_manager = models.CharField(max_length=255)
    partner = models.CharField(max_length=255)
    financial_resources = models.DecimalField(max_digits=10, decimal_places=2)
    human_resources = models.TextField()

    class Meta:
        db_table = 'projects'

    def __str__(self):
        return self.title
    
class Seminar(models.Model):
    seminar_number = models.IntegerField()
    title = models.CharField(max_length=255)
    speaker = models.CharField(max_length=255)
    date = models.DateField()
    summary = models.TextField()

    class Meta:
        db_table = 'seminars'

    def __str__(self):
        return f"{self.title} by {self.speaker} on {self.date}"

class UserPages(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING)
    page_title = models.CharField(max_length=150)
    page_content = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_pages'


class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('L\'adresse email doit être fournie')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.date_joined = timezone.now()
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(username, email, password, **extra_fields)

class Users(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(unique=True, max_length=150)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    service = models.ForeignKey('Services', on_delete=models.CASCADE, null=True, related_name='users')

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.username
    

class News(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    published_date = models.DateTimeField(auto_now_add=True)
    archive_date = models.DateField(null=True, blank=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE) 

    class Meta:
        db_table = 'news'

    def __str__(self):
        return self.title
    
class Sections(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sections'
        
    def __str__(self):
        return self.name

class UserProfiles(models.Model):
    user = models.OneToOneField(Users, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=30, blank=True, null=True)
    profile_pic = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    slug = models.SlugField(unique=True, blank=True, null=True)

    class Meta:
        db_table = 'user_profiles'

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(f"{self.first_name}-{self.last_name}")
            slug = base_slug
            num = 1
            while UserProfiles.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{num}"
                num += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
class Archive(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    published_date = models.DateTimeField()
    archive_date = models.DateField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    class Meta:
        db_table = 'archive'

    def __str__(self):
        return self.title
    

class ModuleType(models.Model):
    name = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'module_types'

    def __str__(self):
        return self.name
    

class UserModule(models.Model):
    module_type = models.ForeignKey(ModuleType, on_delete=models.CASCADE)
    section = models.ForeignKey(Sections, related_name='usermodules', on_delete=models.CASCADE)

    class Meta:
        managed = False
        db_table = 'user_modules'

    def __str__(self):
        return f"{self.id} - {self.module_type}"
    

class TextModule(models.Model):
    module = models.ForeignKey(UserModule, on_delete=models.CASCADE)
    contenu = models.TextField()

    class Meta:
        managed = False
        db_table = 'text_module'


class PdfModuleContent(models.Model):
    module = models.ForeignKey(UserModule, on_delete=models.CASCADE)
    fichier = models.FileField(upload_to='pdfs/')

    class Meta:
        managed = False
        db_table = 'pdf_module_content'

    def __str__(self):
        return self.fichier.name  # Affiche le nom du fichier PDF

class TextTitleModuleContent(models.Model):
    module = models.ForeignKey(UserModule, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    text_content = models.TextField()

    class Meta:
        managed = False
        db_table = 'pdf_module_content'

    def __str__(self):
        return self.module.name
    
class ImageModuleContent(models.Model):
    module = models.ForeignKey(UserModule, on_delete=models.CASCADE)
    image_url = models.URLField()

    class Meta:
        managed = False
        db_table = 'pdf_module_content'

    def __str__(self):
        return self.module.name
    
class ManifestationScientifique(models.Model):
    TYPES_MANIFESTATION = [
        ('Special Session', 'Special Session'),
        ('Special Issue', 'Special Issue'),
        ('International Workshop', 'International Workshop'),
        ('Manifestations scientifiques internationales', 'Manifestations scientifiques internationales'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateField()
    location = models.CharField(max_length=255)
    type = models.CharField(max_length=50, choices=TYPES_MANIFESTATION)

    class Meta:
        managed = False
        db_table = 'manifestations_scientifiques'

    def __str__(self):
        return self.title
    
class ArchiveUser(models.Model):
    email = models.EmailField()
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    work_start_date = models.DateField()
    work_end_date = models.DateField()

    class Meta:
        managed = False
        db_table = 'archive_user'

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    