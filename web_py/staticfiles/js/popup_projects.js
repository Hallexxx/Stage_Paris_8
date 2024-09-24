function openAddModal() {
    document.getElementById("addProjectModal").style.display = "block";
}

function closeAddModal() {
    document.getElementById("addProjectModal").style.display = "none";
}

function openEditModal(projectId, title, startYear, endYear, projectManager, partner, financialResources, humanResources) {
    document.getElementById("edit_project_id").value = projectId;
    document.getElementById("edit_title").value = title;
    document.getElementById("edit_start_year").value = startYear;
    document.getElementById("edit_end_year").value = endYear;
    document.getElementById("edit_project_manager").value = projectManager;
    document.getElementById("edit_partner").value = partner;
    document.getElementById("edit_financial_resources").value = financialResources;
    document.getElementById("edit_human_resources").value = humanResources;

    document.getElementById("editProjectModal").style.display = "block";
}

function closeEditModal() {
    document.getElementById("editProjectModal").style.display = "none";
}

function submitAddProject(event) {
    event.preventDefault();
    const form = document.getElementById("addProjectForm");
    const formData = new FormData(form);

    fetch('/add_project/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
    }).then(response => {
        if (response.ok) {
            closeAddModal();
            window.location.reload();
        } else {
            alert("Failed to add the project.");
        }
    });
}

function submitEditProject(event) {
    event.preventDefault();
    const form = document.getElementById("editProjectForm");
    const formData = new FormData(form);

    fetch(`/edit_project/${document.getElementById("edit_project_id").value}/`, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
    }).then(response => {
        if (response.ok) {
            closeEditModal();
            window.location.reload();
        } else {
            alert("Failed to edit the project.");
        }
    });
}

function deleteProject(projectId) {
    if (confirm("Are you sure you want to delete this project?")) {
        fetch(`/delete_project/${projectId}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        }).then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                alert("Failed to delete the project.");
            }
        });
    }
}