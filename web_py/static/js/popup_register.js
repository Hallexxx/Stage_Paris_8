document.addEventListener("DOMContentLoaded", function() {
    var addServiceLink = document.getElementById("add-service-link");
    var addServicePopup = document.getElementById("add-service-popup");
    var closeBtn = document.querySelector(".close");

    addServiceLink.addEventListener("click", function(event) {
        event.preventDefault();
        addServicePopup.style.display = "block";
    });

    closeBtn.addEventListener("click", function() {
        addServicePopup.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target == addServicePopup) {
            addServicePopup.style.display = "none";
        }
    });
});
