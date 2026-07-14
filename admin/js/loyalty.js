const API =
"https://script.google.com/macros/s/AKfycbzKYU5RY-sg7KZoF8PAmM04-OzHrY_BOVzxWkFrUcFUk-mOQxBhkCtvvp9Dw9HsVYne/exec";


function showSuccess(message){

Swal.fire({

icon:'success',

title:'Success',

text:message,

confirmButtonColor:'#FFC107',

background:'#171717',

color:'#fff'

});

}

function showError(message){

Swal.fire({

icon:'error',

title:'Error',

text:message,

confirmButtonColor:'#FFC107',

background:'#171717',

color:'#fff'

});

}

function showWarning(message){

Swal.fire({

icon:'warning',

title:'Warning',

text:message,

confirmButtonColor:'#FFC107',

background:'#171717',

color:'#fff'

});

}


function searchCard(){

const card =
document.getElementById("searchCard").value.trim();

fetch(`${API}?action=searchCard&cardNo=${encodeURIComponent(card)}`)

.then(res=>res.json())

.then(data=>{

if(!data.success){

showError(data.message);

return;

}

document.getElementById("cardNo").innerHTML =
data.cardNo;

document.getElementById("name").innerHTML =
data.name;

document.getElementById("phone").innerHTML =
data.phone;

document.getElementById("points").innerHTML =
data.points;

document.getElementById("totalPoints").innerHTML =
data.total;

const statusElement =
document.getElementById("status");

statusElement.innerHTML = data.status;

statusElement.classList.remove(
"active",
"blocked",
"expired"
);

if(data.status=="Active"){

    statusElement.classList.add("active");

}
else if(data.status=="Blocked"){

    statusElement.classList.add("blocked");

}
else if(data.status=="Expired"){

    statusElement.classList.add("expired");

}

document.getElementById("issueDate").innerHTML =
data.issueDate;

document.getElementById("expiryDate").innerHTML =
data.expiryDate;

})

}

function showLoading(){

    Swal.fire({

        title:"Please wait...",

        text:"Processing request",

        allowOutsideClick:false,

        background:"#171717",

        color:"#fff",

        didOpen:()=>{

            Swal.showLoading();

        }

    });

}

function hideLoading(){

    Swal.close();

}

function addPoints(points){

    const card =
    document.getElementById("cardNo").innerHTML;

    if(card=="-"){

        showWarning("Search a loyalty card first.");

        return;

    }

    fetch(`${API}?action=addPoints&cardNo=${encodeURIComponent(card)}&points=${points}`)

    .then(res=>res.json())

    .then(data=>{

        if(data.success){

            document.getElementById("points").innerHTML =
            data.currentPoints;

            showSuccess("Points Added Successfully");

        }else{

            showError(data.message);

        }

        document.getElementById("totalPoints").innerHTML = data.total;

    });

}

function customPoint(){

    const value =
    Number(document.getElementById("customPoints").value);

    if(value<=0){

        showWarning("Enter valid points");

        return;

    }

    addPoints(value);

}

function createCard(){

const card =
document.getElementById("newCardNumber").value.trim();

const name =
document.getElementById("newCustomerName").value.trim();

const phone =
document.getElementById("newPhone").value.trim();

const pattern=/^100M-\d{4}$/;

if(!pattern.test(card)){

showWarning("Card Number should be like 100M-0001");

return;

}

fetch(`${API}?action=createCard&cardNo=${encodeURIComponent(card)}&name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}`)

.then(res=>res.json())

.then(data=>{

if(data.success){

showSuccess("Loyalty Card Created Successfully");

closeNewCard();

document.getElementById("newCardNumber").value="";
document.getElementById("newCustomerName").value="";
document.getElementById("newPhone").value="";

}else{

showError(data.message);

}

});

}

function openEditCard(){

    if(document.getElementById("cardNo").innerHTML=="-"){

        showWarning("Search a card first.");

        return;

    }

    document.getElementById("editModal").style.display="flex";

    document.getElementById("editCardNo").value =
    document.getElementById("cardNo").innerHTML;

    document.getElementById("editName").value =
    document.getElementById("name").innerHTML;

    document.getElementById("editPhone").value =
    document.getElementById("phone").innerHTML;

    document.getElementById("editStatus").value =
    document.getElementById("status").innerHTML;

}

function closeEditCard(){

    document.getElementById("editModal").style.display="none";

}

function saveCard(){

const card =
document.getElementById("editCardNo").value;

const name =
document.getElementById("editName").value.trim();

const phone =
document.getElementById("editPhone").value.trim();

const status =
document.getElementById("editStatus").value;

fetch(`${API}?action=updateCard&cardNo=${encodeURIComponent(card)}&name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&status=${encodeURIComponent(status)}`)

.then(res=>res.json())

.then(data=>{

if(data.success){

showSuccess("Card Updated Successfully");

closeEditCard();

searchCard();

}else{

showError(data.message);

}

})

.catch(err=>{

console.log(err);

showError("Unable to update card.");

});

}function openNewCard(){

    document.getElementById("cardModal").style.display = "flex";

}

function closeNewCard(){

    document.getElementById("cardModal").style.display = "none";

}

function toggleCardStatus(){

const card =
document.getElementById("cardNo").innerHTML;

if(card=="-"){

showWarning("Search a card first.");

return;

}

fetch(`${API}?action=toggleCardStatus&cardNo=${encodeURIComponent(card)}`)

.then(res=>res.json())

.then(data=>{

if(data.success){

    showSuccess(data.message);

    searchCard();

}else{

    showError(data.message);

}

});

}

function viewCouponHistory(){

const card =
document.getElementById("cardNo").innerHTML;

if(card=="-"){

showWarning("Search a card first.");

return;

}

fetch(`${API}?action=getCouponHistory&cardNo=${encodeURIComponent(card)}`)

.then(res=>res.json())

.then(data=>{

const table =
document.getElementById("couponTable");

table.innerHTML="";

if(data.length===0){

table.innerHTML=`
<tr>
<td colspan="4" style="text-align:center;">
No coupons found.
</td>
</tr>
`;

}else{

data.forEach(item=>{

table.innerHTML+=`

<tr>

<td>${item.coupon}</td>

<td>${item.reward}</td>

<td>${item.status}</td>

<td>${item.date}</td>

</tr>

`;

});

}

document.getElementById("couponModal").style.display="flex";

});

}

function closeCouponHistory(){

document.getElementById("couponModal").style.display="none";

}

async function deleteCard(){

    const card =
    document.getElementById("cardNo").innerHTML;

    if(card=="-"){

        showWarning("Search a card first.");

        return;

    }

    const result = await Swal.fire({

        title:"Delete Loyalty Card?",

        text:"This card will be marked as Deleted.",

        icon:"warning",

        showCancelButton:true,

        confirmButtonText:"Delete",

        cancelButtonText:"Cancel",

        confirmButtonColor:"#ef4444",

        cancelButtonColor:"#555",

        background:"#171717",

        color:"#fff"

        });

        if(!result.isConfirmed){

        return;

        }

    fetch(`${API}?action=deleteCard&cardNo=${encodeURIComponent(card)}`)

    .then(res=>res.json())

    .then(data=>{

        if(data.success){

        showSuccess(data.message);

        }else{

        showError(data.message);

        }

        if(data.success){

            document.getElementById("cardNo").innerHTML="-";
            document.getElementById("name").innerHTML="-";
            document.getElementById("phone").innerHTML="-";
            document.getElementById("points").innerHTML="0";
            document.getElementById("totalPoints").innerHTML="0";
            document.getElementById("status").innerHTML="-";

        }

    });

}


async function renewCard(){

    const card = document.getElementById("cardNo").innerHTML;

    if(card=="-"){

        showWarning("Search a card first.");

        return;

    }

    const result = await Swal.fire({

        title:"Renew Loyalty Card?",

        text:"Extend this loyalty card?",

        icon:"question",

        showCancelButton:true,

        confirmButtonText:"Renew",

        confirmButtonColor:"#FFC107",

        background:"#171717",

        color:"#fff"

    });

    if(!result.isConfirmed){

        return;

    }

    showLoading();

    fetch(`${API}?action=renewCard&cardNo=${encodeURIComponent(card)}`)

    .then(res=>res.json())

    .then(data=>{

        hideLoading();

        if(data.success){

            showSuccess(data.message);

            searchCard();

        }else{

            showError(data.message);

        }

    })

    .catch(error=>{

        hideLoading();

        showError("Network Error");

        console.log(error);

    });

}