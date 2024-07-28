document.addEventListener("DOMContentLoaded", function() {
    var boutons = document.querySelectorAll("#boutons .nav-links a");
    var traitNoir = document.querySelector(".trait-noir");
    var sections = document.querySelectorAll(".section");
    var isScrolling = false;

    function updateSelection(index) {
        boutons.forEach(function(bouton, i) {
            bouton.classList.toggle("selected", i === index);
        });

        var boutonSelectionne = boutons[index];
        var boutonSelectionneRect = boutonSelectionne.getBoundingClientRect();
        var parentRect = boutonSelectionne.parentElement.getBoundingClientRect();
        var boutonSelectionnePosition = boutonSelectionneRect.top - parentRect.top;

        traitNoir.style.height = boutonSelectionne.offsetHeight + "px";
        traitNoir.style.transform = "translateY(" + boutonSelectionnePosition + "px)";
        traitNoir.style.opacity = "1";
    }

    window.choisirOnglets = function(event, index) {
        event.preventDefault();
        isScrolling = true;
        updateSelection(index);

        var targetId = event.currentTarget.getAttribute("href");
        var targetElement = document.querySelector(targetId);
        targetElement.scrollIntoView({ behavior: 'smooth' });

        setTimeout(function() {
            isScrolling = false;
        }, 500);
    };

    var observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.5
    };

    var observer = new IntersectionObserver(function(entries, observer) {
        if (!isScrolling) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var index = Array.prototype.indexOf.call(sections, entry.target);
                    updateSelection(index);
                }
            });
        }
    }, observerOptions);

    sections.forEach(function(section) {
        observer.observe(section);
    });

    var boutonSelectionne = document.querySelector("#boutons .nav-links a.selected");
    if (boutonSelectionne) {
        var boutonSelectionneRect = boutonSelectionne.getBoundingClientRect();
        var parentRect = boutonSelectionne.parentElement.getBoundingClientRect();
        var boutonSelectionnePosition = boutonSelectionneRect.top - parentRect.top;

        traitNoir.style.height = boutonSelectionne.offsetHeight + "px";
        traitNoir.style.transform = "translateY(" + boutonSelectionnePosition + "px)";
        traitNoir.style.opacity = "1";
    }
});