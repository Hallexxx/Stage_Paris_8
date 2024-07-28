function openArchivePopup(userId) {
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

    fetch(`/archive_user/${userId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': '{{ csrf_token }}'
        },
        body: `startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
    }).then(response => {
        if (response.ok) {
            closeArchivePopup();
            alert('Utilisateur archivé avec succès.');
            window.location.reload();  // Recharger la page pour refléter les changements
        } else {
            alert('Erreur lors de l\'archivage de l\'utilisateur.');
        }
    }).catch(error => {
        console.error('Erreur AJAX :', error);
        alert('Erreur lors de l\'archivage de l\'utilisateur.');
    });
});

document.querySelectorAll(".delete-user-button").forEach(button => {
    button.addEventListener("click", function() {
        let userId = this.getAttribute("data-user-id");
        if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userId}?`)) {
            fetch(`/delete_user/${userId}/`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': '{{ csrf_token }}'
                }
            }).then(response => {
                if (response.ok) {
                    alert('Utilisateur supprimé avec succès.');
                    window.location.reload();  // Recharger la page pour refléter les changements
                } else {
                    alert('Erreur lors de la suppression de l\'utilisateur.');
                }
            }).catch(error => {
                console.error('Erreur AJAX :', error);
                alert('Erreur lors de la suppression de l\'utilisateur.');
            });
        }
    });
});
