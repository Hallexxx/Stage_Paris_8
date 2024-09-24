from django.shortcuts import redirect
from django.conf import settings
from django.urls import reverse

class GlobalPasswordProtectMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Liste des URLs protégées
        protected_paths = ['/login/', '/register/']

        # Vérifier si l'utilisateur a fourni le mot de passe correct
        if request.path in protected_paths and not request.session.get('global_password_valid'):
            # Rediriger vers la page de saisie du mot de passe si non valide
            return redirect(reverse('global_password_protect'))

        response = self.get_response(request)
        return response
