document.addEventListener("scroll", function() {
    var sections = document.querySelectorAll("section");
    var navLinks = document.querySelectorAll(".nav-link");

    sections.forEach(function(section) {
        var sectionTop = section.offsetTop - 100;
        var sectionHeight = section.offsetHeight;
        var scrollPosition = window.scrollY;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            var currentId = section.getAttribute("id");
            navLinks.forEach(function(link) {
                link.classList.remove("active");
                if (link.getAttribute("href").includes(currentId)) {
                    link.classList.add("active");
                }
            });
        }
    });
});