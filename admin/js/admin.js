
const API = "https://script.google.com/macros/s/AKfycbzKYU5RY-sg7KZoF8PAmM04-OzHrY_BOVzxWkFrUcFUk-mOQxBhkCtvvp9Dw9HsVYne/exec";

const loginForm = document.getElementById("loginForm");
const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

// Show / Hide Password
togglePassword.addEventListener("click", () => {

    if(password.type === "password"){

        password.type = "text";

        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");

    }else{

        password.type = "password";

        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");

    }

});

// Login

loginForm.addEventListener("submit", function(e){

    e.preventDefault();

    const username =
    document.getElementById("username").value.trim();

    const password =
    document.getElementById("password").value.trim();

    if(username==="" || password===""){

        alert("Please enter Username and Password.");

        return;

    }

    fetch(`${API}?action=adminLogin&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)

    .then(res=>res.json())

    .then(data=>{

        if(data.success){

            sessionStorage.setItem("adminLoggedIn","true");

            sessionStorage.setItem("adminName",data.name);

            window.location.href="dashboard.html";

        }else{

            alert(data.message);

        }

    })

    .catch(err=>{

        console.log(err);

        alert("Unable to connect to server.");

    });

});