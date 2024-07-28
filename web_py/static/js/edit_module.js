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
    
        if (module.hasClass('text_with_title')) {
            var newTitle = prompt('Entrez le nouveau titre pour ce module :');
            var newContent = prompt('Entrez le nouveau contenu pour ce module :');
            if (newTitle !== null && newContent !== null) {
                var formData = new FormData();
                formData.append('module_id', moduleId);
                formData.append('new_title', newTitle);
                formData.append('new_content', newContent);
                formData.append('csrfmiddlewaretoken', '{{ csrf_token }}');
                sendEditRequest(editUrl, formData, module, newContent);
            }
        } else if (module.hasClass('image') || module.hasClass('pdf')) {
            // Pour les modules image et pdf, ouvrez directement le champ de fichier
            var fileInput = module.find('input[type="file"]');
            fileInput.click();  // Ouvre la fenêtre de sélection de fichier
            fileInput.change(function() {
                var formData = new FormData();
                formData.append('module_id', moduleId);
                formData.append('new_file', fileInput[0].files[0]);  // Récupère le fichier sélectionné
                formData.append('csrfmiddlewaretoken', '{{ csrf_token }}');
                sendEditRequest(editUrl, formData, module);
            });
        }
    });
    
    function sendEditRequest(editUrl, formData, module, newContent) {
        $.ajax({
            url: editUrl,
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRFToken': '{{ csrf_token }}'
            },
            success: function(response) {
                console.log('Contenu du module modifié avec succès.');
                if (newContent) {
                    module.find('p').text(newContent);
                }
            },
            error: function(xhr, status, error) {
                console.error('Erreur lors de la modification du contenu du module :', error);
            }
        });
    }
    }); 
    
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