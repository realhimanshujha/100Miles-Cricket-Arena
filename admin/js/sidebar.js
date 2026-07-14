// ===============================
// Protect Admin Pages
// ===============================

if (sessionStorage.getItem("adminLoggedIn") !== "true") {

    window.location.href = "index.html";

}


// ===============================
// Highlight Current Page
// ===============================

const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll(".menu-item").forEach(item => {

    const href = item.getAttribute("href");

    if (!href) return;

    if (href.includes(currentPage)) {

        document
            .querySelectorAll(".menu-item")
            .forEach(link => link.classList.remove("active"));

        item.classList.add("active");

    }

});


// ===============================
// Logout
// ===============================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        const confirmLogout = confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) return;

        sessionStorage.clear();

        window.location.href = "index.html";

    });

}


// ===============================
// Mobile Sidebar Toggle
// ===============================

const sidebar = document.getElementById("sidebar");

const menuToggle = document.getElementById("menuToggle");

if (menuToggle) {

    menuToggle.addEventListener("click", () => {

        sidebar.classList.toggle("active");

    });

}


// Close Sidebar when clicking outside

document.addEventListener("click", function(e){

    if(window.innerWidth > 768) return;

    if(!sidebar) return;

    if(
        !sidebar.contains(e.target) &&
        menuToggle &&
        !menuToggle.contains(e.target)
    ){

        sidebar.classList.remove("active");

    }

});