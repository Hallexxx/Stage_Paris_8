// Fonctions pour gérer l'ajout, l'édition et la suppression des manifestations

function openAddModal_manif() {
    document.getElementById("addManifestationModal").style.display = "block";
}

function closeAddModales() {
    document.getElementById("addManifestationModal").style.display = "none";
}

function openEditModals_manif(id, title, description, date, location, type) {
    document.getElementById("edit_manifestation_id").value = id;
    document.getElementById("edit_title").value = title;
    document.getElementById("edit_description").value = description;
    document.getElementById("edit_date").value = date;
    document.getElementById("edit_location").value = location;
    document.getElementById("edit_type").value = type;

    document.getElementById("editManifestationModal").style.display = "block";
}

function closeEditModales() {
    document.getElementById("editManifestationModal").style.display = "none";
}

function submitAddManifestation(event) {
    event.preventDefault();
    const form = document.getElementById("addManifestationForm");
    const formData = new FormData(form);

    fetch('/add_manifestation/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            closeAddModales();
            location.reload();
        } else {
            alert('Failed to add manifestation.');
        }
    })
    .catch(error => {
        console.error('Error adding manifestation:', error);
        alert('Failed to add manifestation.');
    });
}

function submitEditManifestation(event) {
    event.preventDefault();
    const form = document.getElementById("editManifestationForm");
    const formData = new FormData(form);

    const manifestationId = document.getElementById("edit_manifestation_id").value;

    fetch(`/edit_manifestation/${manifestationId}/`, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
    }).then(response => {
        if (response.ok) {
            closeEditModales();
            window.location.reload();
        } else {
            alert("Failed to edit the manifestation.");
        }
    });
}

function deleteManifestation(id) {
    if (confirm("Are you sure you want to delete this manifestation?")) {

        fetch(`/delete_manifestation/${id}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        }).then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                alert("Failed to delete the manifestation.");
            }
        });
    }
}

