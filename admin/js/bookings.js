const API = CONFIG.API_URL;

let allBookings = [];
let currentFilter = "All";
let currentBookingID = "";
let currentBooking = null;
let editMode = false;
let currentMember = null;

// =======================================
// Authentication
// =======================================

if (sessionStorage.getItem("adminLoggedIn") !== "true") {

    window.location.href = "index.html";

}

// =======================================
// Load Sidebar
// =======================================

fetch("components/sidebar.html")
.then(response => response.text())
.then(html => {

    document.getElementById("sidebar-container").innerHTML = html;

    const script = document.createElement("script");
    script.src = "js/sidebar.js";
    document.body.appendChild(script);

})
.catch(error => {

    console.error("Sidebar Load Error:", error);

});

// =======================================
// Admin Name
// =======================================

const admin = sessionStorage.getItem("adminName");

if(admin){

    document.getElementById("adminName").textContent = admin;

}

// =======================================
// Today's Date
// =======================================

const bookingDate = document.getElementById("bookingDate");

if(bookingDate){

    const now = new Date();

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    const today = `${yyyy}-${mm}-${dd}`;

    document.getElementById("bookingDate").value = today;

}

// =======================================
// Auto Price
// =======================================

const overs = document.getElementById("overs");
const amount = document.getElementById("amount");

function updatePrice(){

    const players = document.getElementById("players");

    switch(overs.value){

        case "3 Overs":
            amount.value = 75;
            players.max = 1;
            players.value = 1;
            break;

        case "5 Overs":
            amount.value = 129;
            players.max = 1;
            players.value = 1;
            break;

        case "10 Overs":
            amount.value = 199;
            players.max = 1;
            players.value = 1;
            break;

        case "20 Overs":
            amount.value = 349;
            players.max = 3;
            if(Number(players.value) > 3){
                players.value = 3;
            }
            break;

        default:
            amount.value = "";
            players.max = 1;
            players.value = 1;
    }

    const duration = document.getElementById("slotDuration");

    switch (overs.value) {
        case "3 Overs":
            duration.textContent = "3 Overs = 10 Minutes";
            break;

        case "5 Overs":
            duration.textContent = "5 Overs = 10 Minutes";
            break;

        case "10 Overs":
            duration.textContent = "10 Overs = 20 Minutes";
            break;

        case "20 Overs":
            duration.textContent = "20 Overs = 30 Minutes";
            break;

        default:
            duration.textContent = "";
    }

    document.getElementById("discount").value = 0;

    document.getElementById("finalAmount").value =
        document.getElementById("amount").value;

    document.getElementById("promoMessage").textContent = "";

    document.getElementById("promoCode").value = "";

}

const players = document.getElementById("players");

players.addEventListener("input", () => {

    let maxPlayers = overs.value === "20 Overs" ? 3 : 1;

    if (players.value < 1) {
        players.value = 1;
    }

    if (players.value > maxPlayers) {
        players.value = maxPlayers;
    }

});

overs.addEventListener("change", () => {

    updatePrice();
    generateSlots();

});

updatePrice();
generateBookingID();
generateSlots();

// =======================================
// Slot Selection
// =======================================

let selectedSlot = "";

document.querySelectorAll(".slot").forEach(button=>{

    button.addEventListener("click",()=>{

        if (
            button.classList.contains("booked") ||
            button.classList.contains("expired")
        ) {
            return;
        }

        document.querySelectorAll(".slot").forEach(slot=>{

            slot.classList.remove("selected");

        });

        button.classList.add("selected");

        selectedSlot = button.dataset.slot;

        document.getElementById("slot").value = selectedSlot;

    });

});

// =======================================
// Booking Form
// =======================================

document.getElementById("bookingForm").addEventListener("submit", function(e){

    console.count("Booking form submitted");

    e.preventDefault();

    const saveBtn = document.querySelector(".save-btn");

    if (saveBtn.disabled) return;

    saveBtn.disabled = true;

    const booking = {

        bookingType: document.getElementById("bookingType").value,

        name: document.getElementById("customerName").value.trim(),

        phone: document.getElementById("phone").value.trim(),

        date: document.getElementById("bookingDate").value,

        time: document.getElementById("slot").value,

        plan: document.getElementById("overs").value,

        players: document.getElementById("players").value,

        amount: document.getElementById("finalAmount").value,

        paymentMethod: document.getElementById("payment").value,

        paymentStatus: document.getElementById("paymentStatus").value,

        promoCode: document.getElementById("promoCode").value.trim()

    };

        const url =
            `${API}?action=saveBooking` +
            `&bookingType=${encodeURIComponent(booking.bookingType)}` +
            `&name=${encodeURIComponent(booking.name)}` +
            `&phone=${encodeURIComponent(booking.phone)}` +
            `&date=${encodeURIComponent(booking.date)}` +
            `&time=${encodeURIComponent(booking.time)}` +
            `&plan=${encodeURIComponent(booking.plan)}` +
            `&players=${encodeURIComponent(booking.players)}` +
            `&amount=${encodeURIComponent(booking.amount)}` +
            `&paymentMethod=${encodeURIComponent(booking.paymentMethod)}` +
            `&paymentStatus=${encodeURIComponent(booking.paymentStatus)}` +
            `&promoCode=${encodeURIComponent(booking.promoCode)}`;
            
    if(editMode){

        const updateURL =
            `${API}?action=updateBooking` +
            `&bookingID=${document.getElementById("bookingId").value}` +
            `&name=${encodeURIComponent(booking.name)}` +
            `&phone=${encodeURIComponent(booking.phone)}` +
            `&date=${encodeURIComponent(booking.date)}` +
            `&time=${encodeURIComponent(booking.time)}` +
            `&plan=${encodeURIComponent(booking.plan)}` +
            `&players=${encodeURIComponent(booking.players)}` +
            `&amount=${encodeURIComponent(booking.amount)}` +
            `&paymentMethod=${encodeURIComponent(booking.paymentMethod)}` +
            `&paymentStatus=${encodeURIComponent(booking.paymentStatus)}`;

        fetch(updateURL)

        .then(r=>r.json())

        .then(data=>{

            if(data.success){

                showToast("Booking Updated Successfully");

                editMode = false;

                currentBooking = null;

                document.getElementById("cancelEditBtn").style.display = "none";

                document.querySelector(".save-btn").innerHTML = `
                <i class="fa-solid fa-floppy-disk"></i>
                Save Booking
                `;


                setTimeout(() => {

                    loadBookings();

                    loadBookedSlots();

                    loadBookingStats();

                }, 500);

                document.getElementById("bookingForm").reset();

                generateSlots();

                document.getElementById("slot").value = "";

                document.querySelectorAll(".slot").forEach(btn=>{
                    btn.classList.remove("selected");
                });

                generateBookingID();

                updatePrice();

            }else{

                showToast(data.message,"error");

            }

        });

    }else{

        fetch(url)

        .then(r=>r.json())

        .then(data=>{

            if(data.success){

                showToast("Booking Saved Successfully");

                document.getElementById("cancelEditBtn").style.display = "none";

                setTimeout(() => {

                    loadBookings();

                    loadBookedSlots();

                    loadBookingStats();

                }, 500);

                document.getElementById("bookingForm").reset();

                const now = new Date();

                const yyyy = now.getFullYear();
                const mm = String(now.getMonth()+1).padStart(2,"0");
                const dd = String(now.getDate()).padStart(2,"0");

                document.getElementById("bookingDate").value =
                `${yyyy}-${mm}-${dd}`;

                generateBookingID();

                updatePrice();

                generateSlots();     // <-- IMPORTANT

                loadBookedSlots();   // <-- IMPORTANT

                document.getElementById("slot").value = "";

                document.querySelectorAll(".slot").forEach(btn=>{
                    btn.classList.remove("selected");
                });

                saveBtn.disabled = false;

            }else{

                saveBtn.disabled = false;

                showToast(data.message,"error");

            }

        });
        

    }

});


function generateBookingID(){

    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth()+1).padStart(2,"0");

    const day = String(today.getDate()).padStart(2,"0");

    const random = Math.floor(Math.random()*900)+100;

    document.getElementById("bookingId").value =
        `BK-${year}${month}${day}-${random}`;

}

generateBookingID();


function updateExpiredSlots() {

    const selectedDate = new Date(document.getElementById("bookingDate").value);

    if (isNaN(selectedDate)) return;

    document.querySelectorAll(".slot").forEach(slot => {
        slot.classList.remove("expired");
    });

    const today = new Date();

    today.setHours(0,0,0,0);
    selectedDate.setHours(0,0,0,0);

    // Past date → all expired
    if(selectedDate < today){

        document.querySelectorAll(".slot").forEach(slot=>{
            slot.classList.add("expired");
        });

        return;
    }

    // Future date → nothing expired
    if(selectedDate > today){
        return;
    }

    // Today
    const now = new Date();

    const currentMinutes =
        now.getHours() * 60 + now.getMinutes();

    document.querySelectorAll(".slot").forEach(button=>{

        const [hour, minute] = button.dataset.slot.split(":").map(Number);

        const slotMinutes = hour * 60 + minute;

        if(slotMinutes <= currentMinutes){

            button.classList.add("expired");

        }

    });

}

bookingDate.addEventListener("change", () => {

    updateExpiredSlots();

    loadBookedSlots();

    loadBookings();

    loadBookingStats();

});

updateExpiredSlots();

loadBookedSlots();

loadBookings();

loadBookingStats();


function generateSlots() {

    const grid = document.getElementById("slotGrid");
    grid.innerHTML = "";

    const plan = document.getElementById("overs").value;

    let interval = 10;

    if (plan === "10 Overs") interval = 20;
    if (plan === "20 Overs") interval = 30;

    let hour = 6;
    let minute = 0;

    while (hour < 22 || (hour === 21 && minute === 30)) {

        const time =
            String(hour).padStart(2, "0") +
            ":" +
            String(minute).padStart(2, "0");

        const btn = document.createElement("button");

        btn.type = "button";
        btn.className = "slot available";
        btn.dataset.slot = time;
        btn.textContent = time;

        btn.onclick = () => {

            if (
                btn.classList.contains("booked") ||
                btn.classList.contains("expired")
            ) return;

            document.querySelectorAll(".slot").forEach(s =>
                s.classList.remove("selected")
            );

            btn.classList.add("selected");

            selectedSlot = time;
            document.getElementById("slot").value = time;

        };

        grid.appendChild(btn);

        minute += interval;

        while (minute >= 60) {
            minute -= 60;
            hour++;
        }

    }

    // Update slot states
    updateExpiredSlots();
    loadBookedSlots();

}

// =======================================
// Load Booked Slots
// =======================================


function loadBookedSlots(){

    const date =
        document.getElementById("bookingDate").value;

    fetch(
        `${API}?action=getBookedSlots&date=${encodeURIComponent(date)}`
    )

    .then(res=>res.json())

    .then(data=>{

        console.table(data.slots);

        console.log("API Response:", data);

        console.log(data);

        console.log("Looking for date:", date);

        // Remove previous booked state
        document.querySelectorAll(".slot").forEach(button=>{

            button.classList.remove("booked");
            button.classList.add("available");
            button.disabled = false;

        });

        if(!data.success){

            return;

        }

        const selectedPlan = document.getElementById("overs").value;

        let selectedDuration = 10;

        if (selectedPlan === "10 Overs") selectedDuration = 20;
        if (selectedPlan === "20 Overs") selectedDuration = 30;

        function toMinutes(time) {
            const [h, m] = time.split(":").map(Number);
            return h * 60 + m;
        }

        document.querySelectorAll(".slot").forEach(btn => {

            const buttonStart = toMinutes(btn.dataset.slot);
            const buttonEnd = buttonStart + selectedDuration;

            let blocked = false;

            data.slots.forEach(slot => {

                const bookingStart = toMinutes(slot.time);
                const bookingEnd = bookingStart + Number(slot.duration);

                console.log(
                    "BTN:", btn.dataset.slot,
                    "BOOKING:", slot.time,
                    "DURATION:", slot.duration,
                    "buttonStart:", buttonStart,
                    "buttonEnd:", buttonEnd,
                    "bookingStart:", bookingStart,
                    "bookingEnd:", bookingEnd
                );

                if (
                    buttonStart < bookingEnd &&
                    buttonEnd > bookingStart
                ) {
                    blocked = true;
                }

            });

            console.log({
                button: btn.dataset.slot,
                buttonStart,
                buttonEnd,
                bookings: data.slots
            });

            if (blocked) {
                console.log("BLOCKING:", btn.dataset.slot);

                btn.style.background = "red";
                btn.style.color = "white";

                btn.classList.remove("available");
                btn.classList.add("booked");
                btn.disabled = true;
            }

        });

    });

}


function loadBookings(){

    fetch(`${API}?action=getBookings`)
    .then(res=>res.json())
    .then(data=>{

        console.table(data.bookings);

        const tbody = document.getElementById("bookingTable");

        tbody.innerHTML = "";

        if(!data.success || data.bookings.length===0){

            tbody.innerHTML=`
                <tr>
                    <td colspan="9">
                        No Bookings Found
                    </td>
                </tr>
            `;

            return;

        }

        const today =
        document.getElementById("bookingDate").value;

        console.log("Today =", today);
        console.log("Booking Date Input =", document.getElementById("bookingDate").value);

        data.bookings.forEach(b => {
            console.log("Booking Date =", JSON.stringify(b.date));
        });

        console.log("Selected Date:", today);

        allBookings = data.bookings.filter(b => {

            return String(b.date).trim() === String(today).trim();

        });

        console.log("Today's Bookings:", allBookings);

        applyFilters();

    });

}

function viewBooking(b){

    const editBtn = document.getElementById("editBookingBtn");

    if(b.status==="Pending"){

        editBtn.style.display="block";

    }else{

        editBtn.style.display="none";

    }

    currentBookingID = b.bookingID;
    currentBooking = b;

    document.getElementById("mBookingID").textContent=b.bookingID;
    document.getElementById("mName").textContent=b.name;
    document.getElementById("mPhone").textContent=b.phone;
    document.getElementById("mDate").textContent=b.date;
    document.getElementById("mTime").textContent=b.time;
    document.getElementById("mPlan").textContent=b.plan;
    document.getElementById("mPlayers").textContent=b.players;
    document.getElementById("mAmount").textContent="₹"+b.amount;
    document.getElementById("viewPaymentMethod").textContent =
        b.paymentMethod;

    document.getElementById("viewPaymentStatus").textContent =
        b.paymentStatus;
    const status=document.getElementById("mStatus");

    status.textContent=b.status;

    status.className="status-badge";

    if(b.status==="Pending"){

        status.classList.add("status-pending");

    }
    else if(b.status==="Completed"){

        status.classList.add("status-completed");

    }
    else{

        status.classList.add("status-cancelled");

    }

    document.getElementById("bookingModal")
        .classList.add("active");

    const completeBtn =
    document.getElementById("completeBookingBtn");

    const cancelBtn =
    document.getElementById("cancelBookingBtn");

    if(b.status==="Pending"){

        completeBtn.style.display="block";
        cancelBtn.style.display="block";

    }
    else{

        completeBtn.style.display="none";
        cancelBtn.style.display="none";

    }

}

document
.getElementById("closeModal")
.onclick=()=>{

    document
    .getElementById("bookingModal")
    .classList.remove("active");

};


function showToast(message,type="success"){

    const toast=document.getElementById("toast");

    toast.textContent=message;

    toast.className="";

    toast.classList.add(type);

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}

// ===============================
// Complete Booking
// ===============================

document.querySelector(".complete-btn").onclick = function(){

    const booking =
        allBookings.find(
            b => b.bookingID === currentBookingID
        );

    if(!booking) return;

    // Already paid → Complete directly
    if(booking.paymentStatus === "Paid"){

        fetch(
            `${API}?action=updateBookingStatus`
            + `&bookingID=${currentBookingID}`
            + `&status=Completed`
        )
        .then(r => r.json())
        .then(data => {

            if(data.success){

                showToast("Booking Completed");

                document
                    .getElementById("bookingModal")
                    .classList.remove("active");

                loadBookings();
                loadBookedSlots();
                loadBookingStats();

            }else{

                showToast(data.message,"error");

            }

        });

        return;
    }

    // Payment Pending → Show payment popup
    document.getElementById("payBookingID").textContent =
        booking.bookingID;

    document.getElementById("payCustomer").textContent =
        booking.name;

    document.getElementById("payAmount").textContent =
        booking.amount;

    document
        .getElementById("paymentModal")
        .classList.add("active");

};

document
.getElementById("closePaymentModal")
.onclick=function(){

    document
    .getElementById("paymentModal")
    .classList.remove("active");

};

document
.getElementById("receivePaymentBtn")
.onclick=function(){

    const paymentMethod =
    document
    .getElementById("completePaymentMethod")
    .value;

    fetch(

        `${API}?action=updateBookingStatus`

        + `&bookingID=${currentBookingID}`

        + `&status=Confirmed`

        + `&paymentMethod=${encodeURIComponent(paymentMethod)}`

    )

    .then(r=>r.json())

    .then(data=>{

        if(data.success){

            showToast("Payment Received");

            document
            .getElementById("paymentModal")
            .classList.remove("active");

            document
            .getElementById("bookingModal")
            .classList.remove("active");

            loadBookings();

            loadBookedSlots();

            loadBookingStats();

        }else{

            showToast(data.message,"error");

        }

    });

};

function resetEditMode(){

    editMode = false;

    currentBooking = null;

    document.getElementById("cancelEditBtn").style.display = "none";

    document.querySelector(".save-btn").innerHTML = `
        <i class="fa-solid fa-floppy-disk"></i>
        Save Booking
    `;

}

// ===============================
// Cancel Booking
// ===============================

document.getElementById("cancelBookingBtn").onclick = function(){

    document
        .getElementById("cancelModal")
        .classList.add("active");

};

document
.getElementById("closeCancelModal")
.onclick = function(){

    document
        .getElementById("cancelModal")
        .classList.remove("active");

};

document
.getElementById("confirmCancelBtn")
.onclick = function(){

    fetch(

        `${API}?action=updateBookingStatus`

        + `&bookingID=${currentBookingID}`

        + `&status=Cancelled`

    )

    .then(r=>r.json())

    .then(data=>{

        if(data.success){

            showToast("Booking Cancelled","error");

            document
                .getElementById("cancelModal")
                .classList.remove("active");

            document
                .getElementById("bookingModal")
                .classList.remove("active");

            loadBookings();

            loadBookedSlots();

            loadBookingStats();

        }else{

            showToast(data.message,"error");

        }

    });

};

function renderBookings(bookings){

    const tbody = document.getElementById("bookingTable");

    tbody.innerHTML = "";

    if(bookings.length===0){

        tbody.innerHTML=`
            <tr>
                <td colspan="9">
                    No Bookings Found
                </td>
            </tr>
        `;

        return;

    }

    bookings.forEach(b=>{

        tbody.innerHTML+=`

        <tr>

            <td>${b.bookingID}</td>

            <td>${b.name}</td>

            <td>${b.phone}</td>

            <td>${b.date}</td>

            <td>${b.time}</td>

            <td>${b.plan}</td>

            <td>

                ${isNaN(Number(b.amount))
                    ? b.amount
                    : "₹" + b.amount}

            </td>

            <td>

                <span class="payment-badge ${((b.paymentStatus || "Pending").toLowerCase())}">

                    ${b.paymentStatus || "Pending"}

                </span>

            </td>

            <td>

                <span class="status ${b.status.toLowerCase()}">
                    ${b.status}
                </span>

            </td>

            <td>

                <div class="action-buttons">

                    <button
                    class="action-btn view"
                    title="View Booking"
                    onclick='viewBooking(${JSON.stringify(b)})'>

                        <i class="fa-solid fa-eye"></i>

                    </button>

                    <button
                    class="action-btn edit"
                    title="Edit Booking"
                    onclick='editBooking("${b.bookingID}")'
                    ${b.status !== "Pending" ? "disabled" : ""}>

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                    class="action-btn complete"
                    title="Complete Booking"
                    onclick='quickComplete("${b.bookingID}")'
                    ${(b.status === "Pending" || b.status === "Confirmed") ? "" : "disabled"}>

                        <i class="fa-solid fa-check"></i>

                    </button>

                    <button
                    class="action-btn cancel"
                    title="Cancel Booking"
                    onclick='quickCancel("${b.bookingID}")'
                    ${b.status !== "Pending" ? "disabled" : ""}>

                        <i class="fa-solid fa-xmark"></i>

                    </button>

                </div>

            </td>

        </tr>

        `;

    });

}

document
.getElementById("searchBooking")
.addEventListener("input",applyFilters);

document
.querySelectorAll(".filter-btn")
.forEach(btn=>{

    btn.addEventListener("click",()=>{

        document
        .querySelectorAll(".filter-btn")
        .forEach(b=>b.classList.remove("active"));

        btn.classList.add("active");

        currentFilter = btn.dataset.status;

        applyFilters();

    });

});

function applyFilters(){

    const keyword =
        document
        .getElementById("searchBooking")
        .value
        .toLowerCase()
        .trim();

    let filtered = allBookings.filter(b=>{

        const matchesSearch =

            b.bookingID.toLowerCase().includes(keyword)

            ||

            b.name.toLowerCase().includes(keyword)

            ||

            String(b.phone).includes(keyword);

        const matchesStatus =

            currentFilter==="All"

            ||

            b.status===currentFilter;

        return matchesSearch && matchesStatus;

    });

    renderBookings(filtered);

}

document
.getElementById("editBookingBtn")
.onclick=function(){

    editMode = true;

    document.getElementById("cancelEditBtn").style.display = "inline-block";

    const saveBtn = document.querySelector(".save-btn");

    saveBtn.innerHTML = `
    <i class="fa-solid fa-pen"></i>
    Update Booking
    `;

    document.getElementById("bookingId").value =
        currentBooking.bookingID;

    document.getElementById("customerName").value =
        currentBooking.name;

    document.getElementById("phone").value =
        currentBooking.phone;

    document.getElementById("bookingDate").value =
    currentBooking.date;

    document.getElementById("slot").value =
        currentBooking.time;

    
    document.querySelectorAll(".slot").forEach(btn=>{

    btn.classList.remove("selected");

    if(btn.dataset.slot === currentBooking.time){

        btn.classList.add("selected");

    }

});

    document.getElementById("overs").value =
        currentBooking.plan;

    document.getElementById("players").value =
        currentBooking.players;

    document.getElementById("amount").value =
        currentBooking.amount;

    document.getElementById("payment").value =
        currentBooking.paymentMethod;

    document.getElementById("paymentStatus").value =
        currentBooking.paymentStatus;

    document
        .getElementById("bookingModal")
        .classList.remove("active");

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

};



document.getElementById("cancelEditBtn").onclick = function(){

    editMode = false;

    currentBooking = null;

    document.getElementById("bookingForm").reset();

    document.getElementById("slot").value = "";

    document.querySelectorAll(".slot").forEach(btn=>{
        btn.classList.remove("selected");
    });

    generateBookingID();

    updatePrice();

    document.querySelector(".save-btn").innerHTML = `
        <i class="fa-solid fa-floppy-disk"></i>
        Save Booking
    `;

    this.style.display = "none";

};

function editBooking(id){

    const booking = allBookings.find(
        b => b.bookingID === id
    );

    if(!booking) return;

    currentBooking = booking;

    document.getElementById("editBookingBtn").click();

}

function quickComplete(id){

    currentBookingID = id;

    document.querySelector(".complete-btn").click();

}

function quickCancel(id){

    currentBookingID = id;

    document.querySelector(".cancel-btn").click();

}


function loadBookingStats(){

    const date =
    document.getElementById("bookingDate").value;

    fetch(
        `${API}?action=getBookingStats&date=${encodeURIComponent(date)}`
    )

    .then(r=>r.json())

    .then(data=>{

        if(!data.success) return;

        document.getElementById("todayBookings").textContent =
            data.totalBookings;

        document.getElementById("todayRevenue").textContent =
            "₹" + data.revenue;

        document.getElementById("pendingBookings").textContent =
            data.pending;

        document.getElementById("completedBookings").textContent =
            data.completed;

    });

}


function loadRecentBookings(){

    fetch(`${API}?action=getRecentBookings`)

    .then(r=>r.json())

    .then(data=>{

        if(!data.success) return;

        const container =
            document.getElementById("recentBookings");

        container.innerHTML="";

        data.bookings.forEach(b=>{

            let icon="🟡";

            if(b.status==="Completed") icon="✅";
            if(b.status==="Cancelled") icon="❌";

            document.getElementById("recentBookings").innerHTML += `

                <div class="activity-item">

                    <div class="activity-icon">

                        ${icon}

                    </div>

                    <div class="activity-info">

                        <h4>${b.name}</h4>

                        <p>

                            ${b.plan} • ${b.time}<br>

                            Booking ID: ${b.bookingID}

                        </p>

                    </div>

                    <div class="activity-time">

                        ${b.status}

                    </div>

                </div>

            `;

        });

    });

}

const activityModal =
document.getElementById("activityModal");

document
.getElementById("openActivityModal")
.onclick=function(){

    activityModal.classList.add("active");

    loadRecentBookings();

};

document
.getElementById("closeActivityModal")
.onclick=function(){

    activityModal.classList.remove("active");

};

activityModal.onclick=function(e){

    if(e.target===activityModal){

        activityModal.classList.remove("active");

    }

};

const bookingType =
document.getElementById("bookingType");

bookingType.addEventListener("change", function () {

    const isMembership = this.value === "Membership";

    document.getElementById("membershipSection").style.display =
        isMembership ? "block" : "none";

    document.getElementById("memberCard").style.display = "none";

    if(isMembership){

        // Disable Promo Code
        document.getElementById("promoCode").disabled = true;
        document.getElementById("applyPromoBtn").disabled = true;

        // Reset Promo
        document.getElementById("promoCode").value = "";
        document.getElementById("discount").value = 0;
        document.getElementById("finalAmount").value = 0;
        document.getElementById("promoMessage").textContent = "";

        return;

    }

    // Reset Membership Data
    currentMember = null;

    document.getElementById("memberSearch").value = "";

    document.getElementById("customerName").value = "";

    document.getElementById("phone").value = "";

    document.getElementById("customerName").readOnly = false;

    document.getElementById("phone").readOnly = false;

    document.getElementById("overs").disabled = false;

    document.getElementById("amount").readOnly = false;

    document.getElementById("payment").disabled = false;

    document.getElementById("paymentStatus").disabled = false;

    document.getElementById("payment").value = "Cash";

    document.getElementById("paymentStatus").value = "Pending";

    // Enable Promo Code
    document.getElementById("promoCode").disabled = false;
    document.getElementById("applyPromoBtn").disabled = false;

    document.getElementById("finalAmount").value =
        document.getElementById("amount").value;

    document.getElementById("overs").value = "3 Overs";

    document.getElementById("players").value = 1;

    updatePrice();

});

document.getElementById("searchMemberBtn").onclick = function(){

    const keyword =
        document.getElementById("memberSearch")
        .value.trim();

    if(!keyword){

        showToast("Enter Member ID or Phone","error");

        return;

    }

    fetch(

        `${API}?action=searchMember&keyword=${encodeURIComponent(keyword)}`

    )

    .then(r=>r.json())

    .then(data=>{

        if(!data.success){

            currentMember = null;

            document.getElementById("memberCard").style.display = "none";

            showToast(data.message,"error");

            return;

        }

        currentMember = data.member;

        lockOversForMember();

        document.getElementById("customerName").value =
            currentMember.name;

        document.getElementById("phone").value =
            currentMember.phone;

        document.getElementById("customerName").readOnly = true;

        document.getElementById("phone").readOnly = true;

        document.getElementById("memberCard").style.display = "block";

        document.getElementById("mName").textContent =
            currentMember.name;

        document.getElementById("mPlan").textContent =
            currentMember.plan + " Membership";

        document.getElementById("mExpiry").textContent =
            currentMember.expiryDate;

        document.getElementById("mRemaining").textContent =
            currentMember.remainingOvers + " Overs";

        document.getElementById("mTodayUsed").textContent =
            currentMember.todayUsedOvers;

        document.getElementById("mDailyLimit").textContent =
            currentMember.oversPerDay + " Overs";

    });

};

function lockOversForMember(){

    if(!currentMember) return;

    const overs = document.getElementById("overs");
    const players = document.getElementById("players");

    switch(currentMember.plan){

        case "Beginner":

            overs.value = "5 Overs";
            players.max = 1;
            players.value = 1;
            break;

        case "Advanced":

            overs.value = "10 Overs";
            players.max = 1;
            players.value = 1;
            break;

        case "Professional":

            overs.value = "20 Overs";
            players.max = 3;
            players.value = 1;
            break;

    }

    overs.disabled = true;

    document.getElementById("membershipAmountNote").style.display = "none";

    document.getElementById("amount").readOnly = false;

    updatePrice();

    const amount = document.getElementById("amount");

    amount.value = 0;
    amount.readOnly = true;

    document.getElementById("membershipAmountNote").style.display = "block";

    amount.readOnly = true;

    document.getElementById("payment").disabled = true;

    document.getElementById("paymentStatus").disabled = true;

    document.getElementById("payment").value = "Membership";

    document.getElementById("paymentStatus").value = "Paid";

}


document.getElementById("applyPromoBtn").addEventListener("click", applyPromo);

function applyPromo(){

    const code =
        document.getElementById("promoCode").value.trim();

    if(!code){

        showToast("Enter Promo Code","error");

        return;

    }

    const amount =
        Number(document.getElementById("amount").value);

    fetch(

        `${API}?action=applyPromocode`
        + `&code=${encodeURIComponent(code)}`
        + `&amount=${amount}`

    )

    .then(r=>r.json())

    .then(data=>{

        if(data.success){

            document.getElementById("discount").value =
                data.discount;

            document.getElementById("finalAmount").value =
                data.finalAmount;

            document.getElementById("promoMessage").innerHTML =
                "✅ " + data.message;

            document.getElementById("promoMessage").style.color =
                "#22c55e";

        }else{

            document.getElementById("discount").value = 0;

            document.getElementById("finalAmount").value =
                document.getElementById("amount").value;

            document.getElementById("promoMessage").innerHTML =
                "❌ " + data.message;

            document.getElementById("promoMessage").style.color =
                "#ef4444";

        }

    });

}

// =======================================
// Auto Refresh Every Minute
// =======================================

setInterval(() => {

    loadBookings();
    loadBookingStats();
    loadBookedSlots();

}, 60000);