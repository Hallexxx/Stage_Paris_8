document.addEventListener("DOMContentLoaded", function() {
    var addNewsBtn = document.getElementById("add-news-btn");
    var newsPopup = document.getElementById("news-popup");
    var closeBtn = document.querySelector(".close");
    var newsForm = document.getElementById("news-form");
    var popupTitle = document.getElementById("popup-title");
    var newsIdField = document.getElementById("news-id");
    var newsTitleField = document.getElementById("news-title");
    var newsContentField = document.getElementById("news-content");

    if (addNewsBtn) {
        addNewsBtn.addEventListener("click", function() {
            popupTitle.textContent = "Ajouter une nouvelle";
            newsIdField.value = "";
            newsTitleField.value = "";
            newsContentField.value = "";
            newsPopup.style.display = "block";
        });
    }

    closeBtn.addEventListener("click", function() {
        newsPopup.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target == newsPopup) {
            newsPopup.style.display = "none";
        }
    });

    document.querySelectorAll(".edit-news-btn").forEach(function(btn) {
        btn.addEventListener("click", function() {
            var newsId = this.getAttribute("data-id");
            fetch(`/news/${newsId}/`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    popupTitle.textContent = "Modifier une nouvelle";
                    newsIdField.value = data.id;
                    newsTitleField.value = data.title;
                    newsContentField.value = data.content;
                    newsPopup.style.display = "block";
                })
                .catch(error => {
                    console.error('Error fetching news:', error);
                    alert("Erreur lors de la récupération de la nouvelle.");
                });
        });
    });

    document.querySelectorAll(".delete-news-btn").forEach(function(btn) {
        btn.addEventListener("click", function() {
            var newsId = this.getAttribute("data-id");
            if (newsId && confirm("Êtes-vous sûr de vouloir supprimer cette nouvelle?")) {
                fetch(`/news/${newsId}/delete/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': '{{ csrf_token }}'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        window.location.reload();
                    } else {
                        alert("Erreur lors de la suppression de la nouvelle.");
                    }
                });
            }
        });
    });
});

function openArchiveNewsPopup(newsId) {
    console.log("Ouverture du popup pour la news : ", newsId);
    document.getElementById("archiveNewsPopup").style.display = "block";
    document.getElementById("newsId").value = newsId;
}

function closeArchiveNewsPopup() {
    document.getElementById("archiveNewsPopup").style.display = "none";
}

document.getElementById("archiveNewsForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let newsId = document.getElementById("newsId").value;
    let startDate = document.getElementById("newsStartDate").value;
    let endDate = document.getElementById("newsEndDate").value;

    console.log("Tentative d'archivage de la news avec ID : ", newsId);

    fetch(`/archive_news/${newsId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: `startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
    }).then(response => {
        if (response.ok) {
            closeArchiveNewsPopup();
            alert('News archivée avec succès.');
            window.location.reload();
        } else {
            alert('Erreur lors de l\'archivage de la news.');
        }
    }).catch(error => {
        console.error('Erreur AJAX :', error);
        alert('Erreur lors de l\'archivage de la news.');
    });
});


window.addEventListener("scroll", function() {
    var backToTopButton = document.querySelector(".back-to-top");
    if (window.pageYOffset > 300) {
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
});