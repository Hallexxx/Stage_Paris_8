document.addEventListener('DOMContentLoaded', function() {
    const manageLinksBtn = document.getElementById('manage-links-btn');
    const linkFormContainer = document.getElementById('link-form-container');
    const linkForm = document.getElementById('link-form');
    const addLinkBtnContainer = document.getElementById('add-link-btn-container');
    const addLinkBtn = document.getElementById('add-link-btn');
    const saveLinkBtn = document.getElementById('save-link-btn');
    const navLinks = document.getElementById('nav-links');
    const cancelLinkBtn = document.getElementById('cancel-link-btn');
    const popupBackground = document.querySelector('.popup-background');
    const popupTitle = document.getElementById('popup-title');
    let editMode = false;

    // Toggle edit mode
    manageLinksBtn.addEventListener('click', function() {
        editMode = !editMode;
        toggleEditMode(editMode);
    });

    // Toggle edit mode function
    function toggleEditMode(enabled) {
        const editButtons = document.querySelectorAll('.edit-link-btn, .delete-link-btn');
        editButtons.forEach(btn => btn.style.display = enabled ? 'inline' : 'none');
        addLinkBtnContainer.style.display = enabled ? 'block' : 'none';
    }

    // Add new link
    addLinkBtn.addEventListener('click', function() {
        linkForm.reset();
        popupTitle.textContent = 'Créer un nouveau lien';
        linkFormContainer.style.display = 'flex';
    });

    // Edit existing link
    navLinks.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-link-btn')) {
            const linkId = e.target.getAttribute('data-link-id');
            const linkTitle = e.target.textContent.trim();
            const linkUrl = e.target.getAttribute('href');
            document.getElementById('link-id').value = linkId;
            document.getElementById('link-title').value = linkTitle;
            document.getElementById('link-url').value = linkUrl;
            popupTitle.textContent = 'Modifier le lien';
            linkFormContainer.style.display = 'flex';
        }
    });

    // Delete link
    navLinks.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-link-btn')) {
            const linkId = e.target.getAttribute('data-link-id');
            fetch('/delete-link/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                },
                body: JSON.stringify({ link_id: linkId })
            }).then(response => response.json()).then(data => {
                if (data.success) {
                    e.target.closest('li').remove();
                } else {
                    alert('Erreur lors de la suppression du lien.');
                }
            });
        }
    });

    // Save link
    linkForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const linkId = document.getElementById('link-id').value;
        const linkTitle = document.getElementById('link-title').value;
        const linkUrl = document.getElementById('link-url').value;
        fetch('/save-link/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify({ link_id: linkId, link_title: linkTitle, link_url: linkUrl })
        }).then(response => response.json()).then(data => {
            if (data.success) {
                window.location.reload();
            } else {
                alert('Erreur lors de l\'enregistrement du lien.');
            }
        });
    });

    cancelLinkBtn.addEventListener('click', function() {
        linkFormContainer.style.display = 'none';
    });
    
    popupBackground.addEventListener('click', function() {
        linkFormContainer.style.display = 'none';
    });
});
