from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import UserProfiles
from django.utils.text import slugify

@receiver(pre_save, sender=UserProfiles)
def create_user_profile_slug(sender, instance, *args, **kwargs):
    if not instance.slug:
        base_slug = slugify(f"{instance.first_name}-{instance.last_name}")
        slug = base_slug
        num = 1
        while UserProfiles.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{num}"
            num += 1
        instance.slug = slug