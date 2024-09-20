document.addEventListener("DOMContentLoaded", function() {
    console.log("Le DOM est chargé, attachement des événements...");

    // Attache l'événement de clic aux boutons d'archivage
    document.querySelectorAll('.archive-user-button').forEach(function(button) {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            console.log("Ouverture du popup pour archivage de l'utilisateur ID : ", userId);
            openArchivePopup(userId);
        });
    });

    // Attache l'événement de clic aux boutons de suppression
    document.querySelectorAll('.delete-user-button').forEach(function(button) {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            console.log("Tentative de suppression de l'utilisateur avec ID : ", userId);
            deleteUsers(userId);
        });
    });
});

function openArchivePopup(userId) {
    console.log("Ouverture du popup pour l'utilisateur : ", userId);
    document.getElementById("archivePopup").style.display = "block";
    document.getElementById("userId").value = userId;
}

function closeArchivePopup() {
    document.getElementById("archivePopup").style.display = "none";
}

document.getElementById("archiveForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let userId = document.getElementById("userId").value;
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value;

    console.log("Tentative d'archivage de l'utilisateur avec ID : ", userId);

    fetch(`/archive_user/${userId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: `startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
    }).then(response => {
        if (response.ok) {
            closeArchivePopup();
            alert('Utilisateur archivé avec succès.');
            window.location.reload();
        } else {
            alert('Erreur lors de l\'archivage de l\'utilisateur.');
        }
    }).catch(error => {
        console.error('Erreur AJAX :', error);
        alert('Erreur lors de l\'archivage de l\'utilisateur.');
    });
});

function deleteUsers(userId) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userId}?`)) {
        console.log("Suppression de l'utilisateur avec ID : ", userId);
        fetch(`/delete_user/${userId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                alert('Utilisateur supprimé avec succès.');
                window.location.reload();
            } else {
                alert('Erreur lors de la suppression de l\'utilisateur.');
            }
        }).catch(error => {
            console.error('Erreur AJAX :', error);
            alert('Erreur lors de la suppression de l\'utilisateur.');
        });
    }
}
