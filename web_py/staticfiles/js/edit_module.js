$(document).ready(function() {
    // Fonction pour éditer le nom de la section
    $(document).on('click', '.section-title', function() {
        var sectionId = $(this).data('section-id');
        var newSectionName = prompt('Entrez le nouveau nom pour cette section :');
        
        if (newSectionName !== null && newSectionName !== '') {
            $.ajax({
                url: '{% url "edit_section_name" %}',
                method: 'POST',
                data: {
                    section_id: sectionId,
                    new_name: newSectionName,
                    csrfmiddlewaretoken: '{{ csrf_token }}'
                },
                success: function(response) {
                    console.log('Nom de la section modifié avec succès.');
                    location.reload(); // Recharge la page pour afficher les changements
                },
                error: function(xhr, status, error) {
                    console.error('Erreur lors de la modification du nom de la section :', error);
                }
            });
        }
    });
});


/////////////////////////////// AJOUT MODULE //////////////////////////////////////

    $(document).ready(function() {
        // Afficher le formulaire d'ajout de module
        $('#show-add-module-form').click(function() {
            $('#add-module-form-container').show();
        });
    
        // Cacher le formulaire d'ajout de module
        $('#hide-add-module-form').click(function() {
            $('#add-module-form-container').hide();
        });
    
        // Ajouter un module à une section
        $('#add-module-button').click(function() {
            var addModuleUrl = $('#add-module-form').data('add-module-url');
            var moduleId = $('#module-select').val();
            var sectionId = $('#section-select').val(); // Assumez que vous avez un select pour choisir la section
    
            if (moduleId !== null && moduleId.trim() !== '' && sectionId !== null && sectionId.trim() !== '') {
                $.ajax({
                    url: addModuleUrl,
                    method: 'POST',
                    data: {
                        module_id: moduleId,
                        section_id: sectionId,
                        csrfmiddlewaretoken: '{{ csrf_token }}'
                    },
                    success: function(response) {
                        console.log('Module ajouté avec succès.');
                        location.reload(); // Recharge la page pour afficher les changements
                    },
                    error: function(xhr, status, error) {
                        console.error('Erreur lors de l\'ajout du module :', error);
                    }
                });
            }
        });
    
        // Cacher le formulaire si on clique en dehors
        $(document).mouseup(function(e) {
            var container = $('#add-module-form-container');
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                container.hide();
            }
        });
    });


/////////////////////////////// EDITION MODULE //////////////////////////////////////

$(document).on('click', '.edit-button', function() {
    var module = $(this).closest('.module');
    var moduleId = module.attr('id').replace('module', '');
    var editUrl = $(this).data('edit-url');

    // Cache toutes les sections de modification
    $('#editTextModuleSection, #editImageModuleSection, #editPdfModuleSection, #editTextWithTitleModuleSection').hide();

    // Ouvre la modale et affiche le bon formulaire selon le type de module
    if (module.hasClass('text_title')) {
        $('#editTextWithTitleModuleSection').show();
        $('#edit_text_title').val(module.find('h3').text()); // Remplit le champ titre
        $('#edit_text_with_title_content').val(module.find('p').text()); // Remplit le champ contenu

    } else if (module.hasClass('text')) {
        $('#editTextModuleSection').show();
        $('#edit_text_content').val(module.find('p').text()); // Remplit le champ contenu

    } else if (module.hasClass('image')) {
        $('#editImageModuleSection').show();

    } else if (module.hasClass('pdf')) {
        $('#editPdfModuleSection').show();
    }

    $('#edit_module_id').val(moduleId); // Remplit l'ID du module
    $('#editModuleModal').show(); // Affiche la modale
});

function submitEditModule(event) {
    event.preventDefault();
    var form = $('#editModuleForm')[0];
    var formData = new FormData(form);
    
    // Ajoute manuellement le CSRF token
    formData.append('csrfmiddlewaretoken', $('[name=csrfmiddlewaretoken]').val());

    var moduleId = $('#edit_module_id').val();
    var editUrl = `/edit_module/`;  // URL pour la modification

    $.ajax({
        url: editUrl,
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            if (response.status === 'success') {
                window.location.reload();
            } else {
                console.log(response);  // Affiche la réponse en cas d'erreur
                alert('Erreur lors de la modification du module.');
            }
        },
        error: function(xhr, status, error) {
            console.error('Erreur:', error);
            console.log(xhr.responseText);  // Affiche la réponse du serveur
        }
    });
}

document.getElementById('edit_image_file').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById('preview_image');
            img.src = e.target.result;
            img.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

function closeEditModals() {
    $('#editModuleModal').hide();
}

/////////////////////////////// SUPPRESSION MODULE //////////////////////////////////////
    
$(document).on('click', '.delete-button', function() {
    if (confirm('Voulez-vous vraiment supprimer ce module ?')) {
        var moduleId = $(this).data('id');

        $.ajax({
            url: $(this).data('delete-url'),
            method: 'POST',
            data: {
                module_id: moduleId,
                csrfmiddlewaretoken: '{{ csrf_token }}'
            },
            success: function(response) {
                if (response.status === 'success') {
                    console.log('Module supprimé avec succès.');
                    $('#module' + moduleId).remove(); // Supprime visuellement le module de l'affichage
                } else {
                    console.error('Erreur lors de la suppression du module :', response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('Erreur lors de la suppression du module :', error);
            }
        });
    }
});
        


/////////////////////////////// AJOUT SECTION //////////////////////////////////////
    
    $(document).ready(function() {
        // Fonction pour ajouter une nouvelle section avec 4 modules par défaut
        $('#add-section-button').click(function() {
            var addSectionUrl = $(this).data('add-section-url');
            var sectionName = prompt('Entrez le nom de la nouvelle section :');
            
            if (sectionName !== null && sectionName.trim() !== '') {
                $.ajax({
                    url: addSectionUrl,
                    method: 'POST',
                    data: {
                        section_name: sectionName,
                        csrfmiddlewaretoken: '{{ csrf_token }}'
                    },
                    success: function(response) {
                        console.log('Section ajoutée avec succès.');
                        location.reload(); // Recharge la page pour afficher les changements
                    },
                    error: function(xhr, status, error) {
                        console.error('Erreur lors de l\'ajout de la section :', error);
                    }
                });
            }
        });
    
        // Autres fonctions JavaScript pour éditer, supprimer des modules, etc.
    });


/////////////////////////////// DELETE SECTION //////////////////////////////////////

$(document).ready(function() {
    // Gestion de la suppression de section
    $('.delete-section-button').click(function() {
        var sectionId = $(this).data('section-id');
        if (confirm("Êtes-vous sûr de vouloir supprimer cette section ?")) {
            $.ajax({
                url: '/delete_section/' + sectionId + '/',  // Remplacez par votre URL de vue Django pour la suppression de section
                type: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')  // Assurez-vous d'avoir une fonction getCookie pour récupérer le jeton CSRF
                },
                success: function(response) {
                    if (response.status === 'success') {
                        // Rafraîchir la page après suppression réussie (ou mettre à jour dynamiquement)
                        window.location.reload();
                    } else {
                        alert('Échec de la suppression de la section.');
                    }
                },
                error: function(error) {
                    alert('Échec de la suppression de la section.');
                }
            });
        }
    });

    // Fonction pour récupérer le jeton CSRF
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Recherche du cookie avec le nom spécifié
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});


// document.addEventListener('DOMContentLoaded', () => {
//     const modules = document.querySelectorAll('.module');
//     const container = document.getElementById('container');

//     let offsetX, offsetY, originalPosition;

//     modules.forEach(module => {
//         module.addEventListener('dblclick', function(e) {
//             // Enregistrer la position originale
//             originalPosition = {
//                 left: this.offsetLeft,
//                 top: this.offsetTop
//             };

//             // Calculer l'offset initial
//             offsetX = e.clientX - this.getBoundingClientRect().left;
//             offsetY = e.clientY - this.getBoundingClientRect().top;

//             let overlap = false; // Déclarer overlap ici

//             const mouseMoveHandler = (e) => {
//                 // Calculer la nouvelle position
//                 const newLeft = e.clientX - offsetX;
//                 const newTop = e.clientY - offsetY;

//                 // Vérifier si la nouvelle position est à l'intérieur du conteneur
//                 if (newLeft >= 0 && newLeft + this.offsetWidth <= container.clientWidth &&
//                     newTop >= 0 && newTop + this.offsetHeight <= container.clientHeight) {

//                     // Vérifier la superposition
//                     modules.forEach(otherModule => {
//                         if (otherModule !== this) {
//                             const otherRect = otherModule.getBoundingClientRect();
//                             const thisRect = {
//                                 left: newLeft,
//                                 top: newTop,
//                                 right: newLeft + this.offsetWidth,
//                                 bottom: newTop + this.offsetHeight
//                             };

//                             // Vérification de superposition
//                             if (!(thisRect.right < otherRect.left || 
//                                   thisRect.left > otherRect.right || 
//                                   thisRect.bottom < otherRect.top || 
//                                   thisRect.top > otherRect.bottom)) {
//                                 overlap = true;
//                             }
//                         }
//                     });

//                     if (!overlap) {
//                         this.style.left = `${newLeft}px`;
//                         this.style.top = `${newTop}px`;
//                     }
//                 }
//             };

//             const mouseUpHandler = () => {
//                 document.removeEventListener('mousemove', mouseMoveHandler);
//                 document.removeEventListener('mouseup', mouseUpHandler);

//                 // Si superposition, revenir à la position originale
//                 if (overlap) {
//                     this.style.left = `${originalPosition.left}px`;
//                     this.style.top = `${originalPosition.top}px`;
//                 }
//             };

//             document.addEventListener('mousemove', mouseMoveHandler);
//             document.addEventListener('mouseup', mouseUpHandler);
//         });
//     });
// });
