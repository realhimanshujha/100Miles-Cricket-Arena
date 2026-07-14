function initializeNavbar() {

    const navbar = document.querySelector(".navbar");
    const menuToggle = document.querySelector(".menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");
    const closeMenuBtn = document.querySelector(".close-menu");
    const overlay = document.querySelector(".menu-overlay");

    if (!navbar) return;

    /* ============================
       Navbar Scroll Effect
    ============================ */

    function handleScroll() {

        if (window.scrollY > 40) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }

    }

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    /* ============================
       Open Menu
    ============================ */

    function openMenu() {

        mobileMenu.classList.add("active");

        overlay.classList.add("active");

        document.body.style.overflow = "hidden";

    }

    /* ============================
       Close Menu
    ============================ */

    function closeMenu() {

        mobileMenu.classList.remove("active");

        overlay.classList.remove("active");

        document.body.style.overflow = "";

    }

    /* ============================
       Toggle
    ============================ */

    menuToggle.addEventListener("click", openMenu);

    closeMenuBtn.addEventListener("click", closeMenu);

    overlay.addEventListener("click", closeMenu);

    /* ============================
       Close On Link Click
    ============================ */

    document.querySelectorAll(".mobile-nav a").forEach(link => {

        link.addEventListener("click", closeMenu);

    });

    document.querySelectorAll(".mobile-buttons a").forEach(link => {

        link.addEventListener("click", closeMenu);

    });

    /* ============================
       ESC Key
    ============================ */

    document.addEventListener("keydown", e => {

        if (e.key === "Escape") {

            closeMenu();

        }

    });

    /* ============================
       Active Page
    ============================ */

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-links a, .mobile-nav a").forEach(link => {

        const href = link.getAttribute("href");

        if (href === currentPage) {

            link.classList.add("active");

        }

    });

}