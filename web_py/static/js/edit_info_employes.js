document.addEventListener('DOMContentLoaded', function() {
    const editProfilePicButton = document.getElementById('edit-profile-pic');
    const saveProfilePicButton = document.getElementById('save-profile-pic');
    const profilePicInput = document.getElementById('profile-pic-input');
    const profilePicImg = document.getElementById('profile-pic-img');

    editProfilePicButton.addEventListener('click', function() {
        profilePicInput.style.display = 'inline';
        editProfilePicButton.style.display = 'none';
        saveProfilePicButton.style.display = 'inline';
    });

    saveProfilePicButton.addEventListener('click', function() {
        const formData = new FormData();
        if (profilePicInput.files.length > 0) {
            formData.append('profile_pic', profilePicInput.files[0]);
        }

        fetch(`/update_profile/profile_pic/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: formData
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to update profile pic.');
            }
        }).then(data => {
            if (data.status === 'success') {
                if (profilePicInput.files.length > 0) {
                    profilePicImg.src = URL.createObjectURL(profilePicInput.files[0]);
                }
                profilePicInput.style.display = 'none';
                saveProfilePicButton.style.display = 'none';
                editProfilePicButton.style.display = 'inline';
            } else {
                throw new Error('Failed to update profile pic.');
            }
        }).catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    });

    const editButtons = document.querySelectorAll('.edit-button');
    const saveButtons = document.querySelectorAll('.save-button');

    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const fieldName = this.id.replace('edit-', '');
            const fieldText = document.getElementById(`${fieldName}-text`);

            if (fieldText) {
                const currentValue = fieldText.innerText.trim();
                const input = document.createElement('input');

                if (fieldName === 'profile-pic') {
                    return;
                } else {
                    input.type = 'text';
                    input.id = `${fieldName}-input`;
                    input.value = currentValue;
                    fieldText.replaceWith(input);
                }

                this.style.display = 'none';
                document.getElementById(`save-${fieldName}`).style.display = 'inline';
            }
        });
    });

    saveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const fieldName = this.id.replace('save-', '');
            const input = document.getElementById(`${fieldName}-input`);
            const formData = new FormData();

            if (fieldName === 'profile-pic' && input.files.length > 0) {
                return;
            } else {
                formData.append('value', input.value.trim());
            }

            fetch(`/update_profile/${fieldName}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: formData
            }).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to update.');
                }
            }).then(data => {
                if (fieldName === 'profile-pic') {
                    return;
                } else {
                    const fieldText = document.createElement('span');
                    fieldText.id = `${fieldName}-text`;
                    fieldText.innerText = input.value.trim();
                    input.replaceWith(fieldText);
                }

                document.getElementById(`edit-${fieldName}`).style.display = 'inline';
                this.style.display = 'none';
            }).catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        });
    });
    
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});