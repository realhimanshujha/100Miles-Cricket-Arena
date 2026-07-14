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

      new Date()          // CreatedAt

  ]);

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

      createdAt:data[i][14]

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

          lastBookingDate:rows[i][13]

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