function openAddModals() {
    document.getElementById("addSeminarModal").style.display = "block";
}

function closeAddModals() {
    document.getElementById("addSeminarModal").style.display = "none";
}

function openEditModals(seminarId, title, speaker, date, summary) {
    document.getElementById("edit_seminar_id").value = seminarId;
    document.getElementById("edit_title").value = title;
    document.getElementById("edit_speaker").value = speaker;
    document.getElementById("edit_date").value = date;
    document.getElementById("edit_summary").value = summary;

    document.getElementById("editSeminarModal").style.display = "block";
}

function closeEditModals() {
    document.getElementById("editSeminarModal").style.display = "none";
}

function submitAddSeminar(event) {
    event.preventDefault();
    const form = document.getElementById("addSeminarForm");
    const formData = new FormData(form);

    fetch('/add_seminar/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
    }).then(response => {
        if (response.ok) {
            closeAddModals();
            window.location.reload();
        } else {
            alert("Failed to add the seminar.");
        }
    });
}

function submitEditSeminar(event) {
    event.preventDefault();
    const form = document.getElementById("editSeminarForm");
    const formData = new FormData(form);

    const seminarId = document.getElementById("edit_seminar_id").value;

    fetch(`/edit_seminar/${document.getElementById("edit_seminar_id").value}/`, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
    }).then(response => {
        if (response.ok) {
            closeEditModals();
            window.location.reload();
        } else {
            alert("Failed to edit the seminar.");
        }
    });
}

function deleteSeminar(seminarId) {
    if (confirm("Are you sure you want to delete this seminar?")) {

        fetch(`/delete_seminar/${seminarId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        }).then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                alert("Failed to delete the seminar.");
            }
        });
    }
}