/* ===========================================
   SETTINGS.JS
   Phase 3 - Part 1
=========================================== */

const API = CONFIG.API_URL;

const DEFAULT_MESSAGES = {

    MAINTENANCE:
        "Our team is carrying out scheduled maintenance to ensure the best playing experience. We'll reopen as soon as the work is complete.",

    "PRIVATE EVENT":
        "The arena has been reserved for a private event. Online bookings are temporarily unavailable. We look forward to welcoming you once the event concludes.",

    CLOSED:
        "Online bookings are temporarily unavailable. Please check back later or contact us for assistance."

};

/* ===========================================
   DOM
=========================================== */

const saveBtn = document.getElementById("saveBtn");

const adminName = document.getElementById("adminName");

/* ===========================================
   INITIALIZE
=========================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadSidebar();

});

/* ===========================================
   LOAD SIDEBAR
=========================================== */

async function loadSidebar(){

    try{

        const response = await fetch("./components/sidebar.html");

        const html = await response.text();

        document.getElementById("sidebar-container").innerHTML = html;

        const script = document.createElement("script");

        script.src = "js/sidebar.js";

        script.onload = () => {

            initializePage();

        };

        document.body.appendChild(script);

    }

    catch(err){

        console.error("Sidebar Error :", err);

    }

}

/* ===========================================
   INITIALIZE PAGE
=========================================== */

function initializePage(){

    checkLogin();

    highlightActiveMenu();

    loadAdminName();

    attachEvents();

    loadSettings();

}

/* ===========================================
   CHECK LOGIN
=========================================== */

function checkLogin(){

    const loggedIn = sessionStorage.getItem("adminLoggedIn");

    if(loggedIn !== "true"){

        window.location.href="login.html";

    }

}

/* ===========================================
   ADMIN NAME
=========================================== */

function loadAdminName(){

    const name =
        sessionStorage.getItem("adminName")
        || "Admin";

    adminName.textContent = name;

}

/* ===========================================
   ACTIVE MENU
=========================================== */

function highlightActiveMenu(){

    const page = window.location.pathname.split("/").pop();

    document.querySelectorAll(".menu-item").forEach(item=>{

        item.classList.remove("active");

        const link = item.getAttribute("href");

        if(link && link.endsWith(page)){

            item.classList.add("active");

        }

    });

}

/* ===========================================
   EVENTS
=========================================== */

function attachEvents(){

    saveBtn.addEventListener("click", saveSettings);

}

document
.querySelectorAll('input[name="ArenaStatus"]')
.forEach(radio=>{

    radio.addEventListener("change",toggleStatusMessage);

});



function toggleStatusMessage(){

    const status = document.querySelector(
        'input[name="ArenaStatus"]:checked'
    )?.value;

    const box = document.getElementById("customStatusBox");
    const textarea = document.getElementById("ArenaStatusMessage");

    if(status === "CUSTOM"){

        box.style.display = "block";

    }else{

        box.style.display = "none";

        textarea.value = DEFAULT_MESSAGES[status] || "";

    }

}


/* ===========================================
   LOAD SETTINGS
=========================================== */

async function loadSettings(){

    try{

        saveBtn.disabled = true;

        saveBtn.innerHTML =
        `<i class="fa-solid fa-spinner fa-spin"></i> Loading...`;

        const response = await fetch(`${API}?action=getSettings`);

        const result = await response.json();

        if(!result.success){

            showToast("Unable to load settings","error");

            return;

        }

        fillForm(result.settings);

    }

    catch(err){

        console.error(err);

        showToast("Server connection failed","error");

    }

    finally{

        saveBtn.disabled = false;

        saveBtn.innerHTML =
        `<i class="fa-solid fa-floppy-disk"></i> Save Settings`;

    }

}

/* ===========================================
   FILL FORM
=========================================== */

function fillForm(settings){

    document.getElementById("ArenaName").value =
        settings.ArenaName || "";

    const status =
        settings.ArenaStatus || "OPEN";

    const radio = document.querySelector(
        `input[name="ArenaStatus"][value="${status}"]`
    );

    if(radio){

        radio.checked = true;

    }

    document.getElementById("MaxPlayers").value =
        settings.MaxPlayers || "";

    document.getElementById("ArenaStatusMessage").value =
        settings.ArenaStatusMessage || "";

    document.getElementById("BookingPrefix").value =
        settings.BookingPrefix || "";

    document.getElementById("NextBookingID").value =
        settings.NextBookingID || "";

    document.getElementById("LoyaltyPerOver").value =
        settings.LoyaltyPerOver || "";

    document.getElementById("Loyalty3Overs").value =
        settings.Loyalty3Overs || "";

    document.getElementById("Loyalty5Overs").value =
        settings.Loyalty5Overs || "";

    document.getElementById("Loyalty10Overs").value =
        settings.Loyalty10Overs || "";

    document.getElementById("Loyalty20Overs").value =
        settings.Loyalty20Overs || "";

    document.getElementById("MembershipPrefix").value =
        settings.MembershipPrefix || "";

    document.getElementById("NextMemberID").value =
        settings.NextMemberID || "";

    document.getElementById("LastNotificationRead").value =
        settings.LastNotificationRead || "";

    toggleStatusMessage();

}

/* ===========================================
   SAVE SETTINGS
=========================================== */

async function saveSettings(){

    if(!validateForm()) return;

    const data={

        ArenaName:document.getElementById("ArenaName").value.trim(),

        ArenaStatus:document.querySelector('input[name="ArenaStatus"]:checked')?.value || "OPEN",

        MaxPlayers:document.getElementById("MaxPlayers").value,

        ArenaStatusMessage:document.getElementById("ArenaStatusMessage").value.trim(),

        BookingPrefix:document.getElementById("BookingPrefix").value.trim(),

        NextBookingID:document.getElementById("NextBookingID").value,

        LoyaltyPerOver:document.getElementById("LoyaltyPerOver").value,

        Loyalty3Overs:document.getElementById("Loyalty3Overs").value,

        Loyalty5Overs:document.getElementById("Loyalty5Overs").value,

        Loyalty10Overs:document.getElementById("Loyalty10Overs").value,

        Loyalty20Overs:document.getElementById("Loyalty20Overs").value,

        MembershipPrefix:document.getElementById("MembershipPrefix").value.trim(),

        NextMemberID:document.getElementById("NextMemberID").value,

        LastNotificationRead:document.getElementById("LastNotificationRead").value

    };

    try{

        saveBtn.disabled=true;

        saveBtn.innerHTML=
        `<i class="fa-solid fa-spinner fa-spin"></i> Saving...`;

        const response=await fetch(

            `${API}?action=saveSettings&data=${encodeURIComponent(JSON.stringify(data))}`

        );

        const result=await response.json();

        if(result.success){

            showToast("Settings saved successfully","success");

            loadSettings();

        }else{

            showToast(result.message || "Unable to save settings","error");

        }

    }

    catch(err){

        console.error(err);

        showToast("Server connection failed","error");

    }

    finally{

        saveBtn.disabled=false;

        saveBtn.innerHTML=
        `<i class="fa-solid fa-floppy-disk"></i> Save Settings`;

    }

}

/* ===========================================
   VALIDATION
=========================================== */

function validateForm(){

    if(document.getElementById("ArenaName").value.trim()==""){

        showToast("Arena Name is required","warning");

        return false;

    }

    if(document.getElementById("BookingPrefix").value.trim()==""){

        showToast("Booking Prefix is required","warning");

        return false;

    }

    if(document.getElementById("MembershipPrefix").value.trim()==""){

        showToast("Membership Prefix is required","warning");

        return false;

    }

    if(Number(document.getElementById("MaxPlayers").value)<=0){

        showToast("Maximum Players must be greater than 0","warning");

        return false;

    }

    return true;

}

/* ===========================================
   TOAST NOTIFICATION
=========================================== */

function showToast(message,type="success"){

    let toast=document.querySelector(".toast");

    if(!toast){

        toast=document.createElement("div");

        toast.className="toast";

        document.body.appendChild(toast);

    }

    let icon="fa-circle-check";

    if(type==="error"){

        icon="fa-circle-xmark";

    }

    if(type==="warning"){

        icon="fa-triangle-exclamation";

    }

    toast.className=`toast ${type} show`;

    toast.innerHTML=`

        <i class="fa-solid ${icon}"></i>

        <div class="toast-content">

            <h4>${type.charAt(0).toUpperCase()+type.slice(1)}</h4>

            <p>${message}</p>

        </div>

    `;

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}

/* ===========================================
   MOBILE MENU
=========================================== */

const menuBtn=document.getElementById("menuToggle");

if(menuBtn){

    menuBtn.addEventListener("click",()=>{

        const sidebar=document.querySelector(".sidebar");

        if(sidebar){

            sidebar.classList.toggle("show");

        }

    });

}

/* ===========================================
   ENTER KEY SAVE
=========================================== */

document.addEventListener("keydown",(e)=>{

    if(e.ctrlKey && e.key==="s"){

        e.preventDefault();

        saveSettings();

    }

});

/* ===========================================
   UNSAVED CHANGES
=========================================== */

let changed=false;

document.querySelectorAll("input,select,textarea").forEach(el=>{

    el.addEventListener("input",()=>{

        changed=true;

    });

});

window.addEventListener("beforeunload",(e)=>{

    if(changed){

        e.preventDefault();

        e.returnValue="";

    }

});

const originalSave=saveSettings;

saveSettings=async function(){

    await originalSave();

    changed=false;

}