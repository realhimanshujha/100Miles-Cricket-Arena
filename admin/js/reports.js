const API =
"https://script.google.com/macros/s/AKfycbzKYU5RY-sg7KZoF8PAmM04-OzHrY_BOVzxWkFrUcFUk-mOQxBhkCtvvp9Dw9HsVYne/exec";


let revenueChart;

// Load Sidebar
fetch("../components/sidebar.html")
.then(r => r.text())
.then(html => {

    document.getElementById("sidebar-container").innerHTML = html;

    const script = document.createElement("script");
    script.src = "js/sidebar.js";
    document.body.appendChild(script);

});

// Placeholder chart
const ctx = document.getElementById("revenueChart");

revenueChart = new Chart(ctx,{

    type:"line",

    data:{

        labels:[],

        datasets:[{

            label:"Revenue",

            data:[],

            borderColor:"#FFC107",

            backgroundColor:"rgba(255,193,7,0.15)",

            borderWidth:3,

            fill:true,

            tension:0.4,

            pointRadius:5,

            pointHoverRadius:7,

            pointBackgroundColor:"#FFC107",

            pointBorderColor:"#fff",

            pointBorderWidth:2

        }]

    },

    options:{

        responsive:true,

        maintainAspectRatio:false,

        animation:true,

        plugins:{

            legend:{

                labels:{
                    color:"#ffffff"
                }

            }

        },

        scales:{

            x:{

                ticks:{
                    color:"#bfbfbf"
                },

                grid:{
                    color:"rgba(255,255,255,0.05)"
                }

            },

            y:{

                beginAtZero:true,

                ticks:{
                    color:"#bfbfbf",

                    callback:function(value){

                        return "₹"+value;

                    }

                },

                grid:{
                    color:"rgba(255,255,255,0.05)"
                }

            }

        }

    }

});

function loadReport(
    filter="today",
    from="",
    to=""
){

    fetch(
        `${API}?action=getReport`
        + `&filter=${filter}`
        + `&from=${from}`
        + `&to=${to}`
    )

    .then(r => r.json())

    .then(data => {

        if(!data.success) return;

        document.getElementById("reportRevenue").innerText =
            "₹" + Number(data.revenue).toFixed(2);

        document.getElementById("reportRefunds").innerText =
            "₹" + Number(data.refunds).toFixed(2);

        document.getElementById("reportBookings").innerText =
            data.bookings;

        document.getElementById("reportCompleted").innerText =
            data.completed;

        document.getElementById("reportCancelled").innerText =
            data.cancelled;

        document.getElementById("reportRegular").innerText =
            data.regular;

        document.getElementById("reportMembership").innerText =
            data.membership;

        // ==========================
        // Update Revenue Chart
        // ==========================

        const labels = Object.keys(data.chart).map(date => {

            const d = new Date(date);

            return d.toLocaleDateString("en-IN",{

                day:"2-digit",

                month:"short"

            });

        });
        const values = Object.values(data.chart);

        revenueChart.data.labels = labels;
        revenueChart.data.datasets[0].data = values;

        revenueChart.update();

    });

}

loadReport();

document
.getElementById("generateReportBtn")
.addEventListener("click", () => {

    const filter =
        document.getElementById("reportFilter").value;

    const from =
    document.getElementById("fromDate").value;

    const to =
    document.getElementById("toDate").value;

    loadReport(filter,from,to);

});

const reportFilter = document.getElementById("reportFilter");
const customDateRange = document.getElementById("customDateRange");

if(reportFilter && customDateRange){

    reportFilter.addEventListener("change", function(){

        customDateRange.style.display =
            this.value === "custom"
                ? "flex"
                : "none";

    });

}

// ==========================
// Date Limits
// ==========================

const fromDateInput = document.getElementById("fromDate");
const toDateInput = document.getElementById("toDate");

const today = new Date();

// Maximum = Today
const maxDate = today.toISOString().split("T")[0];

// Minimum = 2 Months Ago
const minDate = new Date(today);
minDate.setMonth(minDate.getMonth() - 2);

const minDateString = minDate.toISOString().split("T")[0];

fromDateInput.min = minDateString;
fromDateInput.max = maxDate;

toDateInput.min = minDateString;
toDateInput.max = maxDate;

fromDateInput.addEventListener("change", () => {

    // To Date cannot be before From Date
    toDateInput.min = fromDateInput.value;

    // If current To Date is earlier, update it
    if(toDateInput.value < fromDateInput.value){

        toDateInput.value = fromDateInput.value;

    }

});

document
.getElementById("exportExcelBtn")
.addEventListener("click",()=>{

    const filter =
        document.getElementById("reportFilter").value;

    const from =
        document.getElementById("fromDate").value;

    const to =
        document.getElementById("toDate").value;

    window.open(

        `${API}?action=exportReport`

        +`&filter=${filter}`

        +`&from=${from}`

        +`&to=${to}`

    );

});


document
.getElementById("printPdfBtn")
.addEventListener("click",()=>{

    document.getElementById("reportDate").innerHTML =

        "Generated on : " +

        new Date().toLocaleString("en-IN");

    const filter =
    document.getElementById("reportFilter").value;

    const from =
    document.getElementById("fromDate").value;

    const to =
    document.getElementById("toDate").value;

    window.open(

    `print-report.html`

    +`?filter=${filter}`

    +`&from=${from}`

    +`&to=${to}`,

    "_blank"

    );

});