function choisirOngletStatique() {
    var sections = document.querySelectorAll('section');
    sections.forEach(function(section) {
        section.style.display = 'none';
    });
    document.getElementById('static-section').style.display = 'block';
    var boutons = document.querySelectorAll('.bouton-onglet');
    boutons.forEach(function(bouton) {
        bouton.classList.remove('selected');
    });
    document.querySelector('.bouton-onglet[href="#static-section"]').classList.add('selected');
    // Mettre à jour le trait noir
    var traitNoir = document.querySelector('.trait-noir');
    var boutonSelectionne = document.querySelector('.bouton-onglet[href="#static-section"]');
    var boutonSelectionnePosition = boutonSelectionne.offsetLeft;
    traitNoir.style.width = boutonSelectionne.offsetWidth + 'px';
    traitNoir.style.transform = 'translateX(' + boutonSelectionnePosition + 'px)';
}

window.choisirOnglet = function(index) {
    var sections = document.querySelectorAll('section');
    sections.forEach(function(section, idx) {
        if (idx === index) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
    var boutons = document.querySelectorAll('.bouton-onglet');
    boutons.forEach(function(bouton, idx) {
        if (idx === index) {
            bouton.classList.add('selected');
        } else {
            bouton.classList.remove('selected');
        }
    });
    var traitNoir = document.querySelector('.trait-noir');
    var boutonSelectionne = boutons[index];
    var boutonSelectionnePosition = boutonSelectionne.offsetLeft;
    traitNoir.style.width = boutonSelectionne.offsetWidth + 'px';
    traitNoir.style.transform = 'translateX(' + boutonSelectionnePosition + 'px)';
}

// Appel initial pour sélectionner la première section
window.onload = function() {
    choisirOnglet(0);  // Sélectionne la première section au chargement de la page
}