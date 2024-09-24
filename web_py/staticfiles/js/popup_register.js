document.getElementById('add-service-link').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('add-service-popup').style.display = 'block';
});

function closeAddServicePopup() {
    document.getElementById('add-service-popup').style.display = 'none';
}

function submitAddService(event) {
    event.preventDefault();
    const form = document.getElementById("add-service-form");
    const formData = new FormData(form);

    fetch('/add_service/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            closeAddServicePopup();
            location.reload(); // Recharge la page pour voir le nouveau service
        } else {
            alert('Échec de l\'ajout du service.');
        }
    })
    .catch(error => {
        console.error('Erreur lors de l\'ajout du service :', error);
        alert('Échec de l\'ajout du service.');
    });
}