async function loadComponent(id, file) {

    try {

        const response = await fetch(file);

        if (!response.ok) {

            throw new Error(`Unable to load ${file}`);

        }

        document.getElementById(id).innerHTML = await response.text();

    } catch (error) {

        console.error(error);

    }

}

document.addEventListener("DOMContentLoaded", async () => {

    await loadComponent("navbar", "components/navbar.html");

    await loadComponent("footer", "components/footer.html");

    if (typeof initializeNavbar === "function") {

        initializeNavbar();

    }

    if (typeof initializeFooter === "function") {

        initializeFooter();

    }

});