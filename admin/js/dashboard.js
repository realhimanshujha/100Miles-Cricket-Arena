const API =
"https://script.google.com/macros/s/AKfycbztFMvnMxcazCy79YYYwz3lIig-6Pq4d9X0Oi5AxVg--P4cXtNLqC9e8gYRIXedxYVW/exec";


let revenueChart = null;

// ================================
// Load Sidebar Component
// ================================

fetch("./components/sidebar.html")
.then(response => {
    console.log("Status:", response.status);
    console.log("URL:", response.url);
    return response.text();
})
.then(html => {
    console.log("HTML:", html);

    document.getElementById("sidebar-container").innerHTML = html;

    console.log("Sidebar:", document.getElementById("sidebar"));

    const script = document.createElement("script");
    script.src = "js/sidebar.js";
    document.body.appendChild(script);
})
.catch(err => console.error(err))

.catch(error => {

    console.error("Unable to load sidebar.", error);

});


// ================================
// Check Login
// ================================

if(sessionStorage.getItem("adminLoggedIn") !== "true"){

    window.location.href = "index.html";

}


// ================================
// Display Admin Name
// ================================

const adminName = sessionStorage.getItem("adminName");

if(adminName){

    document.getElementById("adminName").textContent = adminName;

}


// ================================
// Dashboard Ready
// ================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("Dashboard Loaded Successfully");

    loadDashboardStats();

    loadRevenueChart();

    loadRecentActivity();

    loadNotifications();

        // ================================
    // Quick Actions
    // ================================

    document.getElementById("newBookingBtn").addEventListener("click", () => {

        window.location.href = "bookings.html";

    });

    document.getElementById("newLoyaltyBtn").addEventListener("click", () => {

        window.location.href = "loyalty.html";

    });

    document.getElementById("promoBtn").addEventListener("click", () => {

        window.location.href = "Promocodes.html";

    });

    document.getElementById("membershipBtn").addEventListener("click", () => {

        window.location.href = "membership.html";

    });

});


function loadDashboardStats(){

    fetch(`${API}?action=getDashboardStats`)

    .then(r=>r.json())

    .then(data=>{

        if(!data.success) return;

        document.getElementById("todayBookings").textContent =
        data.todayBookings;

        document.getElementById("todayRevenue").textContent =
        "₹"+data.todayRevenue;

        document.getElementById("loyaltyCards").textContent =
        data.loyaltyCards;

        document.getElementById("memberships").textContent =
        data.memberships;

    });

}
function loadRevenueChart(){

    fetch(`${API}?action=getRevenueChart`)
    .then(r => r.json())
    .then(data => {

        if(!data.success) return;

        const ctx = document
            .getElementById("revenueChart")
            .getContext("2d");

        // Destroy old chart before creating a new one
        if(revenueChart){

            revenueChart.destroy();

        }

        revenueChart = new Chart(ctx,{

            type:"line",

            data:{

                labels:data.labels,

                datasets:[{

                    label:"Revenue",

                    data:data.revenue,

                    borderColor:"#FFC107",

                    backgroundColor:"rgba(255,193,7,.15)",

                    fill:true,

                    tension:0.4,

                    borderWidth:3,

                    pointRadius:5,

                    pointHoverRadius:7,

                    pointBackgroundColor:"#FFC107"

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                animation:false,

                plugins:{
                    legend:{
                        display:false
                    }
                },

                scales:{

                    x:{
                        grid:{
                            display:false
                        },
                        ticks:{
                            color:"#ddd"
                        }
                    },

                    y:{
                        beginAtZero:true,

                        ticks:{
                            color:"#ddd"
                        },

                        grid:{
                            color:"rgba(255,255,255,.08)"
                        }
                    }

                }

            }

        });

    });

}

function loadRecentActivity(){

    fetch(`${API}?action=getRecentBookings`)

    .then(r=>r.json())

    .then(data=>{

        if(!data.success) return;

        const container =
            document.getElementById("recentActivity");

        container.innerHTML="";

        if(data.bookings.length===0){

            container.innerHTML="<p>No recent activity.</p>";

            return;

        }

        data.bookings.forEach(b=>{

            let icon="🟡";

            let cls="pending";

            if(b.status==="Completed"){

                icon="✅";
                cls="completed";

            }

            if(b.status==="Cancelled"){

                icon="❌";
                cls="cancelled";

            }

            container.innerHTML += `

            <div class="activity-item">

                <div class="activity-left">

                    <div class="activity-icon">

                        ${icon}

                    </div>

                    <div class="activity-info">

                        <h4>${b.name}</h4>

                        <p>
                            ${b.date} • ${b.time} • ${b.plan}
                        </p>

                    </div>

                </div>

                <span class="activity-status ${cls}">

                    ${b.status}

                </span>

            </div>

            `;

        });

    });

}

const bell =
document.getElementById("notificationBtn");

const dropdown =
document.getElementById("notificationDropdown");

bell.addEventListener("click",()=>{

    dropdown.classList.toggle("show");

});

document.addEventListener("click",(e)=>{

    if(

        !bell.contains(e.target) &&
        !dropdown.contains(e.target)

    ){

        dropdown.classList.remove("show");

    }

});


function loadNotifications(){

    fetch(`${API}?action=getNotifications`)

    .then(r=>r.json())

    .then(data=>{

        if(!data.success) return;

        const badge =
            document.getElementById("notificationCount");

        badge.textContent = data.count;

        if(data.count > 0){

            badge.style.display = "flex";

        }else{

            badge.style.display = "none";

        }

        const list =
            document.getElementById("notificationList");

        list.innerHTML = "";

        data.notifications.forEach(n=>{

            list.innerHTML += `

            <div class="notification-item">

                <div class="notification-icon">

                    ${n.icon}

                </div>

                <div class="notification-content">

                    <h4>${n.title}</h4>

                    <p>${n.message}</p>

                    <div class="notification-time">

                        ${n.time}

                    </div>

                </div>

            </div>

            `;

        });

    });

}

function markNotificationsRead(){

  setSetting(

    "LastNotificationRead",

    Utilities.formatDate(

      new Date(),

      Session.getScriptTimeZone(),

      "yyyy-MM-dd HH:mm:ss"

    )

  );

  return{

    success:true

  };

}

document
.getElementById("markReadBtn")
.addEventListener("click",()=>{

    fetch(`${API}?action=markNotificationsRead`)

    .then(r=>r.json())

    .then(data=>{

        if(data.success){

            loadNotifications();

        }

    });

});


// =======================================
// Auto Refresh Dashboard
// =======================================

setInterval(() => {

loadDashboardStats();

loadRevenueChart();

loadRecentActivity();

loadNotifications();

// Auto refresh

setInterval(loadNotifications,10000);

setInterval(loadRecentActivity,30000);

setInterval(loadDashboardStats,30000);

}, 10000);


// =======================================
// Auto Refresh Every Minute
// =======================================

setInterval(() => {

    loadBookings();
    loadBookingStats();
    loadBookedSlots();

}, 60000);