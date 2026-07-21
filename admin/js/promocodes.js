const API = CONFIG.API_URL;


let allPromocodes = [];
// =============================
// Open Create Promocode Modal
// =============================

document
.getElementById("createPromoBtn")
.onclick=function(){

    // Modal Mode
    document.getElementById("promoMode").value = "create";

    // Clear previous row
    document.getElementById("promoRow").value = "";

    // Modal Title
    document.getElementById("promoModalTitle").innerHTML = "Create Promocode";

    // Button Text
    document.getElementById("savePromoBtn").innerHTML = `
        <i class="fa-solid fa-floppy-disk"></i>
        Create Promocode
    `;

    // Clear all fields
    document.getElementById("promoCodeInput").value = "";
    document.getElementById("promoTypeInput").value = "Percentage";
    document.getElementById("promoValueInput").value = "";
    document.getElementById("promoMinBooking").value = "";
    document.getElementById("promoMaxDiscount").value = "";
    document.getElementById("promoUsageLimit").value = "";
    document.getElementById("promoExpiryDate").value = "";
    document.getElementById("promoStatusInput").value = "Active";

    // Open Modal
    document.getElementById("promoModal").style.display = "flex";

};

// =============================
// Close Modal
// =============================

document
.getElementById("closePromoModal")
.onclick=function(){

    document
    .getElementById("promoModal")
    .style.display="none";

};

window.onclick=function(e){

    if(e.target.id==="promoModal"){

        document
        .getElementById("promoModal")
        .style.display="none";

    }

};

document.getElementById("savePromoBtn").onclick = function () {

    const code = document.getElementById("promoCodeInput").value.trim();
    const type = document.getElementById("promoTypeInput").value;
    const value = document.getElementById("promoValueInput").value;
    const minBooking = document.getElementById("promoMinBooking").value;
    const maxDiscount = document.getElementById("promoMaxDiscount").value;
    const usageLimit = document.getElementById("promoUsageLimit").value;
    const expiry = document.getElementById("promoExpiryDate").value;
    const status = document.getElementById("promoStatusInput").value;
    const mode = document.getElementById("promoMode").value;
    const row = document.getElementById("promoRow").value;

    if(code === ""){

        Swal.fire(
            "Missing Promocode",
            "Please enter a promocode.",
            "warning"
        );

        return;

    }

    if(value === ""){

        Swal.fire(
            "Missing Discount",
            "Enter the discount value.",
            "warning"
        );

        return;

    }

    if(usageLimit === ""){

        Swal.fire(
            "Missing Usage Limit",
            "Enter the usage limit.",
            "warning"
        );

        return;

    }

    if(expiry === ""){

        Swal.fire(
            "Missing Expiry Date",
            "Select an expiry date.",
            "warning"
        );

        return;

    }

    let url = "";

    if(mode == "create"){

        url =
            `${API}?action=createPromocode` +
            `&code=${encodeURIComponent(code)}` +
            `&type=${encodeURIComponent(type)}` +
            `&value=${encodeURIComponent(value)}` +
            `&minBooking=${encodeURIComponent(minBooking)}` +
            `&maxDiscount=${encodeURIComponent(maxDiscount)}` +
            `&usageLimit=${encodeURIComponent(usageLimit)}` +
            `&expiry=${encodeURIComponent(expiry)}` +
            `&status=${encodeURIComponent(status)}` +
            `&paymentRule=${encodeURIComponent(document.getElementById("promoPaymentRule").value)}`;

    }else{

        url =
            `${API}?action=updatePromocode` +
            `&row=${row}` +
            `&code=${encodeURIComponent(code)}` +
            `&type=${encodeURIComponent(type)}` +
            `&value=${encodeURIComponent(value)}` +
            `&minBooking=${encodeURIComponent(minBooking)}` +
            `&maxDiscount=${encodeURIComponent(maxDiscount)}` +
            `&usageLimit=${encodeURIComponent(usageLimit)}` +
            `&expiry=${encodeURIComponent(expiry)}` +
            `&status=${encodeURIComponent(status)}`;

    }

    console.log(url);

    fetch(url)
        .then(r => r.json())
        .then(data => {

            console.log(data);

            if(data.success){

                Swal.fire({
                    icon:"success",
                    title:"Success",
                    text:"Promocode created successfully."
                });

                document.getElementById("promoModal").style.display = "none";

                loadPromocodes();

            }else{

                document.getElementById("promoModal").style.display = "none";

                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.message
                }).then(() => {

                    // Reopen the modal so the admin can fix the values
                    document.getElementById("promoModal").style.display = "flex";

                });

            }

        })
        .catch(err => {

            console.error(err);

        });

};

// =============================
// Format Date
// =============================

function formatDate(date){

    const d = new Date(date);

    return d.toLocaleDateString("en-GB");

}

// =============================
// Load Promocodes
// =============================

function loadPromocodes(){

    fetch(API + "?action=getPromocodes")

    .then(r => r.json())

    .then(data => {

        console.log(data.promocodes);

        if(!data.success) return;

        allPromocodes = data.promocodes;

        const tbody = document.getElementById("promocodeTableBody");

        tbody.innerHTML = "";

        let total = 0;
        let active = 0;
        let expired = 0;
        let redeemed = 0;

        const today = new Date();
        today.setHours(0,0,0,0);

        data.promocodes.forEach(promo => {

            total++;

            const expiry = new Date(promo.expiry);
            expiry.setHours(0,0,0,0);

            if (promo.status === "Active") {

                if (expiry >= today) {

                    active++;

                } else {

                    expired++;

                }

            }

            if (Number(promo.usage) > 0) {

                redeemed++;

            }

            tbody.innerHTML += `

            <tr>

                <td>${promo.code}</td>

                <td>${promo.type}</td>

                <td>${promo.value}</td>

                <td>₹${promo.minBooking}</td>

                <td>₹${promo.maxDiscount}</td>

                <td>${promo.usage}</td>

                <td>${promo.usageLimit}</td>

                <td>${formatDate(promo.expiry)}</td>

                <td>
                    <span class="promo-status ${promo.status.toLowerCase()}">
                        ${promo.status}
                    </span>
                </td>

                <td>

                    <div class="action-buttons">

                        <button class="edit-btn" onclick="editPromocode(${promo.row})">

                            <i class="fa-solid fa-pen"></i>

                        </button>

                        <button class="delete-btn" onclick="deletePromocode(${promo.row})">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </td>

            </tr>

            `;

        
            document.getElementById("totalCodes").textContent = total;

            document.getElementById("activeCodes").textContent = active;

            document.getElementById("expiredCodes").textContent = expired;

            document.getElementById("usedCodes").textContent = redeemed;

        });

    });

}

loadPromocodes();

function searchPromocodes(){

    const keyword = document
        .getElementById("searchPromo")
        .value
        .toLowerCase()
        .trim();

    const rows = document.querySelectorAll("#promocodeTableBody tr");

    rows.forEach((row,index)=>{

        const promo = allPromocodes[index];

        if(!promo) return;

        const match =
            promo.code.toLowerCase().includes(keyword) ||
            promo.type.toLowerCase().includes(keyword);

        row.style.display = match ? "" : "none";

    });

}

document
.getElementById("searchPromo")
.addEventListener("input",searchPromocodes);

document
.getElementById("searchPromoBtn")
.onclick = searchPromocodes;


function filterPromocodes(filter){

    const rows = document.querySelectorAll("#promocodeTableBody tr");

    const today = new Date();

    today.setHours(0,0,0,0);

    rows.forEach((row,index)=>{

        const promo = allPromocodes[index];

        if(!promo) return;

        const expiry = new Date(promo.expiry);

        expiry.setHours(0,0,0,0);

        let show = false;

        switch(filter){

            case "all":

                show = true;

                break;

            case "active":

                show = promo.status=="Active" && expiry>=today;

                break;

            case "expired":

                show = expiry<today;

                break;

            case "disabled":

                show = promo.status=="Disabled";

                break;

        }

        row.style.display = show ? "" : "none";

    });

}

document.getElementById("filterAll").onclick=function(){

    filterPromocodes("all");

};

document.getElementById("filterActive").onclick=function(){

    filterPromocodes("active");

};

document.getElementById("filterExpired").onclick=function(){

    filterPromocodes("expired");

};

document.getElementById("filterDisabled").onclick=function(){

    filterPromocodes("disabled");

};

const filterButtons = document.querySelectorAll(".filter-buttons button");

filterButtons.forEach(btn=>{

    btn.addEventListener("click",()=>{

        filterButtons.forEach(b=>b.classList.remove("active"));

        btn.classList.add("active");

    });

});


function editPromocode(row){

    const promo = allPromocodes.find(p => p.row == row);

    if(!promo) return;

    document.getElementById("promoMode").value="edit";

    document.getElementById("promoRow").value=row;

    document.getElementById("promoModalTitle").innerHTML="Edit Promocode";

    document.getElementById("savePromoBtn").innerHTML="Update Promocode";

    document.getElementById("promoCodeInput").value=promo.code;

    document.getElementById("promoTypeInput").value=promo.type;

    document.getElementById("promoValueInput").value=promo.value;

    document.getElementById("promoMinBooking").value=promo.minBooking;

    document.getElementById("promoMaxDiscount").value=promo.maxDiscount;

    document.getElementById("promoUsageLimit").value=promo.usageLimit;

    const expiryDate = new Date(promo.expiry);

    const year = expiryDate.getFullYear();
    const month = String(expiryDate.getMonth() + 1).padStart(2, "0");
    const day = String(expiryDate.getDate()).padStart(2, "0");

    document.getElementById("promoExpiryDate").value =
        `${year}-${month}-${day}`;

    document.getElementById("promoStatusInput").value=promo.status;

    document.getElementById("promoModal").style.display="flex";

}

function deletePromocode(row){

    Swal.fire({

        title:"Delete Promocode?",

        text:"This action cannot be undone.",

        icon:"warning",

        showCancelButton:true,

        confirmButtonColor:"#d33",

        confirmButtonText:"Delete"

    })

    .then(result=>{

        if(!result.isConfirmed) return;

        fetch(

            `${API}?action=deletePromocode&row=${row}`

        )

        .then(r=>r.json())

        .then(data=>{

            if(data.success){

                Swal.fire(

                    "Deleted",

                    "Promocode deleted successfully.",

                    "success"

                );

                loadPromocodes();

            }

        });

    });

}


function resetPromo(){

    document.getElementById("promoCode").value = "";

    document.getElementById("discount").value = 0;

    document.getElementById("promoMessage").textContent = "";

    document.getElementById("finalAmount").value =
        document.getElementById("amount").value;

}