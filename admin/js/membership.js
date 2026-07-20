const API = "https://script.google.com/macros/s/AKfycbztFMvnMxcazCy79YYYwz3lIig-6Pq4d9X0Oi5AxVg--P4cXtNLqC9e8gYRIXedxYVW/exec";


const MEMBERSHIP_PLANS = {

    Beginner:{
        amount:649,
        validity:7,
        oversPerDay:5,
        totalOvers:35
    },

    Advanced:{
        amount:1399,
        validity:10,
        oversPerDay:10,
        totalOvers:100
    },

    Professional:{
        amount:2499,
        validity:10,
        oversPerDay:20,
        totalOvers:200
    }

};


document.getElementById("createMemberBtn").onclick = () => {

    resetMemberModal();

    document.getElementById("memberModal").style.display = "flex";

    document.getElementById("memberMode").value = "create";

    document.getElementById("memberModalTitle").innerText = "Create Membership";

    document.getElementById("saveMemberBtn").innerHTML = `
        <i class="fa-solid fa-floppy-disk"></i>
        Create Membership
    `;

};

document.getElementById("closeMemberModal").onclick = () => {

    document.getElementById("memberModal").style.display = "none";

    resetMemberModal();

};

window.onclick = function(e){

    if(e.target==document.getElementById("memberModal")){

        document.getElementById("memberModal").style.display="none";

    }

}

function updateMembershipPlan(){

    const plan = document.getElementById("memberPlan").value;
    const joinDate = document.getElementById("memberJoinDate").value;

    if(!plan) return;

    const config = MEMBERSHIP_PLANS[plan];

    document.getElementById("memberAmount").value = config.amount;

    document.getElementById("memberOversPerDay").value = config.oversPerDay;

    document.getElementById("memberTotalOvers").value = config.totalOvers;

    if(joinDate){

        const expiry = new Date(joinDate);

        expiry.setDate(expiry.getDate() + config.validity);

        document.getElementById("memberExpiryDate").value =
            expiry.toISOString().split("T")[0];

    }
}
document
.getElementById("memberPlan")
.addEventListener("change", function(){

    if(document.getElementById("memberMode").value === "create"){

        updateMembershipPlan();

    }else{

        updateEditPlan();

    }

});

document
.getElementById("memberJoinDate")
.addEventListener("change", updateMembershipPlan);



document.getElementById("saveMemberBtn").onclick = function () {

    if (document.getElementById("memberMode").value === "create") {

        saveMembership();

    } else {

        updateMember();

    }

};


function saveMembership(){

    const name = document.getElementById("memberName").value.trim();
    const phone = document.getElementById("memberPhone").value.trim();
    const plan = document.getElementById("memberPlan").value;
    const joinDate = document.getElementById("memberJoinDate").value;
    const expiryDate = document.getElementById("memberExpiryDate").value;
    const amount = document.getElementById("memberAmount").value;

    if(!name || !phone || !plan || !joinDate){

        Swal.fire(
            "Missing Details",
            "Please fill all required fields.",
            "warning"
        );

        return;
    }

    const url =
        `${API}?action=createMembership` +
        `&name=${encodeURIComponent(name)}` +
        `&phone=${encodeURIComponent(phone)}` +
        `&plan=${encodeURIComponent(plan)}` +
        `&joinDate=${joinDate}` +
        `&expiryDate=${expiryDate}` +
        `&amount=${amount}`;

    fetch(url)

    .then(r=>r.json())

    .then(data=>{

        if(data.success){

            Swal.fire({

                icon:"success",

                title:"Membership Created",

                text:`Member ID : ${data.memberID}`

            });

            document.getElementById("memberModal").style.display="none";

            clearMembershipForm();

            loadMembers();

        }else{

            Swal.fire(
                "Error",
                data.message,
                "error"
            );

        }

    });

}


function clearMembershipForm(){

    document.getElementById("memberName").value="";
    document.getElementById("memberPhone").value="";
    document.getElementById("memberPlan").value="";
    document.getElementById("memberJoinDate").value="";
    document.getElementById("memberExpiryDate").value="";
    document.getElementById("memberAmount").value="";
    document.getElementById("memberOversPerDay").value="";
    document.getElementById("memberTotalOvers").value="";
    document.getElementById("memberStatus").value="Active";

}

function resetMemberModal(){

    clearMembershipForm();

    document.getElementById("memberMode").value = "create";

    document.getElementById("memberRow").value = "";

    document.getElementById("memberModalTitle").innerText =
        "Create Membership";

    document.getElementById("saveMemberBtn").innerHTML = `
        <i class="fa-solid fa-floppy-disk"></i>
        Create Membership
    `;

}

let allMembers = [];

let statusFilter = "All";
let planFilter = "All";
let searchText = "";

function loadMembers(){

    fetch(API + "?action=getMemberships")

    .then(r=>r.json())

    .then(data=>{

        if(!data.success) return;

        allMembers = data.members;

        renderMembers();

        loadMembershipStats();

    });

}

function renderMembers(){

    const tbody = document.getElementById("membershipTableBody");

    tbody.innerHTML = "";

    let members = [...allMembers];

    // Remove deleted members
    members = members.filter(m => m.status !== "Deleted");

    // Search
    if(searchText){

        const text = searchText.toLowerCase();

        members = members.filter(m =>

            String(m.memberID).toLowerCase().includes(text) ||

            String(m.name).toLowerCase().includes(text) ||

            String(m.phone).toLowerCase().includes(text)

        );

    }

    // Status filter
    if(statusFilter !== "All"){

        members = members.filter(m =>
            m.status === statusFilter
        );

    }

    // Plan filter
    if(planFilter !== "All"){

        members = members.filter(m =>
            m.plan === planFilter
        );

    }

    members.forEach(member=>{

        tbody.innerHTML += `

        <tr>

            <td>${member.memberID}</td>

            <td>${member.name}</td>

            <td>${member.phone}</td>

            <td>${member.plan}</td>

            <td>${formatDate(member.joinDate)}</td>

            <td>${formatDate(member.expiryDate)}</td>

            <td>₹${member.amount}</td>

            <td>
                <span class="member-status ${member.status.toLowerCase()}">
                    ${member.status}
                </span>
            </td>

            <td>

                <div class="action-buttons">

                    <button class="manage-btn"
                        onclick="manageMember(${member.row})">
                        <i class="fa-solid fa-gear"></i>
                    </button>

                    <button class="edit-btn"
                        onclick="editMember(${member.row})">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button class="delete-btn"
                        onclick="deleteMember(${member.row})">
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            </td>

        </tr>

        `;

    });

}

function formatDate(date){

    const d = new Date(date);

    return d.toLocaleDateString("en-GB");

}
loadMembers();  

function loadMembershipStats(){

    const total = allMembers.length;

    const active = allMembers.filter(
        m => m.status === "Active"
    ).length;

    const expired = allMembers.filter(
        m => m.status === "Expired"
    ).length;

    const revenue = allMembers.reduce(
        (sum,m)=>sum+Number(m.amount),
        0
    );

    document.getElementById("totalMembers").innerText = total;

    document.getElementById("activeMembers").innerText = active;

    document.getElementById("expiredMembers").innerText = expired;

    document.getElementById("membershipRevenue").innerText =
        "₹" + revenue.toLocaleString("en-IN");

}

let currentManageMember = null;

function manageMember(row){

    currentManageMember = allMembers.find(m => m.row == row);

    if(!currentManageMember) return;

    document.getElementById("renewRow").value = row;

    document.getElementById("renewMemberID").value =
        currentManageMember.memberID;

    document.getElementById("renewMemberName").value =
        currentManageMember.name;

    document.getElementById("currentPlan").value =
        currentManageMember.plan;

    document.getElementById("newPlan").value =
        currentManageMember.plan;

    document.getElementById("renewCurrentExpiry").value =
        formatDate(currentManageMember.expiryDate);

    document.getElementById("renewUsedOvers").value =
        currentManageMember.usedOvers;

    document.getElementById("renewRemainingOvers").value =
        currentManageMember.remainingOvers;

    document.getElementById("renewStatus").value =
        currentManageMember.status;

    updateManagePlan();

    document.getElementById("manageModal").style.display = "flex";

}

document.getElementById("closeRenewModal").onclick = () => {

    document.getElementById("manageModal").style.display = "none";

};

function editMember(row){

    const member = allMembers.find(m => m.row == row);

    if(!member) return;

    document.getElementById("memberMode").value = "edit";

    document.getElementById("memberRow").value = row;

    document.getElementById("memberModalTitle").innerText =
        "Edit Membership";

    document.getElementById("saveMemberBtn").innerHTML = `
        <i class="fa-solid fa-floppy-disk"></i>
        Update Membership
    `;

    document.getElementById("memberName").value = member.name;
    document.getElementById("memberPhone").value = member.phone;
    document.getElementById("memberPlan").value = member.plan;

    console.log(member.joinDate);
    console.log(typeof member.joinDate);

    // Join Date
    document.getElementById("memberJoinDate").value =
    String(member.joinDate).split("T")[0];

    // Expiry Date
    document.getElementById("memberExpiryDate").value =
    String(member.expiryDate).split("T")[0];

    document.getElementById("memberAmount").value = member.amount;

    updateEditPlan();

    document.getElementById("memberModal").style.display = "flex";

}

function updateManagePlan() {

    if (!currentManageMember) return;

    const planName = document.getElementById("newPlan").value;
    const plan = MEMBERSHIP_PLANS[planName];

    document.getElementById("renewAmount").value =
        "₹" + plan.amount;

    document.getElementById("renewOversPerDay").value =
        plan.oversPerDay;

    document.getElementById("renewTotalOvers").value =
        plan.totalOvers;

    document.getElementById("renewUsedOvers").value = 0;

    document.getElementById("renewRemainingOvers").value =
        plan.totalOvers;

    let expiry;

    // Same plan = Renewal
    if (planName === currentManageMember.plan) {

        expiry = new Date(currentManageMember.expiryDate);

        expiry.setMinutes(
            expiry.getMinutes() + expiry.getTimezoneOffset()
        );

        // Extend from current expiry
        expiry.setDate(expiry.getDate() + plan.validity);

    } else {

        // Different plan = Upgrade / Downgrade

        expiry = new Date();

        expiry.setHours(0, 0, 0, 0);

        // Start from today
        expiry.setDate(expiry.getDate() + plan.validity);

    }

    const yyyy = expiry.getFullYear();
    const mm = String(expiry.getMonth() + 1).padStart(2, "0");
    const dd = String(expiry.getDate()).padStart(2, "0");

    document.getElementById("renewExpiry").value =
        `${yyyy}-${mm}-${dd}`;
}
  
document
.getElementById("newPlan")
.addEventListener("change", updateManagePlan);

document
.getElementById("updateMembershipBtn")
.onclick = updateMembership;

function updateMembership(){

    const row = document.getElementById("renewRow").value;

    const plan = document.getElementById("newPlan").value;

    const amount =
        document.getElementById("renewAmount")
        .value.replace("₹","");

    const expiry =
        document.getElementById("renewExpiry").value;
    
    let joinDate;

    // Renewal (same plan)
    if (plan === currentManageMember.plan) {

        // Keep existing join date
        const d = new Date(currentManageMember.joinDate);

        d.setMinutes(d.getMinutes() + d.getTimezoneOffset());

        joinDate = d.toISOString().split("T")[0];

    } else {

        // Upgrade / Downgrade
        joinDate = new Date().toISOString().split("T")[0];

    }

    fetch(

        `${API}?action=updateMembership`

        + `&row=${row}`

        + `&plan=${encodeURIComponent(plan)}`

        + `&amount=${amount}`

        + `&joinDate=${joinDate}`

        + `&expiryDate=${expiry}`

    )

    .then(r=>r.json())

    .then(data=>{

        if(data.success){

            Swal.fire({

                icon:"success",

                title:"Membership Updated",

                text:data.message

            });

            document.getElementById("manageModal").style.display="none";

            loadMembers();

        }else{

            Swal.fire(

                "Error",

                data.message,

                "error"

            );

        }

    });

}

function updateMember(){

    const row = document.getElementById("memberRow").value;

    const name = document.getElementById("memberName").value.trim();

    const phone = document.getElementById("memberPhone").value.trim();

    const plan = document.getElementById("memberPlan").value;

    const joinDate = document.getElementById("memberJoinDate").value;

    const expiryDate = document.getElementById("memberExpiryDate").value;

    const amount = document.getElementById("memberAmount").value;

    const status = document.getElementById("memberStatus").value;

    fetch(

        `${API}?action=editMembership`

        + `&row=${row}`

        + `&name=${encodeURIComponent(name)}`

        + `&phone=${encodeURIComponent(phone)}`

        + `&plan=${encodeURIComponent(plan)}`

        + `&joinDate=${joinDate}`

        + `&expiryDate=${expiryDate}`

        + `&amount=${amount}`

        + `&status=${status}`

    )

    .then(r=>r.json())

    .then(data=>{

        if(data.success){

            Swal.fire({

                icon:"success",

                title:"Updated",

                text:data.message

            });

            document.getElementById("memberModal").style.display="none";

            resetMemberModal();

            loadMembers();

        }else{

            Swal.fire(
                "Error",
                data.message,
                "error"
            );

        }

    });

}

function deleteMember(row){

    Swal.fire({

        title:"Delete Membership?",

        text:"This member will be marked as deleted.",

        icon:"warning",

        showCancelButton:true,

        confirmButtonColor:"#d33",

        confirmButtonText:"Yes, Delete"

    }).then((result)=>{

        if(!result.isConfirmed) return;

        fetch(

            `${API}?action=deleteMembership&row=${row}`

        )

        .then(r=>r.json())

        .then(data=>{

            if(data.success){

                Swal.fire(

                    "Deleted",

                    data.message,

                    "success"

                );

                loadMembers();

            }

        });

    });

}

document
.getElementById("searchMember")
.addEventListener("input",function(){

    searchText = this.value.trim();

    renderMembers();

});

function setStatusFilter(filter){

    statusFilter = filter;

    document
    .querySelectorAll(".status-filter")
    .forEach(btn=>btn.classList.remove("active"));

    document
    .getElementById("status"+filter)
    .classList.add("active");

    renderMembers();

}

function setPlanFilter(filter){

    planFilter = filter;

    document
    .querySelectorAll(".plan-filter")
    .forEach(btn=>btn.classList.remove("active"));

    document
    .getElementById("plan"+filter)
    .classList.add("active");

    renderMembers();

}

document.getElementById("statusAll").onclick = ()=>setStatusFilter("All");
document.getElementById("statusActive").onclick = ()=>setStatusFilter("Active");
document.getElementById("statusExpired").onclick = ()=>setStatusFilter("Expired");

document.getElementById("planAll").onclick = ()=>setPlanFilter("All");
document.getElementById("planBeginner").onclick = ()=>setPlanFilter("Beginner");
document.getElementById("planAdvanced").onclick = ()=>setPlanFilter("Advanced");
document.getElementById("planProfessional").onclick = ()=>setPlanFilter("Professional");


function updateEditPlan(){

    const planName = document.getElementById("memberPlan").value;

    if(!planName) return;

    const plan = MEMBERSHIP_PLANS[planName];

    document.getElementById("memberAmount").value = plan.amount;
    document.getElementById("memberOversPerDay").value = plan.oversPerDay;
    document.getElementById("memberTotalOvers").value = plan.totalOvers;

}