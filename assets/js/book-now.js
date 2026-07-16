const API_URL =
"https://script.google.com/macros/s/AKfycbztFMvnMxcazCy79YYYwz3lIig-6Pq4d9X0Oi5AxVg--P4cXtNLqC9e8gYRIXedxYVW/exec";

const bookingButton =
document.querySelector(".booking-btn");

const customerName =
document.getElementById("customerName");

const customerPhone =
document.getElementById("customerPhone");

const customerNotes =
document.getElementById("customerNotes");

const promoCount =
document.getElementById("promoCount");

const promoModal =
document.getElementById("promoModal");

const promoList =
document.getElementById("promoList");

const viewPromos =
document.getElementById("viewPromos");

const closePromo =
document.getElementById("closePromo");


const planInputs = document.querySelectorAll('input[name="plan"]');

const summaryPlan = document.getElementById("summaryPlan");
const summaryPrice = document.getElementById("summaryPrice");
const summaryEquipment = document.getElementById("summaryEquipment");
const summaryDiscount = document.getElementById("summaryDiscount");
const summaryTotal = document.getElementById("summaryTotal");

const promoInput = document.getElementById("promoCode");
const applyPromo = document.getElementById("applyPromo");
const promoMessage = document.getElementById("promoMessage");
const summarySaving = document.getElementById("summarySaving");

let basePrice = 199;
let equipmentPrice = 0;
let discount = 0;
let appliedPromo = null;

function updateSummary(){

    const total = basePrice + equipmentPrice - discount;

    if(summaryPlan){

        summaryPlan.textContent = document.querySelector('input[name="plan"]:checked').dataset.plan;

    }

    if(summaryPrice){

        summaryPrice.textContent = `₹${basePrice}`;

    }

    if(summaryEquipment){

        summaryEquipment.textContent =
            equipmentPrice > 0
            ? `+₹${equipmentPrice}`
            : "₹0";

    }

    if(summaryDiscount){

        summaryDiscount.textContent =
            discount > 0
            ? `-₹${discount}`
            : "₹0";

    }

    if(summaryTotal){

        summaryTotal.textContent = `₹${total}`;

    }

    bookingButton.textContent =
    `Pay ₹${total.toFixed(2)}`;

}

planInputs.forEach(input=>{

    input.addEventListener("change",function(){

        basePrice = Number(this.dataset.price);

        summaryPlan.textContent = this.dataset.plan;

        resetPromo();

    });

});

resetPromo();
animateValue(summaryEquipment);
animateValue(summaryTotal);


/* ============================
   EQUIPMENT
============================ */

const equipmentCheckbox = document.getElementById("equipment");

equipmentCheckbox.addEventListener("change", function(){

    if(this.checked){

        equipmentPrice = 50;

    }else{

        equipmentPrice = 0;

    }

    updateSummary();

});

function animateValue(element){

    element.classList.add("updated");

    setTimeout(()=>{

        element.classList.remove("updated");

    },300);

}

applyPromo.addEventListener("click", applyPromoCode);

async function applyPromoCode() {

    const code = promoInput.value.trim();

    if (!code) {

        promoMessage.textContent = "Please enter a promo code.";
        promoMessage.style.color = "#ff5252";
        return;

    }

    const bookingAmount = basePrice + equipmentPrice;

    try {

        const response = await fetch(

            `${API_URL}?action=applyPromocode&code=${encodeURIComponent(code)}&amount=${bookingAmount}`

        );

        const text = await response.text();

        console.log("SERVER RESPONSE:");
        console.log(text);

        const result = JSON.parse(text);

        if (result.success) {

            appliedPromo = result;

            discount = Number(result.discount);

            promoMessage.textContent = result.message;
            promoMessage.style.color = "#00E676";

            if(summarySaving){

                summarySaving.classList.add("show");
                summarySaving.innerHTML =
                    `🎉 You Saved <strong>₹${discount.toFixed(2)}</strong>`;

            }

        } else {

            discount = 0;

            appliedPromo = null;

            promoMessage.textContent = result.message;
            promoMessage.style.color = "#ff5252";

            if(summarySaving){

                summarySaving.classList.remove("show");

            }

        }

        updateSummary();

    } catch (error) {

        console.error(error);

        promoMessage.textContent = "Unable to connect to server.";
        promoMessage.style.color = "#ff5252";

    }

}

function resetPromo(){

    // Remove applied discount
    discount = 0;

    // Clear input
    promoInput.value = "";

    // Reset message
    promoMessage.textContent =
        "Have a promo code? Apply it here.";

    promoMessage.style.color = "#9ca3af";

    // Hide saving badge
    if(summarySaving){

        summarySaving.classList.remove("show");

    }

    // Enable Apply button again
    applyPromo.disabled = false;
    applyPromo.textContent = "Apply";

    // Update summary
    updateSummary();

}

/*==========================================
TIME SLOTS
==========================================*/

const slotContainer = document.getElementById("slotContainer");
const bookingDate = document.getElementById("bookingDate");
const summarySlot = document.getElementById("summarySlot");

const slotTimings = [

    "06:00","06:30",

    "07:00","07:30",

    "08:00","08:30",

    "09:00","09:30",

    "10:00","10:30",

    "11:00","11:30",

    "12:00","12:30",

    "13:00","13:30",

    "14:00","14:30",

    "15:00","15:30",

    "16:00","16:30",

    "17:00","17:30",

    "18:00","18:30",

    "19:00","19:30",

    "20:00","20:30",

    "21:00","21:30",

    "22:00"

];

renderSlots();

function renderSlots(bookedSlots = []){

    slotContainer.innerHTML = "";

    const selectedDate = bookingDate.value;

    const now = new Date();

    const today = now.toISOString().split("T")[0];

    slotTimings.forEach(time=>{

        const btn = document.createElement("button");

        btn.type = "button";

        btn.textContent = time;

        btn.className = "slot-btn";

        // Convert "16:30" → Date object
        const [hour, minute] = time.split(":").map(Number);

        const slotTime = new Date();

        slotTime.setHours(hour, minute, 0, 0);

        // =====================================
        // GREY → Time Passed
        // =====================================

        if(selectedDate === today && slotTime <= now){

            btn.classList.add("passed");

            btn.disabled = true;

        }

        // =====================================
        // RED → Booked
        // =====================================

        else if(bookedSlots.includes(time)){

            btn.classList.add("booked");

            btn.disabled = true;

        }

        // =====================================
        // GREEN → Available
        // =====================================

        else{

            btn.classList.add("available");

            btn.dataset.slot = time;

            btn.onclick = function(){

                document
                    .querySelectorAll(".slot-btn")
                    .forEach(b => b.classList.remove("selected"));

                btn.classList.add("selected");

                summarySlot.textContent = time;

            };

        }

        slotContainer.appendChild(btn);

    });

}


/*==========================================
DEFAULT DATE
==========================================*/

function getLocalDate() {

    const now = new Date();

    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

}

const today = getLocalDate();

// Prevent previous dates
bookingDate.min = today;

// Auto-select today's date
bookingDate.value = today;

// Show today's date in booking summary
summaryDate.textContent = today;

// Load today's booked slots automatically
loadBookedSlots(today);

/*==========================================
DATE CHANGE
==========================================*/

bookingDate.addEventListener("change", function(){

    if(!this.value) return;

    summaryDate.textContent = this.value;

    summarySlot.textContent = "--";

    document
        .querySelectorAll(".slot-btn")
        .forEach(btn => btn.classList.remove("selected"));

    loadBookedSlots(this.value);

});

async function loadBookedSlots(date){

    try{

        const response = await fetch(
            `${API_URL}?action=getBookedSlots&date=${encodeURIComponent(date)}`
        );

        const result = await response.json();

        if(result.success){

            renderSlots(result.slots || []);

        }else{

            renderSlots([]);

        }

    }catch(error){

        console.error("Slot Loading Error:", error);

        renderSlots([]);

    }

}



const PAYMENT_API =
"https://one00miles-payment-server.onrender.com/api/payment";

function validateBooking(){

    console.trace("validateBooking");

    if(customerName.value.trim().length < 3){

        showError(

            "Name Required",

            "Please enter your full name before proceeding."

        );
        customerName.focus();
        return false;

    }

    if(!/^[6-9]\d{9}$/.test(customerPhone.value.trim())){

        showError(

            "Invalid Phone Number",

            "Please enter a valid 10-digit mobile number."

        );
        customerPhone.focus();
        return false;

    }

    if(!bookingDate.value){

        showError(

            "Select Date",

            "Please choose your preferred booking date."

        );
        bookingDate.focus();
        return false;

    }

    const selectedSlot = document.querySelector(".slot-btn.selected");

    if(!selectedSlot){

        showError(

            "Select Time Slot",

            "Please choose an available time slot to continue."

        );
        return false;

    }

    return true;

}

async function startPayment(){

    try{

        showPaymentLoader();

        const amount = basePrice + equipmentPrice - discount;

        const response = await fetch(

            `${PAYMENT_API}/create-order`,

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    amount:amount

                })

            }

        );

        const result = await response.json();

        if(!result.success){

            throw new Error(result.message);

        }

        hidePaymentLoader();

        openRazorpay(result.order);

    }

    catch(error){

        hidePaymentLoader();

        console.error(error);

        showError(

            "Payment Error",

            error.message || "Unable to connect to the payment server."

        );

        bookingButton.disabled = false;

    }

}

function openRazorpay(order){

    const options={

        key:"rzp_test_TDEx8WJ2hVWGlS",

        amount:order.amount,

        currency:order.currency,

        name:"100Miles Cricket Arena",

        description:"Net Booking",

        prefill:{

            name:customerName.value,

            contact:customerPhone.value

        },

        modal:{

            ondismiss:function(){

                hidePaymentLoader();

                bookingButton.disabled=false;

            }

        },

        image:"https://razorpay.com/assets/razorpay-logo.svg",

        order_id:order.id,

        theme:{

            color:"#00E676"

        },

        handler:function(response){

            console.log(response);

            submitBooking(

                response.razorpay_payment_id,

                response.razorpay_order_id,

                response.razorpay_signature

            );

        }

    };

    const rzp=new Razorpay(options);

    rzp.on("payment.failed", function(response){

        console.log("PAYMENT FAILED");

        console.log(response.error);

        showError(

            "Payment Failed",

            response.error.description

        );

    });

    rzp.open();

}

async function submitBooking(

    paymentId,

    orderId,

    signature

){

    // =====================================
    // PREPAID ONLY PROMO VALIDATION
    // =====================================

    const data = {

        bookingType: "Regular",

        name: customerName.value.trim(),

        phone: customerPhone.value.trim(),

        date: bookingDate.value,

        time: summarySlot.textContent,

        plan: summaryPlan.textContent,

        players: 1,

        amount: basePrice + equipmentPrice - discount,

        promoCode: promoInput.value.trim(),

        loyaltyPoints: 0,

        paymentMethod: "Razorpay",

        paymentStatus: "Paid",

        discount: discount,

        equipment: equipmentCheckbox.checked,

        notes: customerNotes.value.trim(),

        razorpayOrderId: orderId,

        razorpayPaymentId: paymentId,

        razorpaySignature: signature,

        paymentVerified: "Yes"

    };

    try{

        bookingButton.disabled = true;

        bookingButton.textContent="Finalizing Booking...";

        const params = new URLSearchParams({

            action: "saveBooking",

            ...data

        });

        const response = await fetch(

            `${API_URL}?${params.toString()}`

        );

        const result = await response.json();

        if(result.success){

            showPaymentSuccess(

                result,     

                paymentId

            );

        }else{

            alert(result.message);

        }

    }catch(error){

        console.error(error);

        showError(

            "Booking Failed",

            "Something went wrong while saving your booking. Please try again."

        );

    }

    finally{

        bookingButton.disabled = false;

        bookingButton.textContent="Proceed to Payment";

    }

}

bookingButton.addEventListener("click",()=>{

    if(!validateBooking()){

        return;

    }

    startPayment();

});

/*==========================================
PROMO POPUP
==========================================*/

let availablePromos = [];

async function loadPromocodes(){

    try{

        const response = await fetch(
            `${API_URL}?action=getAvailablePromocodes`
        );

        const result = await response.json();

        if(!result.success) return;

        availablePromos = result.promocodes;

        promoCount.textContent =
            `${availablePromos.length} Offers Available`;

    }catch(error){

        console.error(error);

        promoCount.textContent = "No Offers";

    }

}

function renderPromos(){

    promoList.innerHTML = "";

    availablePromos.forEach(promo=>{

        const eligible =
            (basePrice + equipmentPrice) >= promo.minBooking;

        const discountText =
            promo.type === "Fixed"
            ? `₹${promo.value} OFF`
            : `${promo.value}% OFF`;

        promoList.innerHTML += `

        <div class="promo-card">

            <div>

                <h3>${promo.code}</h3>

                <p>${discountText}</p>

                <small>

                    Minimum Booking ₹${promo.minBooking}

                </small>

            </div>

            <button

                ${eligible ? "" : "disabled"}

                onclick="selectPromo('${promo.code}')">

                ${eligible ? "Apply" : "Not Eligible"}

            </button>

        </div>

        `;

    });

}

function selectPromo(code){

    promoInput.value = code;

    promoModal.classList.remove("show");

    applyPromoCode();

}

viewPromos.addEventListener("click",()=>{

    renderPromos();

    promoModal.classList.add("show");

});

closePromo.addEventListener("click",()=>{

    promoModal.classList.remove("show");

});

promoModal.addEventListener("click",(e)=>{

    if(e.target===promoModal){

        promoModal.classList.remove("show");

    }

});

loadPromocodes();

planInputs.forEach(input=>{

    input.addEventListener("change",function(){

        basePrice = Number(this.dataset.price);

        summaryPlan.textContent = this.dataset.plan;

        resetPromo();

        renderPromos();

    });

});


function showError(title,message){

    document.getElementById("errorTitle").textContent=title;

    document.getElementById("errorMessage").textContent=message;

    document.getElementById("errorModal").classList.add("show");

}

document.getElementById("closeError").onclick=function(){

    document.getElementById("errorModal").classList.remove("show");

};

document.getElementById("errorModal").onclick=function(e){

    if(e.target===this){

        this.classList.remove("show");

    }

};

function showPaymentLoader(){

    document
        .getElementById("paymentLoader")
        .classList
        .add("show");

}

function hidePaymentLoader(){

    document
        .getElementById("paymentLoader")
        .classList
        .remove("show");

}

function showPaymentSuccess(result,paymentId){

    document.getElementById("successBookingID").textContent =
    result.bookingID;

    document.getElementById("successAmount").textContent =
    `₹${result.amount}`;

    document.getElementById("successPaymentID").textContent =
    paymentId;

    document
        .getElementById("paymentSuccessModal")
        .classList
        .add("show");

}

document
.getElementById("successDone")
.onclick=function(){

    location.reload();

};
