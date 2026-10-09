
document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector("header");
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll('a[href^="#"]');

    function getHeaderHeight() {
        return header ? header.offsetHeight : 0;
    }

    function scrollToSection(section, behavior = "smooth") {
        if (!section) return;

        // Home debe comenzar desde la parte superior de la página.
        if (section.id === "home") {
            window.scrollTo({
                top: 0,
                behavior: behavior
            });
            return;
        }

        // Buscamos el título inicial de la sección.
        const sectionLabel = section.querySelector(".section-label");
        const target = sectionLabel || section;

        // Colocamos el título justo debajo del menú fijo.
        const headerHeight = getHeaderHeight();
        const desiredGap = 12;

        const targetPosition =
            target.getBoundingClientRect().top +
            window.scrollY -
            headerHeight -
            desiredGap;

        window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: behavior
        });
    }

    // Controla los enlaces del menú y los botones internos.
    navLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const href = link.getAttribute("href");

            if (!href || href === "#") return;

            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);

            if (!targetSection) return;

            event.preventDefault();

            // Actualiza el fragmento de la URL sin el salto automático.
            if (window.location.hash !== href) {
                history.pushState(null, "", href);
            }

            scrollToSection(targetSection);
        });
    });

    // Mantiene resaltada la opción correspondiente a la sección visible.
    function updateActiveLink() {
        let currentSection = "home";
        const headerHeight = getHeaderHeight();
        const referencePosition = window.scrollY + headerHeight + 20;

        sections.forEach(function (section) {
            const marker =
                section.querySelector(".section-label") || section;

            const markerPosition =
                marker.getBoundingClientRect().top + window.scrollY;

            if (referencePosition >= markerPosition) {
                currentSection = section.id;
            }
        });

        document
            .querySelectorAll("nav ul li a")
            .forEach(function (link) {
                link.classList.remove("active");

                if (link.getAttribute("href") === "#" + currentSection) {
                    link.classList.add("active");
                }
            });
    }

    window.addEventListener("scroll", updateActiveLink);
    window.addEventListener("resize", updateActiveLink);

    // Corrige la posición si se abre la página con un enlace específico.
    window.addEventListener("load", function () {
        const targetId = window.location.hash.substring(1);

        if (targetId) {
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                scrollToSection(targetSection, "auto");
            }
        }

        updateActiveLink();
    });

    updateActiveLink();
});