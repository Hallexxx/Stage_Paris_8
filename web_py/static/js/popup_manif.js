// Fonctions pour gérer l'ajout, l'édition et la suppression des manifestations

function openAddModal_manif() {
    document.getElementById("addManifestationModal").style.display = "block";
}

function closeAddModales() {
    document.getElementById("addManifestationModal").style.display = "none";
}

function openEditModales(id) {
    document.getElementById("editManifestationModal").style.display = "block";
    $.ajax({
        url: `/get_manifestation/${id}/`,
        type: 'GET',
        success: function(response) {
            $('#edit_manifestation_id').val(response.id);
            $('#edit_title').val(response.title);
            $('#edit_description').val(response.description);
            $('#edit_date').val(response.date);
            $('#edit_location').val(response.location);
            $('#edit_type').val(response.type);
        },
        error: function(error) {
            alert('Failed to fetch manifestation data.');
        }
    });
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
    const manifestationId = formData.get('id');

    fetch(`/edit_manifestation/${manifestationId}/`, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            closeEditModales();
            location.reload();
        } else {
            alert('Failed to edit manifestation.');
        }
    })
    .catch(error => {
        console.error('Error editing manifestation:', error);
        alert('Failed to edit manifestation.');
    });
}

function deleteManifestation(id) {
    if (confirm('Are you sure you want to delete this manifestation?')) {
        fetch(`/delete_manifestation/${id}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        })
        .then(response => {
            if (response.ok) {
                location.reload();
            } else {
                throw new Error('Failed to delete manifestation.');
            }
        })
        .catch(error => {
            console.error('Error deleting manifestation:', error);
            alert('Failed to delete manifestation.');
        });
    }
}
