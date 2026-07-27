function createMembership(data) {

  const sheet = getSheet("Memberships");

  const memberID = generateMemberID();

  const plans = {

    Beginner: {
      oversPerDay: 5,
      totalOvers: 35
    },

    Advanced: {
      oversPerDay: 10,
      totalOvers: 100
    },

    Professional: {
      oversPerDay: 20,
      totalOvers: 200
    }

  };

  const plan = plans[data.plan];

  sheet.appendRow([

      memberID,
      data.name,
      data.phone,
      data.plan,
      data.joinDate,
      data.expiryDate,
      data.amount,
      "Active",

      plan.oversPerDay,
      plan.totalOvers,

      0,                  // UsedOvers

      plan.totalOvers,    // RemainingOvers

      0,                  // TodayUsedOvers

      "",                 // LastBookingDate

      new Date(),         // CreatedAt
      data.email          // Email

  ]);

  if (data.email) {

    sendMembershipEmail({

        email: data.email,
        memberID: memberID,
        name: data.name,
        plan: data.plan,
        joinDate: data.joinDate,
        expiryDate: data.expiryDate,
        amount: data.amount,
        oversPerDay: plan.oversPerDay,
        totalOvers: plan.totalOvers

    });

  }

  return {

    success: true,

    memberID: memberID,

    message: "Membership created successfully."

  };

}

function updateExpiredMemberships(){

  const sheet = getSheet("Memberships");

  const data = sheet.getDataRange().getValues();

  const today = new Date();

  today.setHours(0,0,0,0);

  for(let i=1;i<data.length;i++){

    const expiry = new Date(data[i][5]);

    expiry.setHours(0,0,0,0);

    const status = data[i][7];

    if(status == "Active" && expiry < today){

      sheet.getRange(i+1,8).setValue("Expired");

    }

  }

}

function getMemberships(){

  updateExpiredMemberships();

  const sheet = getSheet("Memberships");

  const data = sheet.getDataRange().getValues();

  const members = [];

  for(let i=1;i<data.length;i++){

    if(!data[i][0]) continue;

    members.push({

      row:i+1,

      memberID:data[i][0],

      name:data[i][1],

      phone:data[i][2],

      plan:data[i][3],

      joinDate: Utilities.formatDate(
          new Date(data[i][4]),
          Session.getScriptTimeZone(),
          "yyyy-MM-dd"
      ),

      expiryDate: Utilities.formatDate(
          new Date(data[i][5]),
          Session.getScriptTimeZone(),
          "yyyy-MM-dd"
      ),

      amount:data[i][6],

      status:data[i][7],

      oversPerDay:data[i][8],

      totalOvers:data[i][9],

      usedOvers:data[i][10],

      remainingOvers:data[i][11],

      todayUsedOvers:data[i][12],

      lastBookingDate:data[i][13],

      createdAt:data[i][14],

      email: data[i][15],

  });

  }

  return{

    success:true,

    members:members

  };

}

function updateMembership(data){

  console.log(JSON.stringify(data));

  const plans = {

    Beginner: {
      oversPerDay: 5,
      totalOvers: 35
    },

    Advanced: {
      oversPerDay: 10,
      totalOvers: 100
    },

    Professional: {
      oversPerDay: 20,
      totalOvers: 200
    }

  };

  const plan = plans[data.plan];

  const sheet = getSheet("Memberships");

  sheet.getRange(data.row, 4).setValue(data.plan);      // Plan
  sheet.getRange(data.row, 5).setValue(data.joinDate);  // Renew Join Date
  sheet.getRange(data.row, 6).setValue(data.expiryDate); // Expiry
  sheet.getRange(data.row, 7).setValue(data.amount);     // Amount
  sheet.getRange(data.row, 8).setValue("Active");        // Status
  sheet.getRange(data.row, 9).setValue(plan.oversPerDay);
  sheet.getRange(data.row,10).setValue(plan.totalOvers);
  sheet.getRange(data.row,11).setValue(0);
  sheet.getRange(data.row,12).setValue(plan.totalOvers);
  sheet.getRange(data.row,13).setValue(0);   // TodayUsedOvers
  sheet.getRange(data.row,14).setValue("");  // LastBookingDate

  return {
    success: true,
    message: "Membership updated successfully."
  };

}

function editMembership(data){

  const sheet = getSheet("Memberships");

  const plans = {

    Beginner:{
      oversPerDay:5,
      totalOvers:35
    },

    Advanced:{
      oversPerDay:10,
      totalOvers:100
    },

    Professional:{
      oversPerDay:20,
      totalOvers:200
    }

  };

  const plan = plans[data.plan];

  sheet.getRange(data.row,2).setValue(data.name);
  sheet.getRange(data.row,3).setValue(data.phone);
  sheet.getRange(data.row,4).setValue(data.plan);
  sheet.getRange(data.row,5).setValue(data.joinDate);
  sheet.getRange(data.row,6).setValue(data.expiryDate);
  sheet.getRange(data.row,7).setValue(data.amount);
  sheet.getRange(data.row,8).setValue(data.status);

  // Reset overs according to the corrected plan
  sheet.getRange(data.row,9).setValue(plan.oversPerDay);
  sheet.getRange(data.row,10).setValue(plan.totalOvers);
  sheet.getRange(data.row,11).setValue(0);
  sheet.getRange(data.row,12).setValue(plan.totalOvers);
  sheet.getRange(data.row,13).setValue(0);
  sheet.getRange(data.row,14).setValue("");

  return{
    success:true,
    message:"Membership updated successfully."
  };

}

function deleteMembership(row){

  const sheet = getSheet("Memberships");

  sheet.getRange(row, 8).setValue("Deleted");

  return{
    success:true,
    message:"Membership deleted successfully."
  };

}


function searchMember(keyword){

  const sheet = getSheet("Memberships");

  const rows = sheet.getDataRange().getValues();

  keyword = String(keyword).trim();

  for(let i=1;i<rows.length;i++){

    const memberID = String(rows[i][0]).trim();
    const phone = String(rows[i][2]).trim();

    if(memberID === keyword || phone === keyword){

      return{

        success:true,

        member:{

          row:i+1,

          memberID:memberID,

          name:rows[i][1],

          phone:phone,

          plan:rows[i][3],

          joinDate:Utilities.formatDate(
            new Date(rows[i][4]),
            Session.getScriptTimeZone(),
            "yyyy-MM-dd"
          ),

          expiryDate:Utilities.formatDate(
            new Date(rows[i][5]),
            Session.getScriptTimeZone(),
            "yyyy-MM-dd"
          ),

          amount:rows[i][6],

          status:rows[i][7],

          oversPerDay:rows[i][8],

          totalOvers:rows[i][9],

          usedOvers:rows[i][10],

          remainingOvers:rows[i][11],

          todayUsedOvers:rows[i][12],

          lastBookingDate:rows[i][13],

          email: rows[i][15],

        }

      };

    }

  }

  return{

    success:false,

    message:"Member not found."

  };

}


function validateMembershipBooking(phone, bookedPlan, bookingDate){

  const sheet = getSheet("Memberships");
  const rows = sheet.getDataRange().getValues();

  const planMap = {
    "Beginner": "5 Overs",
    "Advanced": "10 Overs",
    "Professional": "20 Overs"
  };

  const today = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "yyyy-MM-dd"
  );

  for(let i=1;i<rows.length;i++){

    if(String(rows[i][2]).trim() !== String(phone).trim()){
      continue;
    }

    const memberPlan = rows[i][3];
    const expiry = Utilities.formatDate(
      new Date(rows[i][5]),
      Session.getScriptTimeZone(),
      "yyyy-MM-dd"
    );

    const status = rows[i][7];

    const oversPerDay = Number(rows[i][8]);
    const todayUsed = Number(rows[i][12]) || 0;

    let lastBooking = "";

    if(rows[i][13]){

      lastBooking = Utilities.formatDate(
          new Date(rows[i][13]),
          Session.getScriptTimeZone(),
          "yyyy-MM-dd"
      );

    }

    if(status !== "Active"){
      return {
        success:false,
        message:"Membership is not active."
      };
    }

    if(expiry < today){
      return {
        success:false,
        message:"Membership has expired."
      };
    }

    if(planMap[memberPlan] !== bookedPlan){
      return {
        success:false,
        message:`${memberPlan} members can only book ${planMap[memberPlan]}.`
      };
    }

    // Already used today's session
    if(lastBooking === bookingDate && todayUsed >= oversPerDay){
      return {
        success:false,
        message:"Today's membership session has already been used."
      };
    }

    const bookingSheet = getSheet("Bookings");
    const bookingRows = bookingSheet.getDataRange().getDisplayValues();

    for(let j = 1; j < bookingRows.length; j++){

        const bookingType = bookingRows[j][1];
        const bookingPhone = bookingRows[j][3];
        const bookedDate = bookingRows[j][4];
        const bookingStatus = bookingRows[j][11];

        if(
            bookingType === "Membership" &&
            bookingPhone === phone &&
            bookedDate === bookingDate &&
            bookingStatus !== "Cancelled"
        ){

            return {
                success:false,
                message:"A membership booking already exists for this date."
            };

        }

    }

    return {
      success:true
    };

  }

  return {
    success:false,
    message:"Membership not found."
  };

}

function resetDailyMembershipUsage(){

  const sheet = getSheet("Memberships");
  const rows = sheet.getDataRange().getValues();

  const today = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "yyyy-MM-dd"
  );

  for(let i=1;i<rows.length;i++){

    if(!rows[i][13]) continue;

    const lastBooking = Utilities.formatDate(
      new Date(rows[i][13]),
      Session.getScriptTimeZone(),
      "yyyy-MM-dd"
    );

    if(lastBooking !== today){

      sheet.getRange(i+1,13).setValue(0);

    }

  }

}


function sendMembershipEmail(member) {

  const html = `
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<meta name="color-scheme" content="light">

<meta name="supported-color-schemes" content="light">

<title>Membership Activated</title>

</head>

<body style="
margin:0;
padding:0;
background:#f3f5f7 !important;
font-family:Arial,Helvetica,sans-serif;
color:#111111 !important;
">

<table
width="100%"
border="0"
cellpadding="0"
cellspacing="0"
style="
background:#f3f5f7 !important;
padding:40px 10px;
">

<tr>

<td align="center">

<table
width="680"
border="0"
cellpadding="0"
cellspacing="0"
style="
background:#ffffff !important;
border-radius:24px;
overflow:hidden;
box-shadow:0 12px 35px rgba(0,0,0,.18);
">

<!-- ===========================
HEADER
=========================== -->

<tr>

<td
align="center"
style="
background:#0D0D0D !important;
padding:45px 30px;
">

<img
src="https://raw.githubusercontent.com/realhimanshujha/100Miles-Cricket-Arena/main/assets/images/logo.jpeg"
width="95"
height="95"
style="
display:block;
border-radius:50%;
border:4px solid #F5C542;
">

<div
style="
height:20px;
line-height:20px;
font-size:20px;
">
&nbsp;
</div>

<div
style="
font-size:34px;
font-weight:700;
color:#F5C542 !important;
">

100Miles Cricket Arena

</div>

<div
style="
margin-top:8px;
font-size:18px;
color:#FFFFFF !important;
">

TRAIN HARD. PLAY BETTER.

</div>

</td>

</tr>

<!-- ===========================
WELCOME
=========================== -->

<tr>

<td
style="
padding:45px 45px 25px 45px;
background:#FFFFFF !important;
color:#111111 !important;
">

<h1
style="
margin:0;
font-size:32px;
font-weight:700;
color:#111111 !important;
">

🏏 Membership Activated

</h1>

<p
style="
margin-top:25px;
font-size:18px;
line-height:34px;
color:#222222 !important;
">

Hello
<strong>${member.name}</strong>,

</p>

<p
style="
font-size:17px;
line-height:34px;
color:#444444 !important;
">

Congratulations!

Welcome to the
<strong>100Miles Cricket Arena</strong>
family.

Your membership has been successfully activated and is now ready to use.

Thank you for choosing us as your cricket training destination.

</p>

</td>

</tr>

<!-- ===========================
DIGITAL MEMBERSHIP CARD
=========================== -->

<tr>

<td
style="
padding:0 45px 40px 45px;
background:#FFFFFF !important;
">

<table
width="100%"
border="0"
cellpadding="0"
cellspacing="0"
style="
background:#111111 !important;
border-radius:20px;
overflow:hidden;
border:2px solid #F5C542;
">

<tr>

<td
style="
padding:35px;
">

<div
style="
font-size:26px;
font-weight:bold;
color:#F5C542 !important;
">

🏏 DIGITAL MEMBERSHIP

</div>

<div
style="
margin-top:22px;
font-size:22px;
font-weight:bold;
color:#FFFFFF !important;
">

${member.name}

</div>

<div
style="
margin-top:6px;
font-size:14px;
color:#CCCCCC !important;
">

Member ID

</div>

<div
style="
font-size:26px;
letter-spacing:3px;
font-weight:bold;
color:#F5C542 !important;
">

${member.memberID}

</div>

<table
width="100%"
border="0"
cellpadding="0"
cellspacing="0"
style="
margin-top:30px;
">

<tr>

<td
style="
color:#BBBBBB !important;
font-size:14px;
">

PLAN

<br><br>

<span
style="
font-size:20px;
font-weight:bold;
color:#F5C542 !important;
">

${member.plan}

</span>

</td>

<td
style="
color:#BBBBBB !important;
font-size:14px;
">

OVERS / DAY

<br><br>

<span
style="
font-size:20px;
font-weight:bold;
color:#F5C542 !important;
">

${member.oversPerDay}

</span>

</td>

<td
style="
color:#BBBBBB !important;
font-size:14px;
">

TOTAL OVERS

<br><br>

<span
style="
font-size:20px;
font-weight:bold;
color:#F5C542 !important;
">

${member.totalOvers}

</span>

</td>

</tr>

</table>

</td>

</tr>

</table>

</td>

</tr>

<!-- ===========================
MEMBERSHIP DETAILS
=========================== -->

<tr>

<td
style="
padding:0 45px 40px 45px;
background:#FFFFFF !important;
">

<h2
style="
margin:0 0 25px;
font-size:28px;
color:#111111 !important;
">

📋 Membership Details

</h2>

<table
width="100%"
border="0"
cellpadding="14"
cellspacing="0"
style="
border-collapse:collapse;
border:1px solid #E6E6E6;
background:#FFFFFF !important;
">

<tr style="background:#F8F8F8 !important;">

<td
style="
width:45%;
font-weight:bold;
color:#111111 !important;
border-bottom:1px solid #E6E6E6;
">

Member ID

</td>

<td
style="
color:#333333 !important;
border-bottom:1px solid #E6E6E6;
">

${member.memberID}

</td>

</tr>

<tr>

<td
style="
font-weight:bold;
color:#111111 !important;
border-bottom:1px solid #E6E6E6;
">

Member Name

</td>

<td
style="
color:#333333 !important;
border-bottom:1px solid #E6E6E6;
">

${member.name}

</td>

</tr>

<tr style="background:#F8F8F8 !important;">

<td
style="
font-weight:bold;
color:#111111 !important;
border-bottom:1px solid #E6E6E6;
">

Membership Plan

</td>

<td
style="
font-weight:bold;
color:#D4A017 !important;
border-bottom:1px solid #E6E6E6;
">

${member.plan}

</td>

</tr>

<tr>

<td
style="
font-weight:bold;
color:#111111 !important;
border-bottom:1px solid #E6E6E6;
">

Join Date

</td>

<td
style="
color:#333333 !important;
border-bottom:1px solid #E6E6E6;
">

${member.joinDate}

</td>

</tr>

<tr style="background:#F8F8F8 !important;">

<td
style="
font-weight:bold;
color:#111111 !important;
border-bottom:1px solid #E6E6E6;
">

Expiry Date

</td>

<td
style="
color:#333333 !important;
border-bottom:1px solid #E6E6E6;
">

${member.expiryDate}

</td>

</tr>

<tr>

<td
style="
font-weight:bold;
color:#111111 !important;
border-bottom:1px solid #E6E6E6;
">

Membership Fee

</td>

<td
style="
font-weight:bold;
color:#0A8F3D !important;
border-bottom:1px solid #E6E6E6;
">

₹${member.amount}

</td>

</tr>

<tr style="background:#F8F8F8 !important;">

<td
style="
font-weight:bold;
color:#111111 !important;
border-bottom:1px solid #E6E6E6;
">

Overs Per Day

</td>

<td
style="
font-weight:bold;
color:#333333 !important;
border-bottom:1px solid #E6E6E6;
">

${member.oversPerDay}

</td>

</tr>

<tr>

<td
style="
font-weight:bold;
color:#111111 !important;
">

Total Overs

</td>

<td
style="
font-weight:bold;
color:#333333 !important;
">

${member.totalOvers}

</td>

</tr>

</table>

</td>

</tr>

<!-- ===========================
BENEFITS
=========================== -->

<tr>

<td
style="
padding:0 45px 40px;
background:#FFFFFF !important;
">

<div
style="
background:#FFF8E6 !important;
border-left:6px solid #F5C542;
padding:30px;
border-radius:14px;
">

<h2
style="
margin:0 0 20px;
font-size:28px;
color:#111111 !important;
">

⭐ Membership Benefits

</h2>

<table
width="100%"
border="0"
cellpadding="8"
cellspacing="0">

<tr>

<td style="font-size:17px;color:#222222 !important;">
🏏 Daily Practice Sessions
</td>

</tr>

<tr>

<td style="font-size:17px;color:#222222 !important;">
🤖 Bowling Machine Included
</td>

</tr>

<tr>

<td style="font-size:17px;color:#222222 !important;">
⚡ Priority Slot Booking
</td>

</tr>

<tr>

<td style="font-size:17px;color:#222222 !important;">
🎯 Track Remaining Overs Online
</td>

</tr>

<tr>

<td style="font-size:17px;color:#222222 !important;">
📅 Easy Membership Management
</td>

</tr>

<tr>

<td style="font-size:17px;color:#222222 !important;">
🏆 Premium Cricket Training Experience
</td>

</tr>

</table>

</div>

</td>

</tr>

<!-- ===========================
CALL TO ACTION
=========================== -->

<tr>

<td
align="center"
style="
background:#FFFFFF !important;
padding:10px 45px 45px;
">

<p
style="
font-size:18px;
line-height:34px;
color:#444444 !important;
margin:0 0 30px;
">

Your membership is now active.

Click the button below to reserve your next practice session and continue improving your game.

</p>

<a
href="https://realhimanshujha.github.io/100Miles-Cricket-Arena/book-now.html"
style="
display:inline-block;
background:#F5C542 !important;
color:#111111 !important;
text-decoration:none;
font-size:18px;
font-weight:bold;
padding:18px 42px;
border-radius:10px;
">

🏏 Book Practice Session

</a>

</td>

</tr>

<!-- ===========================
THANK YOU
=========================== -->

<tr>

<td
style="
background:#FFFFFF !important;
padding:0 45px 40px;
">

<div
style="
background:#F7F7F7 !important;
border-radius:16px;
padding:30px;
text-align:center;
">

<h2
style="
margin:0;
font-size:28px;
color:#111111 !important;
">

Thank You!

</h2>

<p
style="
margin-top:18px;
font-size:17px;
line-height:32px;
color:#444444 !important;
">

Thank you for becoming a valued member of
<strong style="color:#111111 !important;">100Miles Cricket Arena</strong>.

We look forward to helping you improve your cricket skills and enjoy an exceptional training experience.

</p>

</div>

</td>

</tr>

<!-- ===========================
FOOTER
=========================== -->

<tr>

<td
style="
background:#111111 !important;
padding:40px;
text-align:center;
">

<div
style="
font-size:28px;
font-weight:bold;
color:#F5C542 !important;
">

🏏 100Miles Cricket Arena

</div>

<div
style="
margin-top:12px;
font-size:18px;
color:#FFFFFF !important;
">

Train Hard. Play Better.

</div>

<hr
style="
border:none;
border-top:1px solid #333333;
margin:30px 0;
">

<table
width="100%"
border="0"
cellpadding="8"
cellspacing="0">

<tr>

<td
align="center"
style="
font-size:16px;
color:#DDDDDD !important;
line-height:30px;
">

📍 Guwahati, Assam

<br>

📞 +91 7002869146

<br>

📧 support@100milescricketarena.com

<br>

🌐 https://realhimanshujha.github.io/100Miles-Cricket-Arena/

</td>

</tr>

</table>

<div
style="
margin-top:30px;
font-size:14px;
color:#999999 !important;
line-height:26px;
">

This is an automated email confirming your membership activation.

Please do not reply to this email.

</div>

<div
style="
margin-top:15px;
font-size:13px;
color:#777777 !important;
">

© ${new Date().getFullYear()} 100Miles Cricket Arena.
All Rights Reserved.

</div>

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
    to: member.email,
    subject: "🏏 Welcome to 100Miles Cricket Arena",
    htmlBody: html
  });

}

function verifyMembership(memberID, phone){

    const sheet = SpreadsheetApp.getActive()
        .getSheetByName("Membership");

    const data = sheet.getDataRange().getValues();

    for(let i=1;i<data.length;i++){

        if(

            data[i][0] == memberID &&
            data[i][2] == phone &&
            data[i][7] == "Active"

        ){

            return{

                success:true,

                member:{

                    memberID:data[i][0],

                    name:data[i][1],

                    plan:data[i][3],

                    oversPerDay:data[i][8],

                    totalOvers:data[i][9],

                    usedOvers:data[i][10],

                    remainingOvers:data[i][11]

                }

            };

        }

    }

    return{

        success:false,

        message:"Invalid Membership ID or Phone Number."

    };

}