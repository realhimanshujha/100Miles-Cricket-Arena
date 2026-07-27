  function doGet(e){


    const action = e.parameter.action;

    // ==========================
    // Admin
    // ==========================

    if(action=="adminLogin"){
      return adminLogin(e);
    }

    if(action=="getDashboard"){
      return getDashboard(e);
    }

    // ==========================
    // Loyalty
    // ==========================

    if(action=="searchCard"){
      return searchCard(e);
    }

    if(action=="addPoints"){
      return addPoints(e);
    }

    if(action=="createCard"){
      return createCard(e);
    }

    if(action=="updateCard"){
      return updateCard(e);
    }

    if(action=="toggleCardStatus"){
      return toggleCardStatus(e);
    }

    if(action=="getCouponHistory"){
      return getCouponHistory(e);
    }

    if(action=="deleteCard"){
      return deleteCard(e);
    }

    if(action=="renewCard"){
      return renewCard(e);
    }

    // ==========================
    // Bookings
    // ==========================

    if(action=="saveBooking"){
      return output(saveBooking(e.parameter));
    }

    if(action=="getBookings"){
      return output(getBookings());
    }

    if(action=="getBookedSlots"){
      return output(getBookedSlots(e.parameter.date));
    }

    if(action=="getDashboardStats"){
      return output(getDashboardStats());
    }

    if(action=="updateBookingStatus"){
      return output(
        updateBookingStatus(
          e.parameter.bookingID,
          e.parameter.status,
          e.parameter.paymentMethod
        )
      );
    }

    if(action=="getBookingStats"){

        return output(
            getBookingStats(e.parameter.date)
        );

    }

    
    if(action=="getRecentBookings"){
        return output(
            getRecentBookings()
        );
    }

    if(action=="getDashboardStats"){

        return output(
            getDashboardStats()
        );

    }
    
    if(action=="updateBooking"){

        return output(
            updateBooking(e.parameter)
        );
    }

    if(action=="getRevenueChart"){
        return output(
            getRevenueChart()
        );
    }

    if(action=="getNotifications"){

        return output(
            getNotifications()
        );

    } 

    if(action=="markNotificationsRead"){

        return output(
            markNotificationsRead()
        );

    }

    if(action=="createPromocode"){

    return output(createPromocode({

        code:e.parameter.code,
        type:e.parameter.type,
        value:Number(e.parameter.value),
        minBooking:Number(e.parameter.minBooking),
        maxDiscount:Number(e.parameter.maxDiscount),
        usageLimit:Number(e.parameter.usageLimit),
        expiry:e.parameter.expiry,
        status:e.parameter.status,
        paymentRule:e.parameter.paymentRule

    }));
    }

    if(action=="applyPromocode"){

        return output(

            applyPromocode(

                e.parameter.code,

                Number(e.parameter.amount),
                
                e.parameter.plan

            )

        );

    }

    if(action=="getPromocodes"){

        return output(
            getPromocodes()
        );

    }

    if(action=="updatePromocode"){

        return output(

            updatePromocode({

                row:Number(e.parameter.row),

                code:e.parameter.code,

                type:e.parameter.type,

                value:Number(e.parameter.value),

                minBooking:Number(e.parameter.minBooking),

                maxDiscount:Number(e.parameter.maxDiscount),

                usageLimit:Number(e.parameter.usageLimit),

                expiry:e.parameter.expiry,

                status:e.parameter.status

            })

        );

    }

    if(action=="deletePromocode"){

        return output(

            deletePromocode(e.parameter.row)

        );

    }

    if(action=="verifyRedeemCard"){

        return output(
            verifyRedeemCard(e.parameter)
        );

    }

    if(action=="getAvailablePromocodes"){

        return output(
            getAvailablePromocodes()
        );

    }

    if(action=="redeemReward"){

        return output(

            redeemReward(e.parameter)

        );

    }

    if(action=="createMembership"){

        return output(

            createMembership({

                name:e.parameter.name,
                phone:e.parameter.phone,
                email:e.parameter.email,
                plan:e.parameter.plan,
                joinDate:e.parameter.joinDate,
                expiryDate:e.parameter.expiryDate,
                amount:Number(e.parameter.amount)

            })

        );

    }

    if(action=="updateMembership"){

      return ContentService
        .createTextOutput(JSON.stringify(

          updateMembership({

            row:Number(e.parameter.row),
            plan:e.parameter.plan,
            joinDate:e.parameter.joinDate,
            expiryDate:e.parameter.expiryDate,
            amount:Number(e.parameter.amount)

          })

        ))
        .setMimeType(ContentService.MimeType.JSON);

    }

    if(action=="getMemberships"){

        return output(

            getMemberships()

        );

    }

    if(action=="editMembership"){

      return ContentService
        .createTextOutput(JSON.stringify(

          editMembership({

            row:Number(e.parameter.row),
            name:e.parameter.name,
            phone:e.parameter.phone,
            plan:e.parameter.plan,
            joinDate:e.parameter.joinDate,
            expiryDate:e.parameter.expiryDate,
            amount:Number(e.parameter.amount),
            status:e.parameter.status

          })

        ))
        .setMimeType(ContentService.MimeType.JSON);

    }

    if(action=="deleteMembership"){

      return ContentService
        .createTextOutput(JSON.stringify(

          deleteMembership(Number(e.parameter.row))

        ))
        .setMimeType(ContentService.MimeType.JSON);

    }

    if(action=="searchMember"){

        return output(
            searchMember(e.parameter.keyword)
        );

    }

    if(action=="getReport"){

        return output(

            getReport(

                e.parameter.filter,

                e.parameter.from,

                e.parameter.to

            )

        );

    }

    if(action=="exportReport"){

        return exportReportCSV(

            e.parameter.filter,

            e.parameter.from,

            e.parameter.to

        );

    }

    if(action=="exportPDF"){

        return exportPDF(

            e.parameter.filter,

            e.parameter.from,

            e.parameter.to

        );

    }

    if(action=="getSettings"){

        return output({

            success:true,

            settings:getSettings()

        });

    }

    if(action=="saveSettings"){

        const data = JSON.parse(e.parameter.data);

        Object.keys(data).forEach(key=>{

            setSetting(key,data[key]);

        });

        return output({

            success:true,
            message:"Settings Saved"

        });

    }

    if(action=="verifyMembership"){

        return output(

            verifyMembership(

                e.parameter.memberID,

                e.parameter.phone

            )

        );

    }

    // ==========================
    // Invalid Action
    // ==========================

    return output({

      success:false,
      message:"Invalid Action"

    });



  }



/**
 * Common JSON Output
 */

function output(data){

  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);

}

function doPost(e) {
  return doGet(e);
}

function verifyCard(e) {

  const cardNo = e.parameter.cardNo;
  const phone = e.parameter.phone;

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Loyalty");

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {

    if (
      String(data[i][0]).trim() == String(cardNo).trim() &&
      String(data[i][2]).trim() == String(phone).trim() &&
      String(data[i][5]).trim() == "Active"
    ) {

      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          name: data[i][1],
          points: data[i][3]
        }))
        .setMimeType(ContentService.MimeType.JSON);

    }

  }

  return ContentService
    .createTextOutput(JSON.stringify({
      success: false,
      message: "Invalid Card Number or Phone Number"
    }))
    .setMimeType(ContentService.MimeType.JSON);

}

function redeemReward(data){

    const loyaltySheet = getSheet("Loyalty");

    const couponSheet = getSheet("RedeemedCoupons");

    const cardNo = String(data.cardNo).trim();

    const phone = String(data.phone).trim();

    const reward = String(data.reward);

    const requiredPoints = Number(data.points);

    // =====================================
    // Check Existing Unused Coupon
    // =====================================

    const couponRows = couponSheet.getDataRange().getValues();

    for(let i=1;i<couponRows.length;i++){

        const row = couponRows[i];

        if(

            String(row[1]).trim() === cardNo &&

            String(row[5]).trim().toLowerCase() === "unused"

        ){

            return{

                success:false,

                hasUnusedCoupon:true,

                coupon:row[0],

                reward:row[3],

                expiry:Utilities.formatDate(

                    new Date(row[7]),

                    Session.getScriptTimeZone(),

                    "dd MMM yyyy"

                ),

                message:"You already have an unused coupon."

            };

        }

    }

    const rows = loyaltySheet.getDataRange().getValues();

    // const cardNo = String(data.cardNo).trim();

    // const phone = String(data.phone).trim();

    // const reward = String(data.reward);

    // const requiredPoints = Number(data.points);

    for(let i=1;i<rows.length;i++){

        if(String(rows[i][0]).trim()!==cardNo){

            continue;

        }

        if(String(rows[i][2]).trim()!==phone){

            return{

                success:false,

                message:"Phone number mismatch."

            };

        }

        const customerName = rows[i][1];
        const customerEmail = rows[i][9];

        let currentPoints = Number(rows[i][3]);

        if(currentPoints < requiredPoints){

            return{

                success:false,

                message:"Not enough points."

            };

        }

        currentPoints -= requiredPoints;

        loyaltySheet.getRange(i+1,4).setValue(currentPoints);

        const couponCode = generateCouponCode();

        const expiry = new Date();

        expiry.setDate(expiry.getDate()+7);

        couponSheet.appendRow([

            couponCode,

            cardNo,

            phone,

            reward,

            getRewardDiscount(reward),

            "Unused",

            new Date(),

            expiry,

            ""

        ]);

        if (customerEmail) {
            sendRewardEmail(
                customerEmail,
                customerName,
                cardNo,
                couponCode,
                reward,
                expiry
            );
        }

        return{

            success:true,

            coupon:couponCode,

            remainingPoints:currentPoints,

            expiry:Utilities.formatDate(

                expiry,

                Session.getScriptTimeZone(),

                "dd MMM yyyy"

            )

        };

    }

    return{

        success:false,

        message:"Card not found."

    };

}

function getRewardDiscount(reward){

    switch(reward){

        case "OFF15":
            return "15%";

        case "FREE5":
            return "100%";

        case "FREE10":
            return "100%";

        case "FREE20":
            return "100%";

        default:
            return "";
    }

}

function generateCouponCode(){

    const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code="100M-";

    for(let i=0;i<6;i++){

        code += chars.charAt(

            Math.floor(Math.random()*chars.length)

        );

    }

    return code;

}

function sendRewardEmail(email, customerName, cardNo, couponCode, reward, expiry){

  const expiryDate = Utilities.formatDate(
    expiry,
    Session.getScriptTimeZone(),
    "dd MMM yyyy"
  );

  const rewardName = {
    "OFF15":"15% OFF on One Booking",
    "FREE5":"FREE 5 Overs Session",
    "FREE10":"FREE 10 Overs Session",
    "FREE20":"FREE 20 Overs Session"
  }[reward] || reward;

  const subject = "🎉 Your 100Miles Cricket Arena Reward Coupon";

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  </head>

  <body style="margin:0;padding:0;background:#f2f4f7;font-family:Arial,Helvetica,sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f4f7;padding:25px 10px;">
  <tr>
  <td align="center">

  <table role="presentation" cellpadding="0" cellspacing="0"
  style="
  max-width:700px;
  width:100%;
  background:#ffffff;
  border-radius:18px;
  overflow:hidden;
  box-shadow:0 8px 25px rgba(0,0,0,.12);
  ">

  <!-- HEADER -->

  <tr>

  <td
  style="
  background:#111111;
  padding:40px 20px;
  text-align:center;
  ">

  <img
  src="https://raw.githubusercontent.com/realhimanshujha/100Miles-Cricket-Arena/main/assets/images/logo.jpeg"
  alt="100Miles Cricket Arena"
  style="
  display:block;
  margin:auto;
  width:170px;
  max-width:65%;
  height:auto;
  border-radius:16px;
  background:#fff;
  padding:8px;
  ">

  <h1 style="
  margin:25px 0 10px;
  color:#FFC107;
  font-size:34px;
  font-weight:bold;
  ">

  100Miles Cricket Arena

  </h1>

  <p style="
  margin:0;
  color:#dddddd;
  font-size:16px;
  line-height:28px;
  ">

  Train Hard. Play Better.

  </p>

  </td>

  </tr>

  <!-- HERO -->

  <tr>

  <td style="padding:40px 30px;">

  <div style="
  background:linear-gradient(135deg,#FFFDF2,#FFF2C6);
  border-left:6px solid #FFC107;
  border-radius:14px;
  padding:28px;
  ">

  <h2 style="
  margin:0;
  color:#111;
  font-size:30px;
  ">

  🎉 Congratulations ${customerName}!

  </h2>

  <p style="
  margin-top:15px;
  font-size:17px;
  line-height:30px;
  color:#555;
  ">

  You've successfully redeemed your loyalty reward.

  Thank you for choosing <strong>100Miles Cricket Arena</strong>.

  Your dedication on the pitch has earned you an exclusive reward.

  Keep practicing and keep collecting loyalty points for even bigger rewards!

  </p>

  </div>

  <!-- COUPON -->

  <div
  style="
  margin-top:35px;
  background:#111111;
  border:3px dashed #FFC107;
  border-radius:18px;
  padding:35px;
  text-align:center;
  ">

  <div style="
  color:#FFC107;
  font-size:15px;
  letter-spacing:3px;
  font-weight:bold;
  ">

  LOYALTY REWARD

  </div>

  <div style="
  margin-top:15px;
  color:#ffffff;
  font-size:24px;
  font-weight:bold;
  ">

  ${rewardName}

  </div>

  <div style="
  margin:25px 0;
  font-size:42px;
  font-weight:900;
  letter-spacing:5px;
  color:#FFC107;
  word-break:break-word;
  ">

  ${couponCode}

  </div>

  <div style="
  display:inline-block;
  padding:12px 26px;
  background:#ffffff;
  border-radius:40px;
  font-size:17px;
  font-weight:bold;
  color:#111;
  ">

  Valid Until • ${expiryDate}

  </div>

  </div>

  <!-- DETAILS -->

  <table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  style="
  margin-top:35px;
  border-collapse:collapse;
  ">

  <tr>

  <td style="padding:16px;border-bottom:1px solid #ececec;">
  🏏 <strong>Reward</strong>
  </td>

  <td
  align="right"
  style="padding:16px;border-bottom:1px solid #ececec;">

  ${rewardName}

  </td>

  </tr>

  <tr>

  <td style="padding:16px;border-bottom:1px solid #ececec;">
  🪪 <strong>Loyalty Card</strong>
  </td>

  <td
  align="right"
  style="padding:16px;border-bottom:1px solid #ececec;">

  ${cardNo}

  </td>

  </tr>

  <tr>

  <td style="padding:16px;border-bottom:1px solid #ececec;">
  📅 <strong>Expiry Date</strong>
  </td>

  <td
  align="right"
  style="
  padding:16px;
  border-bottom:1px solid #ececec;
  color:#d32f2f;
  font-weight:bold;
  ">

  ${expiryDate}

  </td>

  </tr>

  </table>

  <!-- NEXT STEPS -->

  <div style="
  margin-top:35px;
  background:#fafafa;
  padding:28px;
  border-radius:14px;
  ">

  <h3 style="
  margin-top:0;
  color:#111;
  ">

  🏏 What's Next?

  </h3>

  <p style="
  color:#555;
  line-height:30px;
  margin-bottom:0;
  ">

  ✅ Book your next cricket session

  <br>

  ✅ Apply this coupon during booking

  <br>

  ✅ Continue earning loyalty points

  <br>

  ✅ Unlock more exciting rewards

  </p>

  </div>

  <!-- BUTTON -->

  <div
  style="
  text-align:center;
  margin:45px 0;
  ">

  <a
  href="https://realhimanshujha.github.io/100Miles-Cricket-Arena/book-now.html"

  style="
  display:inline-block;
  background:#FFC107;
  color:#111111;
  padding:18px 42px;
  font-size:20px;
  font-weight:bold;
  text-decoration:none;
  border-radius:50px;
  ">

  🏏 BOOK YOUR SESSION

  </a>

  </div>

  <!-- TERMS -->

  <div style="
  background:#FFF8E1;
  padding:28px;
  border-radius:14px;
  ">

  <h3 style="
  margin-top:0;
  color:#111;
  ">

  📜 Terms & Conditions

  </h3>

  <ul style="
  padding-left:22px;
  line-height:30px;
  color:#555;
  margin-bottom:0;
  ">

  <li>Coupon is valid for one-time use only.</li>

  <li>Coupon expires 7 days after issue.</li>

  <li>Coupon cannot be exchanged for cash.</li>

  <li>Coupon is non-transferable.</li>

  <li>Present this coupon while booking.</li>

  <li>Management reserves the right to refuse invalid coupons.</li>

  </ul>

  </div>

  </td>

  </tr>

  <!-- FOOTER -->

  <tr>

  <td
  style="
  background:#111111;
  padding:40px 25px;
  text-align:center;
  ">

  <img
  src="https://raw.githubusercontent.com/realhimanshujha/100Miles-Cricket-Arena/main/assets/images/logo.jpeg"

  style="
  width:90px;
  height:auto;
  border-radius:12px;
  background:#ffffff;
  padding:6px;
  display:block;
  margin:auto;
  ">

  <h2 style="
  color:#FFC107;
  margin:20px 0 10px;
  ">

  100Miles Cricket Arena

  </h2>

  <p style="
  color:#dddddd;
  line-height:28px;
  margin:0;
  ">

  Train Hard. Play Better.

  <br><br>

  📍 Guwahati, Assam

  <br>

  🌐 realhimanshujha.github.io/100Miles-Cricket-Arena

  </p>

  <hr
  style="
  margin:30px 0;
  border:none;
  border-top:1px solid #333;
  ">

  <p style="
  color:#888888;
  font-size:13px;
  line-height:24px;
  margin:0;
  ">

  Thank you for being a valued member of the
  <strong style="color:#FFC107;">
  100Miles Cricket Arena
  </strong> family.

  <br><br>

  © 2026 100Miles Cricket Arena.
  All Rights Reserved.

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
    to: email,
    subject: subject,
    htmlBody: html
  });

}

function adminLogin(e){

  const username = String(e.parameter.username).trim();
  const password = String(e.parameter.password).trim();

  const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName("Admins");

  const data = sheet.getDataRange().getValues();

  for(let i=1;i<data.length;i++){

    if(

      String(data[i][0]).trim() == username &&

      String(data[i][1]).trim() == password &&

      String(data[i][3]).trim() == "Active"

    ){

      return ContentService
      .createTextOutput(JSON.stringify({

        success:true,

        name:data[i][2]

      }))
      .setMimeType(ContentService.MimeType.JSON);

    }

  }

  return ContentService
  .createTextOutput(JSON.stringify({

    success:false,

    message:"Invalid Username or Password"

  }))
  .setMimeType(ContentService.MimeType.JSON);

}

function getDashboard(){

const ss =
SpreadsheetApp.getActiveSpreadsheet();

const customers =
ss.getSheetByName("Customers");

const bookings =
ss.getSheetByName("Bookings");

const promo =
ss.getSheetByName("PromoCodes");

const loyalty =
ss.getSheetByName("Loyalty");

const totalCustomers =
customers.getLastRow()-1;

const todayBookings =
bookings.getLastRow()-1;

const promoData =
promo.getDataRange().getValues();

let unused=0;

for(let i=1;i<promoData.length;i++){

if(promoData[i][4]=="Unused"){

unused++;

}

}

const data={

totalCustomers:totalCustomers,

todayBookings:todayBookings,

unusedCoupons:unused,

todayRevenue:0,

activity:[

{

title:"Dashboard Connected Successfully",

time:new Date().toLocaleString()

}

]

};

return ContentService

.createTextOutput(JSON.stringify(data))

.setMimeType(ContentService.MimeType.JSON);

}

function searchCard(e){

  const keyword = String(e.parameter.cardNo).trim();

  const sheet =
  SpreadsheetApp
  .getActiveSpreadsheet()
  .getSheetByName("Loyalty");

  const data =
  sheet.getDataRange().getValues();

  const today = new Date();

  for(let i=1;i<data.length;i++){

    const cardNumber = String(data[i][0]).trim();
    const phone = String(data[i][2]).trim();

    if(cardNumber === keyword || phone === keyword){

      let status = String(data[i][5]).trim();

      // Deleted cards
      if(status=="Deleted"){

        return ContentService
        .createTextOutput(JSON.stringify({

          success:false,
          message:"This loyalty card has been deleted."

        }))
        .setMimeType(ContentService.MimeType.JSON);

      }

      // Expiry Check
      const expiry = new Date(data[i][7]);

      if(status=="Active" && today > expiry){

        status = "Expired";

      }

      return ContentService
      .createTextOutput(JSON.stringify({

        success:true,

        cardNo:data[i][0],

        name:data[i][1],

        phone:data[i][2],

        points:data[i][3],

        total:data[i][4],

        status:status,

        issueDate:Utilities.formatDate(
          new Date(data[i][6]),
          Session.getScriptTimeZone(),
          "dd-MMM-yyyy"
        ),

        expiryDate:Utilities.formatDate(
          expiry,
          Session.getScriptTimeZone(),
          "dd-MMM-yyyy"
        )

      }))
      .setMimeType(ContentService.MimeType.JSON);

    }

  }

  return ContentService
  .createTextOutput(JSON.stringify({

    success:false,
    message:"Card not found."

  }))
  .setMimeType(ContentService.MimeType.JSON);

}

function addPoints(e){

  const cardNo = String(e.parameter.cardNo).trim();

  const add = Number(e.parameter.points);

  const sheet =
  SpreadsheetApp
  .getActiveSpreadsheet()
  .getSheetByName("Loyalty");

  const data =
  sheet.getDataRange().getValues();

  for(let i=1;i<data.length;i++){

    if(String(data[i][0]).trim()==cardNo){

      const current =
      Number(data[i][3]);

      const total =
      Number(data[i][4]);

      const newCurrent =
      current + add;

      const newTotal =
      total + add;

      sheet.getRange(i+1,4).setValue(newCurrent);

      sheet.getRange(i+1,5).setValue(newTotal);

      return ContentService
      .createTextOutput(JSON.stringify({

          success: true,

          currentPoints: newCurrent,

          total: newTotal

      }))
      .setMimeType(ContentService.MimeType.JSON);

    }

  }

  return ContentService
  .createTextOutput(JSON.stringify({

    success:false,

    message:"Card not found"

  }))
  .setMimeType(ContentService.MimeType.JSON);

}

function createCard(e){

  const cardNo = String(e.parameter.cardNo).trim();
  const name = String(e.parameter.name).trim();
  const phone = String(e.parameter.phone).trim();
  const email = String(e.parameter.email).trim();

  const sheet =
  SpreadsheetApp
  .getActiveSpreadsheet()
  .getSheetByName("Loyalty");

  const data =
  sheet.getDataRange().getValues();

  // Check duplicate Card Number
  for(let i=1;i<data.length;i++){

    if(String(data[i][0]).trim()==cardNo){

      return ContentService
      .createTextOutput(JSON.stringify({

        success:false,
        message:"Card Number already exists."

      }))
      .setMimeType(ContentService.MimeType.JSON);

    }

  }

  // Check duplicate Phone

  for(let i=1;i<data.length;i++){

    if(String(data[i][2]).trim()==phone){

      return ContentService
      .createTextOutput(JSON.stringify({

        success:false,
        message:"Phone Number already registered."

      }))
      .setMimeType(ContentService.MimeType.JSON);

    }

  }

  const issueDate = new Date();

  const expiryDate = new Date(issueDate);

  expiryDate.setMonth(expiryDate.getMonth()+6);

  sheet.appendRow([

    cardNo,

    name,

    phone,

    0,

    0,

    "Active",

    issueDate,

    expiryDate,

    "",

    email

  ]);

  return ContentService
  .createTextOutput(JSON.stringify({

    success:true

  }))
  .setMimeType(ContentService.MimeType.JSON);

}

function updateCard(e){

  const cardNo = e.parameter.cardNo;

  const name = e.parameter.name;

  const phone = e.parameter.phone;

  const status = e.parameter.status;

  const sheet =
  SpreadsheetApp
  .getActiveSpreadsheet()
  .getSheetByName("Loyalty");

  const data =
  sheet.getDataRange().getValues();

  for(let i=1;i<data.length;i++){

    if(data[i][0]==cardNo){

      sheet.getRange(i+1,2).setValue(name);

      sheet.getRange(i+1,3).setValue(phone);

      sheet.getRange(i+1,6).setValue(status);

      return ContentService
      .createTextOutput(JSON.stringify({

        success:true

      }))
      .setMimeType(ContentService.MimeType.JSON);

    }

  }

}

function toggleCardStatus(e){

const cardNo =
String(e.parameter.cardNo).trim();

const sheet =
SpreadsheetApp
.getActiveSpreadsheet()
.getSheetByName("Loyalty");

const data =
sheet.getDataRange().getValues();

for(let i=1;i<data.length;i++){

if(String(data[i][0]).trim()==cardNo){

const currentStatus =
String(data[i][5]).trim();

let newStatus;

if(currentStatus=="Active"){

newStatus="Blocked";

}else{

newStatus="Active";

}

sheet.getRange(i+1,6).setValue(newStatus);

return ContentService

.createTextOutput(JSON.stringify({

success:true,

message:"Card is now "+newStatus

}))

.setMimeType(ContentService.MimeType.JSON);

}

}

return ContentService

.createTextOutput(JSON.stringify({

success:false,

message:"Card not found."

}))

.setMimeType(ContentService.MimeType.JSON);

}

function getCouponHistory(e) {

  const cardNo = String(e.parameter.cardNo || "").trim();

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("RedeemedCoupons");

  if (!sheet) {
    return ContentService
      .createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const data = sheet.getDataRange().getValues();
  const history = [];

  for (let i = 1; i < data.length; i++) {

    if (String(data[i][1]).trim() === cardNo) {

      history.push({

        coupon: data[i][0],          // Coupon Code
        reward: data[i][3],          // Reward
        status: data[i][5],          // Used / Unused

        created: data[i][6]
          ? Utilities.formatDate(
              new Date(data[i][6]),
              Session.getScriptTimeZone(),
              "dd-MMM-yyyy HH:mm"
            )
          : "",

        expiry: data[i][7]
          ? Utilities.formatDate(
              new Date(data[i][7]),
              Session.getScriptTimeZone(),
              "dd-MMM-yyyy HH:mm"
            )
          : "",

        usedAt: data[i][8]
          ? Utilities.formatDate(
              new Date(data[i][8]),
              Session.getScriptTimeZone(),
              "dd-MMM-yyyy HH:mm"
            )
          : ""

      });

    }

  }

  history.reverse();

  return ContentService
    .createTextOutput(JSON.stringify(history))
    .setMimeType(ContentService.MimeType.JSON);

}

function deleteCard(e){

  const cardNo =
  String(e.parameter.cardNo).trim();

  const sheet =
  SpreadsheetApp
  .getActiveSpreadsheet()
  .getSheetByName("Loyalty");

  const data =
  sheet.getDataRange().getValues();

  for(let i=1;i<data.length;i++){

    if(String(data[i][0]).trim()==cardNo){

      sheet.getRange(i+1,6).setValue("Deleted");

      return ContentService
      .createTextOutput(JSON.stringify({

        success:true,

        message:"Loyalty card deleted successfully."

      }))
      .setMimeType(ContentService.MimeType.JSON);

    }

  }

  return ContentService
  .createTextOutput(JSON.stringify({

    success:false,

    message:"Card not found."

  }))
  .setMimeType(ContentService.MimeType.JSON);

}

function renewCard(e){

  const cardNo = String(e.parameter.cardNo).trim();

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Loyalty");

  const data = sheet.getDataRange().getValues();

  const today = new Date();

  for(let i=1;i<data.length;i++){

    if(String(data[i][0]).trim() == cardNo){

      const currentExpiry = new Date(data[i][7]);

      let newExpiry;

      // If card is still active, extend from current expiry
      if(currentExpiry >= today){

        newExpiry = new Date(currentExpiry);

      }else{

        // If expired, start from today
        newExpiry = new Date(today);

      }

      newExpiry.setMonth(newExpiry.getMonth() + 6);

      // DON'T change the original Issued Date

      // Update Expiry (Column H)
      sheet.getRange(i+1,8).setValue(newExpiry);

      // Update Last Renewed (Column I)
      sheet.getRange(i+1,9).setValue(today);

      // Activate card
      sheet.getRange(i+1,6).setValue("Active");

      SpreadsheetApp.flush();

      return ContentService
      .createTextOutput(JSON.stringify({

        success:true,
        message:"Card renewed successfully."

      }))
      .setMimeType(ContentService.MimeType.JSON);

    }

  }

  return ContentService
  .createTextOutput(JSON.stringify({

    success:false,
    message:"Card not found."

  }))
  .setMimeType(ContentService.MimeType.JSON);

}

function addLoyaltyPointsByPhone(phone, plan){

  const settings = getSettings();

  const pointsMap = {

    "3 Overs": Number(settings.Loyalty3Overs || 1),

    "5 Overs": Number(settings.Loyalty5Overs || 2),

    "10 Overs": Number(settings.Loyalty10Overs || 4),

    "20 Overs": Number(settings.Loyalty20Overs || 8)

  };

  const points = pointsMap[plan] || 0;

  if(points === 0){

    return {

      success:false,

      points:0,

      message:"Invalid plan."

    };

  }

  const sheet = getSheet("Loyalty");
  const rows = sheet.getDataRange().getValues();

  for(let i = 1; i < rows.length; i++){

    const loyaltyPhone = String(rows[i][2]).trim();
    const status = String(rows[i][5]).trim();

    if(
      loyaltyPhone === String(phone).trim() &&
      status === "Active"
    ){

      const currentPoints = Number(rows[i][3]) || 0;
      const totalEarned = Number(rows[i][4]) || 0;

      sheet.getRange(i + 1, 4).setValue(currentPoints + points);
      sheet.getRange(i + 1, 5).setValue(totalEarned + points);

      return {

        success:true,

        points:points,

        message:`${points} loyalty points added.`

      };

    }

  }

  return {

    success:false,

    points:0,

    message:"No active loyalty card found."

  };

}