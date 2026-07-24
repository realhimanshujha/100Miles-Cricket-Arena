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

                Number(e.parameter.amount)

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

    expiryDate

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

function getCouponHistory(e){

const cardNo = e.parameter.cardNo;

const sheet =
SpreadsheetApp
.getActiveSpreadsheet()
.getSheetByName("PromoCodes");

const data =
sheet.getDataRange().getValues();

const history=[];

for(let i=1;i<data.length;i++){

if(String(data[i][1]).trim()==cardNo){

history.push({

    coupon: data[i][0],

    reward: data[i][4],      // Reward Name

    status: data[i][5],      // Unused / Used

    date: Utilities.formatDate(

        new Date(data[i][6]),

        Session.getScriptTimeZone(),

        "dd-MMM-yyyy HH:mm"

    )

});

}

}

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