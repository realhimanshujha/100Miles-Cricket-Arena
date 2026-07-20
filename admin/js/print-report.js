const API =
"https://script.google.com/macros/s/AKfycbztFMvnMxcazCy79YYYwz3lIig-6Pq4d9X0Oi5AxVg--P4cXtNLqC9e8gYRIXedxYVW/exec";


let bookings = [];

let currentPage = 1;

const rowsPerPage = 15;

const params = new URLSearchParams(window.location.search);

const filter =
params.get("filter") || "today";

const from =
params.get("from") || "";

const to =
params.get("to") || "";

const reportNames = {

    today:"Today's Report",

    yesterday:"Yesterday's Report",

    week:"Weekly Report",

    month:"Monthly Report",

    custom:"Custom Report"

};

const period =
document.getElementById("reportPeriod");

const today = new Date();


switch(filter){

    case "today":

        period.innerHTML =
        formatDate(today);

        break;

    case "yesterday":

        const yesterday = new Date(today);

        yesterday.setDate(yesterday.getDate()-1);

        period.innerHTML =
        formatDate(yesterday);

        break;

    case "week":

        const weekStart = new Date(today);

        const day = weekStart.getDay();

        const diff = (day===0?6:day-1);

        weekStart.setDate(weekStart.getDate()-diff);

        const weekEnd = new Date(weekStart);

        weekEnd.setDate(weekEnd.getDate()+6);

        period.innerHTML =

        formatDate(weekStart)

        +

        " &nbsp;—&nbsp; "

        +

        formatDate(weekEnd);

        break;

    case "month":

        const monthStart =
        new Date(today.getFullYear(),today.getMonth(),1);

        const monthEnd =
        new Date(today.getFullYear(),today.getMonth()+1,0);

        period.innerHTML =

        formatDate(monthStart)

        +

        " &nbsp;—&nbsp; "

        +

        formatDate(monthEnd);

        break;

    case "custom":

        period.innerHTML =

        formatDate(new Date(from))

        +

        " &nbsp;—&nbsp; "

        +

        formatDate(new Date(to));

        break;

}

document.getElementById("generatedDate").innerText =

new Date().toLocaleString("en-IN",{

    day:"2-digit",

    month:"short",

    year:"numeric",

    hour:"2-digit",

    minute:"2-digit",

    hour12:true

});

fetch(

`${API}?action=getReport`

+`&filter=${filter}`

+`&from=${from}`

+`&to=${to}`

)

.then(r=>r.json())

.then(data=>{

    if(!data.success) return;

    document.getElementById("pdfRevenue").innerText =
    "₹"+Number(data.revenue).toFixed(2);

    document.getElementById("pdfRefunds").innerText =
    "₹" + Number(data.refunds).toFixed(2);

    document.getElementById("pdfBookings").innerText =
    data.bookings;

    document.getElementById("pdfCompleted").innerText =
    data.completed;

    document.getElementById("pdfCancelled").innerText =
    data.cancelled;

    document.getElementById("pdfRegular").innerText =
    data.regular;

    document.getElementById("pdfMembership").innerText =
    data.membership;

    bookings = data.rows;

    renderTable();

    // ===========================
    // Revenue Chart
    // ===========================

    const chartLabels = Object.keys(data.chart).map(date=>{

        const d = new Date(date);

        return d.toLocaleDateString("en-IN",{

            day:"2-digit",

            month:"short"

        });

    });

    const chartValues =
    Object.values(data.chart);

    new Chart(

    document.getElementById("pdfChart"),

    {

        type:"line",

        data:{

            labels:chartLabels,

            datasets:[{

                label:"Revenue",

                data:chartValues,

                borderColor:"#f4b400",

                backgroundColor:"rgba(244,180,0,.15)",

                borderWidth:3,

                fill:true,

                tension:.4,

                pointRadius:4,

                pointBackgroundColor:"#f4b400"

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    display:false

                }

            },

            scales:{

                y:{

                    beginAtZero:true,

                    ticks:{

                        callback:value=>"₹"+value

                    }

                }

            }

        }

    });

});

document
.getElementById("printBtn")
.addEventListener("click",()=>{

    window.print();

});

function formatDate(date){

    if(typeof date==="string"){

        date=new Date(date);

    }

    return date.toLocaleDateString("en-IN",{

        day:"2-digit",

        month:"short",

        year:"numeric"

    });

}

function renderTable(){

    const tbody =
    document.getElementById("bookingTable");

    tbody.innerHTML = "";

    const start =
    (currentPage-1)*rowsPerPage;

    const end =
    start+rowsPerPage;

    bookings
    .slice(start,end)
    .forEach(row=>{

        tbody.innerHTML += `

        <tr>

            <td>${row[0]}</td>

            <td>${row[2]}</td>

            <td>${row[3]}</td>

            <td>${row[4]}</td>

            <td>${row[5]}</td>

            <td>${row[6]}</td>

            <td>₹${row[8]}</td>

            <td>

                <span class="status ${row[11]}">

                    ${row[11]}

                </span>

            </td>

        </tr>

        `;

    });

    const totalPages =
    Math.ceil(bookings.length/rowsPerPage);

    const showingFrom = start + 1;

    const showingTo =
    Math.min(end, bookings.length);

    document.getElementById("pageInfo").innerHTML =

    `
    Showing <b>${showingFrom}</b> - <b>${showingTo}</b>
    of <b>${bookings.length}</b> Bookings
    <br>
    Page <b>${currentPage}</b> of <b>${totalPages}</b>
    `;

    document.getElementById("prevPage").disabled =
    currentPage===1;

    document.getElementById("nextPage").disabled =
    currentPage===totalPages;

}

document
.getElementById("nextPage")
.onclick = ()=>{

    const totalPages =
    Math.ceil(bookings.length / rowsPerPage);

    if(currentPage < totalPages){

        currentPage++;

        renderTable();

    }

};

document
.getElementById("prevPage")
.onclick = ()=>{

    if(currentPage > 1){

        currentPage--;

        renderTable();

    }

};