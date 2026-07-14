const API_URL =
"https://script.google.com/macros/s/AKfycbztFMvnMxcazCy79YYYwz3lIig-6Pq4d9X0Oi5AxVg--P4cXtNLqC9e8gYRIXedxYVW/exec";

let generatedCoupon = "";

const redeemModal =
document.getElementById("redeemModal");

document
.getElementById("closeRedeem")
.onclick = closeRedeemPopup;


redeemModal.onclick = e=>{

    if(e.target===redeemModal){

        closeRedeemPopup();

    }

};

let selectedReward=null;

let requiredPoints=0;

let verifiedCustomer = null;

function chooseReward(code, points){

    selectedReward = code;
    requiredPoints = points;

    document.getElementById("selectedRewardName").textContent =
        code.replace("OFF15","15% OFF")
            .replace("FREE5","FREE 5 Overs")
            .replace("FREE10","FREE 10 Overs")
            .replace("FREE20","FREE 20 Overs");

    document.getElementById("selectedRewardPoints").textContent =
        `${points} Points Required`;

    redeemModal.classList.add("show");

}

function backReward(){

    document
    .getElementById("verifyStep")
    .classList.remove("active");

    document
    .getElementById("rewardStep")
    .classList.add("active");

}

function closeRedeemPopup(){

    redeemModal.classList.remove("show");

    document
    .getElementById("rewardStep")
    .classList.add("active");

    document
    .getElementById("verifyStep")
    .classList.remove("active");

    document.getElementById("redeemCard").value = "";

    document.getElementById("redeemPhone").value = "";

}

document
.getElementById("verifyRedeem")
.addEventListener("click", verifyRedeem);

async function verifyRedeem(){

    const cardNo =
    document.getElementById("redeemCard").value.trim();

    const phone =
    document.getElementById("redeemPhone").value.trim();

    if(!cardNo){

        showError(
            "Please enter your loyalty card number.",
            "Card Number Required"
        );

        return;

    }

    if(!phone){

        showError(
            "Please enter your registered phone number.",
            "Phone Number Required"
        );

        return;

    }

    try{

        console.log(
        `${API_URL}?action=redeemReward` +
        `&cardNo=${encodeURIComponent(document.getElementById("redeemCard").value)}` +
        `&phone=${encodeURIComponent(document.getElementById("redeemPhone").value)}` +
        `&reward=${encodeURIComponent(selectedReward)}` +
        `&points=${requiredPoints}`
        );

        const response = await fetch(

            `${API_URL}?action=verifyRedeemCard&cardNo=${encodeURIComponent(cardNo)}&phone=${encodeURIComponent(phone)}&points=${requiredPoints}`

        );

        const text = await response.text();

        console.log(text);

        const result = JSON.parse(text);

        console.log(result);

        if(result.success){

            verifiedCustomer = result;

            document.getElementById("verifyScreen").style.display = "none";

            document.getElementById("confirmScreen").style.display = "block";

            document.getElementById("confirmName").textContent =
                `Welcome ${result.name}`;

            document.getElementById("confirmPoints").textContent =
                result.points;

            document.getElementById("confirmReward").textContent =
                document.getElementById("selectedRewardName").textContent;

            document.getElementById("remainingPoints").textContent =
                result.points - requiredPoints;

        }else{

            let title = "Verification Failed";

            if(result.message.includes("more points")){

                title = "Not Enough Points";

            }else if(result.message.includes("Phone")){

                title = "Phone Number Mismatch";

            }else if(result.message.includes("expired")){

                title = "Card Expired";

            }else if(result.message.includes("inactive")){

                title = "Inactive Card";

            }else if(result.message.includes("not found")){

                title = "Card Not Found";

            }

            showError(result.message, title);

        }

    }catch(error){

        console.error(error);

        showError(
            error.message,
            "Unexpected Error"
        );

    }

}

document.getElementById("cancelRedeem").onclick = function(){

    document.getElementById("confirmScreen").style.display = "none";

    document.getElementById("verifyScreen").style.display = "block";

};

document
.getElementById("confirmRedeem")
.addEventListener("click", redeemRewardNow);

async function redeemRewardNow(){

    try{

        const response = await fetch(

            `${API_URL}?action=redeemReward` +

            `&cardNo=${encodeURIComponent(document.getElementById("redeemCard").value)}` +

            `&phone=${encodeURIComponent(document.getElementById("redeemPhone").value)}` +

            `&reward=${encodeURIComponent(selectedReward)}` +

            `&points=${requiredPoints}`

        );

        const text = await response.text();

        console.log("SERVER RESPONSE:");
        console.log(text);

        const result = JSON.parse(text);

        if(!result.success){

            // User already has an unused coupon
            if(result.hasUnusedCoupon){

                // Close the redeem popup first
                redeemModal.classList.remove("show");

                // Fill existing coupon details
                document.getElementById("existingCouponCode").textContent =
                    result.coupon;

                document.getElementById("existingCouponReward").textContent =
                    result.reward;

                document.getElementById("existingCouponExpiry").textContent =
                    result.expiry;

                // Show existing coupon popup
                document
                    .getElementById("existingCouponModal")
                    .classList
                    .add("show");

                return;

            }

            let title = "Unable to Redeem";

            if(result.message.includes("unused coupon")){

                title = "Coupon Already Available";

            }else if(result.message.includes("Not enough points")){

                title = "Not Enough Points";

            }else if(result.message.includes("Phone")){

                title = "Phone Number Mismatch";

            }else if(result.message.includes("Card not found")){

                title = "Card Not Found";

            }

            showError(result.message, title);

            return;

        }

        generatedCoupon = result.coupon;

        document.getElementById("confirmScreen").style.display="none";

        document.getElementById("successScreen").style.display="block";

        document.getElementById("couponCode").textContent =
            result.coupon;

        document.getElementById("couponExpiry").textContent =
            result.expiry;

    }catch(error){

        console.error(error);

        showError(
            "Something went wrong while redeeming your reward. Please try again.",
            "Redemption Failed"
        );

    }

}

document
.getElementById("copyCoupon")
.addEventListener("click",function(){

    navigator.clipboard.writeText(generatedCoupon);

    this.innerHTML="✓ Copied";

});

document
.getElementById("doneRedeem")
.addEventListener("click",function(){

    closeRedeemPopup();

});

document
.getElementById("copyExistingCoupon")
.onclick=function(){

    navigator.clipboard.writeText(

        document.getElementById("existingCouponCode").textContent

    );

};

document
.getElementById("closeExistingCoupon")
.onclick=function(){

    // Close coupon popup
    document
    .getElementById("existingCouponModal")
    .classList
    .remove("show");

    // Reopen redeem popup
    redeemModal.classList.add("show");

};

function showError(message,title="Oops!"){

    document.getElementById("errorTitle").textContent=title;

    document.getElementById("errorMessage").textContent=message;

    document.getElementById("errorModal").classList.add("show");

}

document.getElementById("closeError").onclick=function(){

    document.getElementById("errorModal").classList.remove("show");

};