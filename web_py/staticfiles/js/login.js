var modal = document.getElementById("passwordResetModal");
    var link = document.getElementById("forgot-password-link");
    var closeButton = document.getElementsByClassName("close")[0];

    link.onclick = function() {
        modal.style.display = "flex";
    }

    closeButton.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }