function getFilteredBookings(filter, from, to){

  const sheet = getSheet("Bookings");
  const rows = sheet.getDataRange().getDisplayValues();

  const today = new Date();
  today.setHours(0,0,0,0);

  const filtered = [];

  for(let i=1;i<rows.length;i++){

    if(!rows[i][4]) continue;

    const bookingDate = new Date(rows[i][4]);
    bookingDate.setHours(0,0,0,0);

    let include = false;

    switch(filter){

      case "today":

        include =
          bookingDate.getTime() === today.getTime();

        break;

      case "yesterday":

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate()-1);

        include =
          bookingDate.getTime() === yesterday.getTime();

        break;

      case "week":

        const weekStart = new Date(today);

        const day = weekStart.getDay();

        const diff = (day===0?6:day-1);

        weekStart.setDate(weekStart.getDate()-diff);

        weekStart.setHours(0,0,0,0);

        const weekEnd = new Date(weekStart);

        weekEnd.setDate(weekStart.getDate()+6);

        weekEnd.setHours(23,59,59,999);

        include =
          bookingDate>=weekStart &&
          bookingDate<=weekEnd;

        break;

      case "month":

        include =
          bookingDate.getMonth()===today.getMonth() &&
          bookingDate.getFullYear()===today.getFullYear();

        break;

      case "custom":

        const booking =
          Utilities.formatDate(
            bookingDate,
            Session.getScriptTimeZone(),
            "yyyy-MM-dd"
          );

        include =
          booking>=from &&
          booking<=to;

        break;

      default:

        include = true;

    }

    if(include){

      filtered.push(rows[i]);

    }

  }

  return filtered;

}

function getReport(filter,from,to){

  let refunds = 0;

  const rows =
    getFilteredBookings(filter,from,to);

  let revenue = 0;
  let bookings = 0;
  let completed = 0;
  let cancelled = 0;
  let regular = 0;
  let membership = 0;

  const revenueChart = {};

  for(let i=0;i<rows.length;i++){

    bookings++;

    const bookingType = rows[i][1];
    const status = String(rows[i][12]).trim();
    const paymentStatus = String(rows[i][14]).trim();

    if(status=="Completed")
      completed++;

    if(status=="Cancelled")
      cancelled++;

    if(bookingType=="Regular")
      regular++;

    if(bookingType=="Membership")
      membership++;

    const amount = Number(rows[i][9]) || 0;

    if(bookingType === "Regular" &&
       paymentStatus === "Paid"
    ){

        revenue += amount;

        const bookingDay = rows[i][4];

        if(!revenueChart[bookingDay]){
            revenueChart[bookingDay] = 0;
        }

        revenueChart[bookingDay] += amount;

    }

    if(status === "Cancelled"){

        refunds += amount;

    }

  }

  return{

      success:true,

      revenue,

      refunds,

      bookings,

      completed,

      cancelled,

      regular,

      membership,

      chart:revenueChart,

      rows:rows

  };

}

function exportReportCSV(filter,from,to){

  const rows =
    getFilteredBookings(filter,from,to);

  let csv="";

  csv +=
"Booking ID,Booking Type,Customer,Phone,Date,Time,Plan,Players,Amount,Status,Payment Method,Payment Status\n";

  rows.forEach(r=>{

    csv += [

      r[0],
      r[1],
      r[2],
      r[3],
      r[4],
      r[5],
      r[6],
      r[7],
      r[8],
      r[11],
      r[12],
      r[13]

    ].join(",");

    csv+="\n";

  });

  return ContentService
      .createTextOutput(csv)
      .setMimeType(
          ContentService.MimeType.CSV
      );

}