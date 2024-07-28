i18next.use(i18nextBrowserLanguageDetector).init({
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          "welcome": "Welcome to our website",
          "service_name": "Service Name"
        }
      },
      fr: {
        translation: {
          "welcome": "Bienvenue sur notre site Web",
          "service_name": "Nom du service"
        }
      }
    }
}, function(err, t) {
    // Initialisé et prêt à l'emploi
    updateContent();
});

function updateContent() {
    document.getElementById('welcome').innerText = i18next.t('welcome');
    document.getElementById('service-name-label').innerText = i18next.t('service_name');
}

// Changer la langue en fonction de la sélection de l'utilisateur
document.getElementById('language-selector').addEventListener('change', function() {
    i18next.changeLanguage(this.value, updateContent);
});