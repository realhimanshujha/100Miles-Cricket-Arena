  function getPlanDuration(plan) {

  switch (plan) {

    case "3 Overs":
    case "5 Overs":
      return 10;

    case "10 Overs":
      return 20;

    case "20 Overs":
      return 30;

    default:
      return 10;
  }

}

function timeToMinutes(time) {

  const parts = time.split(":");

  return Number(parts[0]) * 60 + Number(parts[1]);

}
  
  /**
   * Save Booking
   */

  function saveBooking(data) {

    const settings = getSettings();

    if(settings.ArenaStatus !== "OPEN"){

      return {

        success:false,

        message:
          settings.ArenaStatusMessage ||
          "Bookings are currently unavailable."

      };

    }

    try {

      const sheet = getSheet("Bookings");

      // ============================
      // Validation
      // ============================

      if (
        !data.name ||
        !data.phone ||
        !data.date ||
        !data.time ||
        !data.plan
      ) {

        return {
          success: false,
          message: "Please fill all required fields."
        };

      }

      // ============================
      // Format Date
      // ============================

      const dateParts = data.date.split("-");

      const formattedDate =
      `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

      // ============================
      // Prevent Overlapping Booking
      // ============================

      const rows = sheet.getDataRange().getDisplayValues();

      const newStart = timeToMinutes(data.time);
      const newEnd = newStart + getPlanDuration(data.plan);

      for (let i = 1; i < rows.length; i++) {

          const bookingDate = String(rows[i][4]).trim();
          const bookingTime = String(rows[i][5]).trim();
          const existingPlan = String(rows[i][6]).trim();
          const status = String(rows[i][12]).trim();

          if (
              bookingDate !== formattedDate ||
              status === "Cancelled"
          ){
              continue;
          }

          const existingStart = timeToMinutes(bookingTime);
          const existingEnd =
              existingStart + getPlanDuration(existingPlan);

          if (
              newStart < existingEnd &&
              newEnd > existingStart
          ){

              return {

                  success:false,

                  message:"Selected slot overlaps with an existing booking."

              };

          }

      }

      // ============================
      // Booking ID
      // ============================

      const bookingID = generateBookingID();

      // ============================
      // Loyalty Points
      // ============================

      const loyaltyMap = {

        "3 Overs": 1,
        "5 Overs": 2,
        "10 Overs": 4,
        "20 Overs": 8

      };

      const loyaltyPoints = loyaltyMap[data.plan] || 0;

      if(data.bookingType === "Membership"){

          const check = validateMembershipBooking(
          data.phone,
          data.plan,
          data.date
      );

          if(!check.success){
              return check;
          }

      }

      let duration = 10;

      switch(data.plan){

          case "10 Overs":
              duration = 20;
              break;

          case "20 Overs":
              duration = 30;
              break;

      }


      // ============================
      // Save Booking
      // ============================

      sheet.appendRow([

          bookingID,                 // A

          data.bookingType,          // B

          data.name,                 // C

          data.phone,                // D

          data.date,                 // E

          data.time,                 // F

          data.plan,                 // G

          duration,             // H

          data.players,              // I

          data.amount,               // J

          data.promoCode,            // K

          data.loyaltyPoints,        // L

          data.paymentStatus === "Paid"
          ? "Confirmed"
          : "Pending",                 // M Booking Status

          data.paymentMethod,        // N

          data.paymentStatus,        // O

          new Date(),                // P

          data.discount || 0,        // Q

          String(data.equipment) === "true" ? "Yes" : "No", // R

          data.utr || "",            // S

          data.notes || "",           // T

          data.razorpayOrderId || "",                  // U

          data.razorpayPaymentId || "",                // V
          
          data.razorpaySignature || "",                // W

          data.paymentVerified || "No",                 // X

          data.email || ""    // Y

      ]);

      // ============================
      // Send Booking Confirmation Email
      // ============================

      if (
          data.bookingType === "Regular" &&
          data.paymentStatus === "Paid" &&
          data.email
      ) {

          const html = `
          <!DOCTYPE html>
          <html>
          <head>
          <meta charset="UTF-8">
          </head>

          <body style="
          margin:0;
          padding:30px;
          background:#f4f6f9;
          font-family:Arial,sans-serif;
          ">

          <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
          <td align="center">

          <table
          width="650"
          cellpadding="0"
          cellspacing="0"
          style="
          background:#ffffff;
          border-radius:16px;
          overflow:hidden;
          box-shadow:0 10px 30px rgba(0,0,0,.08);
          ">

          <!-- Header -->
          <tr>
          <td
          align="center"
          style="
          background:#00E676;
          padding:35px;
          ">

          <img
          src="https://raw.githubusercontent.com/realhimanshujha/100Miles-Cricket-Arena/main/assets/images/logo.jpeg"
          width="90"
          style="display:block;margin-bottom:15px;">

          <h1 style="
          margin:0;
          color:#000;
          font-size:32px;
          ">
          100Miles Cricket Arena
          </h1>

          <p style="
          margin:8px 0 0;
          font-size:18px;
          font-weight:bold;
          color:#000;
          ">
          🏏 Booking Confirmed
          </p>

          </td>
          </tr>

          <!-- Body -->
          <tr>
          <td style="padding:40px;">

          <p style="
          font-size:18px;
          margin-top:0;
          ">
          Hello <b>${data.name}</b>,
          </p>

          <p style="
          font-size:16px;
          line-height:28px;
          color:#555;
          margin-bottom:25px;
          ">
          Your booking has been confirmed successfully.
          Below are your booking details.
          </p>

          <table
          width="100%"
          cellpadding="14"
          cellspacing="0"
          style="
          border:1px solid #e5e5e5;
          border-collapse:collapse;
          ">

          <tr>
          <td style="border-bottom:1px solid #eee;"><b>Booking ID</b></td>
          <td style="border-bottom:1px solid #eee;">
          ${bookingID}
          </td>
          </tr>

          <tr>
          <td style="border-bottom:1px solid #eee;"><b>Date</b></td>
          <td style="border-bottom:1px solid #eee;">
          ${formattedDate}
          </td>
          </tr>

          <tr>
          <td style="border-bottom:1px solid #eee;"><b>Time Slot</b></td>
          <td style="border-bottom:1px solid #eee;">
          ${data.time}
          </td>
          </tr>

          <tr>
          <td style="border-bottom:1px solid #eee;"><b>Plan</b></td>
          <td style="border-bottom:1px solid #eee;">
          ${data.plan}
          </td>
          </tr>

          <tr>
          <td style="border-bottom:1px solid #eee;"><b>Players</b></td>
          <td style="border-bottom:1px solid #eee;">
          ${data.players}
          </td>
          </tr>

          <tr>
          <td><b>Amount Paid</b></td>
          <td style="
          color:#00C853;
          font-weight:bold;
          font-size:20px;
          ">
          ₹${data.amount}
          </td>
          </tr>

          </table>

          <!-- ===========================
          Payment Summary
          =========================== -->

          <h2 style="
          margin-top:35px;
          margin-bottom:15px;
          font-size:22px;
          color:#222;
          ">
          💳 Payment Summary
          </h2>

          <table
          width="100%"
          cellpadding="12"
          cellspacing="0"
          style="
          border-collapse:collapse;
          background:#f8f9fa;
          border:1px solid #e5e5e5;
          ">

          <tr>
          <td style="border-bottom:1px solid #e5e5e5;">
          Booking Amount
          </td>
          <td
          align="right"
          style="border-bottom:1px solid #e5e5e5;">
          ₹${data.originalAmount || data.amount}
          </td>
          </tr>

          <tr>
          <td style="border-bottom:1px solid #e5e5e5;">
          Discount
          </td>
          <td
          align="right"
          style="
          border-bottom:1px solid #e5e5e5;
          color:#00C853;
          ">
          - ₹${data.discount || 0}
          </td>
          </tr>

          <tr>
          <td style="border-bottom:1px solid #e5e5e5;">
          Equipment
          </td>
          <td
          align="right"
          style="border-bottom:1px solid #e5e5e5;">
          ${String(data.equipment) === "true"
          ? "🥎 Safety Kit Included"
          : "—"}
          </td>
          </tr>

          <tr>
          <td style="border-bottom:1px solid #e5e5e5;">
          Payment Method
          </td>
          <td
          align="right"
          style="border-bottom:1px solid #e5e5e5;">
          ${data.paymentMethod || "Online"}
          </td>
          </tr>

          <tr>
          <td>
          <b>Total Paid</b>
          </td>

          <td
          align="right"
          style="
          font-size:20px;
          font-weight:bold;
          color:#00C853;
          ">
          ₹${data.amount}
          </td>

          </tr>

          </table>

          ${data.promoCode ? `

          <div style="
          margin-top:25px;
          padding:15px;
          background:#FFF8E1;
          border-left:4px solid #FFC107;
          border-radius:8px;
          ">

          <div style="
          font-size:16px;
          font-weight:bold;
          margin-bottom:5px;
          ">
          🎟 Promo Code Applied
          </div>

          <div style="
          font-size:15px;
          color:#444;
          ">
          ${data.promoCode}
          </div>

          </div>

          ` : ""}

          ${data.paymentMethod === "Razorpay" ? `

          <div style="
          margin-top:20px;
          padding:15px;
          background:#F3F7FF;
          border-left:4px solid #1976D2;
          border-radius:8px;
          ">

          <div style="
          font-size:16px;
          font-weight:bold;
          margin-bottom:5px;
          ">
          💳 Transaction Details
          </div>

          <div style="
          font-size:15px;
          color:#444;
          ">
          Payment ID<br>
          <b>${data.razorpayPaymentId}</b>
          </div>

          </div>

          ` : ""}

          <!-- ===========================
          Footer
          =========================== -->

          <hr style="
          margin:35px 0 25px;
          border:none;
          border-top:1px solid #e5e5e5;
          ">

          <p style="
          font-size:16px;
          margin:0;
          color:#444;
          ">
          📍 <b>100Miles Cricket Arena</b><br>
          Guwahati, Assam
          </p>

          <p style="
          margin-top:15px;
          font-size:15px;
          color:#555;
          line-height:26px;
          ">
          ⏰ Please arrive at least
          <b>10 minutes before your scheduled slot</b>
          to ensure a smooth check-in and maximum practice time.
          </p>

          <!-- Buttons -->

          <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="margin-top:30px;">

          <tr>

          <td align="center">

          <a href="https://maps.google.com/?q=100Miles+Cricket+Arena+Guwahati"
          style="
          display:inline-block;
          padding:12px 22px;
          background:#00C853;
          color:#ffffff;
          text-decoration:none;
          border-radius:6px;
          font-weight:bold;
          margin:5px;
          ">
          📍 Get Directions
          </a>

          <a href="https://wa.me/917002869146"
          style="
          display:inline-block;
          padding:12px 22px;
          background:#25D366;
          color:#ffffff;
          text-decoration:none;
          border-radius:6px;
          font-weight:bold;
          margin:5px;
          ">
          💬 WhatsApp
          </a>

          </td>

          </tr>

          <tr>

          <td
          align="center"
          style="padding-top:15px;">

          <a href="tel:+917002869146"
          style="
          display:inline-block;
          padding:12px 22px;
          background:#1976D2;
          color:#ffffff;
          text-decoration:none;
          border-radius:6px;
          font-weight:bold;
          margin:5px;
          ">
          📞 Call Arena
          </a>

          <a href="https://realhimanshujha.github.io/100Miles-Cricket-Arena"
          style="
          display:inline-block;
          padding:12px 22px;
          background:#424242;
          color:#ffffff;
          text-decoration:none;
          border-radius:6px;
          font-weight:bold;
          margin:5px;
          ">
          🌐 Visit Website
          </a>

          </td>

          </tr>

          </table>

          <div style="
          margin-top:35px;
          padding:20px;
          background:#f8f9fa;
          border-radius:10px;
          ">

          <p style="
          margin:0;
          font-size:15px;
          color:#555;
          line-height:28px;
          ">

          Need help with your booking?<br>

          📧 support@100milescricketarena.com<br>

          📞 +91 98765 43210

          </p>

          </div>

          <p style="
          margin-top:30px;
          font-size:15px;
          color:#888;
          line-height:26px;
          ">

          Thank you for choosing
          <b>100Miles Cricket Arena.</b>

          We look forward to helping you improve your game.

          🏏 <b>Train Hard. Play Better.</b>

          </p>

          </td>

          </tr>

          </table>

          </td>

          </tr>

          </table>

          </body>

          </html>
          `;

          MailApp.sendEmail({

              to: data.email,

              subject: "🏏 Booking Confirmed | 100Miles Cricket Arena",

              htmlBody: html

          });

      }

      if(data.promoCode){

      const rewardSheet = getSheet("RedeemedCoupons");

      const rewardRows = rewardSheet.getDataRange().getValues();

      let isRewardCoupon = false;

      for(let i=1;i<rewardRows.length;i++){

          if(
              String(rewardRows[i][0]).trim().toUpperCase() ===
              String(data.promoCode).trim().toUpperCase()
          ){

              rewardSheet.getRange(i+1,6).setValue("Used");
              rewardSheet.getRange(i+1,9).setValue(new Date());

              isRewardCoupon = true;

              break;

          }

      }

      // Increase usage only for normal promo codes
      if(!isRewardCoupon){

          increasePromoUsage(data.promoCode);

      }

  }

      return {

        success:true,

        bookingID:bookingID,

        amount:data.amount,

        points:loyaltyPoints,

        status:"Paid",
        
        message: "Booking created successfully."

      };

    }

    catch (err) {

      return {

        success: false,
        message: err.toString()

      };

    }

  }

function getBookings() {

  const sheet = getSheet("Bookings");
  const rows = sheet.getDataRange().getDisplayValues();

  const bookings = [];

  for (let i = 1; i < rows.length; i++) {

    bookings.push({

      bookingID: rows[i][0],
      bookingType: rows[i][1],
      name: rows[i][2],
      phone: rows[i][3],
      date: rows[i][4],
      time: rows[i][5],
      plan: rows[i][6],

      duration: rows[i][7],

      players: rows[i][8],

      amount: rows[i][9],

      promoCode: rows[i][10],

      loyaltyPoints: rows[i][11],

      status: rows[i][12],

      paymentMethod: rows[i][13],

      paymentStatus: rows[i][14],

      createdAt: rows[i][15],

      discount: rows[i][16],

      equipment: rows[i][17],

      utr: rows[i][18],

      notes: rows[i][19],

      razorpayOrderId: rows[i][20],

      razorpayPaymentId: rows[i][21],

      razorpaySignature: rows[i][22],

      paymentVerified: rows[i][23]

    });

  }

  return {
    success: true,
    bookings
  };

}


function getBookedSlots(date) {

  const sheet = getSheet("Bookings");
  const rows = sheet.getDataRange().getValues();

  const slots = [];

  const requestDate = Utilities.formatDate(
    new Date(date),
    Session.getScriptTimeZone(),
    "yyyy-MM-dd"
  );

  for (let i = 1; i < rows.length; i++) {

    const bookingDate = Utilities.formatDate(
      new Date(rows[i][4]),
      Session.getScriptTimeZone(),
      "yyyy-MM-dd"
    );

    const bookingTime = Utilities.formatDate(
      new Date(rows[i][5]),
      Session.getScriptTimeZone(),
      "HH:mm"
    );

    const status = String(rows[i][12]).trim();

    if (
      bookingDate === requestDate &&
      status !== "Cancelled"
    ) {

      slots.push({
        time: bookingTime,
        duration: Number(rows[i][7]) || 10
      });

    }

  }

  return {
    success: true,
    slots: slots
  };

}

function updateBookingStatus(bookingID, status, paymentMethod){

  const sheet = getSheet("Bookings");
  const rows = sheet.getDataRange().getDisplayValues();

  for(let i = 1; i < rows.length; i++){

    if(String(rows[i][0]).trim() === bookingID){

      if (rows[i][12] === "Completed") {
        return {
          success: false,
          message:
            "Matched Booking ID: " + rows[i][0] +
            " | Sheet Status: " + rows[i][12] +
            " | Row: " + (i + 1)
        };
      }

      // Column M = Status
      sheet.getRange(i + 1, 13).setValue(status);

      Logger.log("Booking: " + bookingID);
      Logger.log("Incoming Status: " + status);

      // =========================
      // CANCELLED
      // =========================
      if(status === "Cancelled"){

        const paymentStatus = rows[i][14];

        if(paymentStatus === "Paid"){

          // Column O = Refunded
          sheet.getRange(i + 1, 15).setValue("Refunded");

        }else{

          // Column N = Payment Method
          sheet.getRange(i + 1, 14).setValue("-");

          // Column O = Void
          sheet.getRange(i + 1, 15).setValue("Void");

        }

      }

      // =========================
      // CONFIRMED
      // =========================
      if(status === "Confirmed"){

        if(paymentMethod){

          // Column N = Payment Method
          sheet.getRange(i + 1, 14).setValue(paymentMethod);

          // Column O = Payment Status
          sheet.getRange(i + 1, 15).setValue("Paid");

        }

        const bookingType = rows[i][1];
        const phone = rows[i][3];
        const plan = rows[i][6];
        const bookingDate = rows[i][4];

        // Deduct membership overs only after payment
        if(bookingType === "Membership"){
          updateMembershipOvers(phone, plan, bookingDate);
        }

      }

      // =========================
      // COMPLETED
      // =========================
      if(status === "Completed"){

          const bookingType = rows[i][1];
          const phone = rows[i][3];
          const plan = rows[i][6];
          const bookingDate = rows[i][4];

          // Membership → Deduct Overs Only
          if(bookingType === "Membership"){

              updateMembershipOvers(
                  phone,
                  plan,
                  bookingDate
              );

          }

          // Regular Booking → Add Loyalty Points Only
          if(bookingType === "Regular"){

              const loyalty = addLoyaltyPointsByPhone(phone, plan);

              if(loyalty.success){

                  // Column L = Loyalty Points Earned
                  sheet.getRange(i+1,12).setValue(loyalty.points);

              }

          }

      }

      return {
        success: true
      };

    }

  }

  return {
    success: false,
    message: "Booking already completed."
  };

}


function updateMembershipOvers(phone, plan, bookingDate){

  const selectedDate = bookingDate;

    const sheet = getSheet("Memberships");
    const rows = sheet.getDataRange().getValues();

    const oversMap = {

        "5 Overs":5,
        "10 Overs":10,
        "20 Overs":20

    };

    const bookedOvers = oversMap[plan] || 0;

    const today = Utilities.formatDate(
        new Date(),
        Session.getScriptTimeZone(),
        "yyyy-MM-dd"
    );

    for(let i=1;i<rows.length;i++){

        if(String(rows[i][2]).trim() !== String(phone).trim()){
            continue;
        }

        let usedOvers = Number(rows[i][10]) || 0;
        let remainingOvers = Number(rows[i][11]) || 0;
        let todayUsedOvers = Number(rows[i][12]) || 0;
        let lastBookingDate = String(rows[i][13]);

        // New day → reset today's usage
        if(lastBookingDate !== selectedDate){

            todayUsedOvers = 0;

        }

        usedOvers += bookedOvers;
        remainingOvers -= bookedOvers;
        todayUsedOvers += bookedOvers;

        sheet.getRange(i+1,11).setValue(usedOvers);
        sheet.getRange(i+1,12).setValue(remainingOvers);
        sheet.getRange(i+1,13).setValue(todayUsedOvers);
        sheet.getRange(i+1,14).setValue(selectedDate);

        break;

    }

}

function updateBooking(data){

  const sheet = getSheet("Bookings");
  const rows = sheet.getDataRange().getValues();

  const dateParts = data.date.split("-");

  const formattedDate =
      `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

  // ==========================
  // Prevent Overlapping Booking
  // ==========================

  const newStart = timeToMinutes(data.time);
  const newEnd = newStart + getPlanDuration(data.plan);

  for(let i=1;i<rows.length;i++){

      const bookingID = String(rows[i][0]).trim();
      const bookingDate = String(rows[i][4]).trim();
      const bookingTime = String(rows[i][5]).trim();
      const existingPlan = String(rows[i][6]).trim();
      const status = String(rows[i][12]).trim();

      // Ignore the booking being edited
      if(bookingID == data.bookingID){
          continue;
      }

      if(
          bookingDate !== formattedDate ||
          status === "Cancelled"
      ){
          continue;
      }

      const existingStart = timeToMinutes(bookingTime);
      const existingEnd =
          existingStart + getPlanDuration(existingPlan);

      if(
          newStart < existingEnd &&
          newEnd > existingStart
      ){

          return{

              success:false,

              message:"Selected slot overlaps with an existing booking."

          };

      }

  }

  // ==========================
  // Update Booking
  // ==========================

  for(let i=1;i<rows.length;i++){

    if(String(rows[i][0]).trim() == data.bookingID){

      sheet.getRange(i+1,3).setValue(data.name);
      sheet.getRange(i+1,4).setValue(data.phone);
      sheet.getRange(i+1,5).setValue(formattedDate);
      sheet.getRange(i+1,6).setValue(data.time);
      sheet.getRange(i+1,7).setValue(data.plan);
      sheet.getRange(i+1,8).setValue(getPlanDuration(data.plan));
      sheet.getRange(i+1,9).setValue(data.players);
      sheet.getRange(i+1,10).setValue(data.amount);
      sheet.getRange(i+1,14).setValue(data.paymentMethod);
      sheet.getRange(i+1,15).setValue(data.paymentStatus);

      return{

        success:true,

        message:"Booking Updated Successfully"

      };

    }

  }

  return{

    success:false,

    message:"Booking Not Found"

  };

}

function getBookingStats(date){

  const sheet = getSheet("Bookings");
  const rows = sheet.getDataRange().getDisplayValues();

  let totalBookings = 0;
  let revenue = 0;
  let pending = 0;
  let completed = 0;

  for(let i=1;i<rows.length;i++){

    const bookingDate = rows[i][4].trim();

    if(bookingDate !== date) continue;

    totalBookings++;

    const bookingType = rows[i][1].trim();
    const amount = Number(rows[i][9]) || 0;
    const status = rows[i][12].trim();
    const paymentStatus = rows[i][14].trim();

    if(status === "Pending") pending++;

    if(status === "Completed") completed++;

    if(
        bookingType === "Regular" &&
        paymentStatus === "Paid"
    ){
        revenue += amount;
    }

  }

  return {
    success:true,
    totalBookings,
    revenue,
    pending,
    completed
  };

}

function getRecentBookings(){

    const sheet = getSheet("Bookings");

    const rows = sheet.getDataRange().getDisplayValues();

    const bookings = [];

    for(let i=1;i<rows.length;i++){

        bookings.push({

            bookingID: rows[i][0],

            name: rows[i][2],

            phone: rows[i][3],

            date: rows[i][4].trim(),

            time: rows[i][5].trim(),

            plan: rows[i][6],

            status: rows[i][12],

            createdAt: rows[i][15]

        });

    }

    bookings.sort((a,b)=>
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    return{

        success:true,

        bookings: bookings.slice(0,10)

    };

}

function getDashboardStats(){

  const bookingSheet = getSheet("Bookings");
  const loyaltySheet = getSheet("Loyalty");
  const membershipSheet = getSheet("Memberships");

  const bookingRows = bookingSheet.getDataRange().getDisplayValues();
  const loyaltyRows = loyaltySheet.getDataRange().getDisplayValues();
  const membershipRows = membershipSheet.getDataRange().getDisplayValues();

  const today = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "yyyy-MM-dd"
  );

  let todayBookings = 0;
  let todayRevenue = 0;

  for(let i = 1; i < bookingRows.length; i++){

      const date = bookingRows[i][4].trim();
      const bookingType = bookingRows[i][1].trim();
      const amount = Number(bookingRows[i][9]) || 0;
      const status = bookingRows[i][12].trim();
      const paymentStatus = bookingRows[i][14].trim();

      if(date !== today) continue;

      todayBookings++;

      if(
          bookingType === "Regular" &&
          paymentStatus === "Paid"
      ){
          todayRevenue += amount;
      }

  }

  return{

      success:true,

      todayBookings:todayBookings,

      todayRevenue:todayRevenue,

      loyaltyCards:loyaltyRows.length - 1,

      memberships:membershipRows.length - 1

  };

}

function getRevenueChart(){

  const sheet = getSheet("Bookings");
  const rows = sheet.getDataRange().getDisplayValues();

  const revenueMap = {};

  // Last 7 days
  for(let d=6; d>=0; d--){

    const date = new Date();

    date.setDate(date.getDate()-d);

    const key = Utilities.formatDate(
      date,
      Session.getScriptTimeZone(),
      "yyyy-MM-dd"
    );

    revenueMap[key]=0;

  }

  for(let i=1;i<rows.length;i++){

    const date = rows[i][4].trim();
    const amount = Number(rows[i][9]) || 0;
    const status = rows[i][12].trim();

    if(status!="Completed") continue;

    if(revenueMap.hasOwnProperty(date)){

      revenueMap[date]+=amount;

    }

  }

  const labels=[];
  const revenue=[];

  Object.keys(revenueMap).forEach(date => {

      const jsDate = new Date(date);

      labels.push(
          Utilities.formatDate(
              jsDate,
              Session.getScriptTimeZone(),
              "EEE"
          )
      );

      revenue.push(revenueMap[date]);

  });

  return{

    success:true,

    labels:labels,

    revenue:revenue

  };

}

function getNotifications() {

  const sheet = getSheet("Bookings");
  const rows = sheet.getDataRange().getDisplayValues();

  const settings = getSettings();

  const lastRead = settings.LastNotificationRead || "1970-01-01 00:00:00";

  const notifications = [];

  for (let i = rows.length - 1; i >= 1; i--) {

    // Skip empty rows
    if (!rows[i][0] || rows[i][0].trim() === "") {
      continue;
    }

    const name = rows[i][2].trim();
    const plan = rows[i][6].trim();
    const status = rows[i][12].trim();
    const createdAt = rows[i][15].trim();
    const unread =
    new Date(createdAt) > new Date(lastRead);

    Logger.log(createdAt);
    Logger.log(lastRead);
    Logger.log(unread);

    let icon = "🟡";
    let title = "New Booking";
    let message = `${name} booked ${plan}`;

    if (status === "Completed") {
      icon = "✅";
      title = "Booking Completed";
      message = `${name} completed ${plan}`;
    }
    else if (status === "Cancelled") {
      icon = "❌";
      title = "Booking Cancelled";
      message = `${name} cancelled ${plan}`;
    }

    notifications.push({

        icon,
        title,
        message,
        time: createdAt,
        unread

    });

    // Return only the latest 5 notifications
    if (notifications.length === 5) {
      break;
    }
  }

  const unreadCount = notifications.filter(n => n.unread).length;

  return {

      success: true,

      count: unreadCount,

      notifications: notifications

  };

}

// function autoCompleteBookings() {

//   const sheet = getSheet("Bookings");

//   const data = sheet.getDataRange().getValues();

//   const now = new Date();

//   for (let i = 1; i < data.length; i++) {

//     const row = data[i];

//     const status = row[12];

//     if (status !== "Confirmed") continue;

//     const bookingDate = row[4];
//     const bookingTime = row[5];
//     const duration = Number(row[7]);

//     if (!duration) continue;

//     const bookingDateTime = new Date(
//       bookingDate + " " + bookingTime
//     );

//     const endTime = new Date(
//       bookingDateTime.getTime() + duration * 60000
//     );

//     if (now >= endTime) {

//       sheet.getRange(i + 1, 13).setValue("Completed");

//     }

//   } 

// }