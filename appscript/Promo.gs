function createPromocode(data){

  Logger.log(data);

  const sheet = getSheet("Promocodes");

  data.code = String(data.code)
              .trim()
              .toUpperCase();

  const values = sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues();

  const exists = values.some(r =>

      String(r[0]).toUpperCase().trim() ===
      String(data.code).toUpperCase().trim()

  );

  if(exists){

      return{

          success:false,

          message:"Promocode already exists."

      };

  }

  sheet.appendRow([
    data.code,
    data.type,
    data.value,
    data.minBooking,
    data.maxDiscount,
    data.usage,
    data.usageLimit,
    data.expiry,
    data.status,
    new Date(),
    "Admin",
    data.paymentRule
  ]);

  return {
    success:true,
    message:"Promocode created successfully."
  };

}

function getPromocodes() {

  updateExpiredPromocodes();

  const sheet = getSheet("Promocodes");
  const data = sheet.getDataRange().getValues();

  const result = [];

  for (let i = 1; i < data.length; i++) {

    if (!data[i][0]) continue;   // Skip rows where Code is empty

    result.push({

      row: i + 1,

      code: data[i][0],
      type: data[i][1],
      value: data[i][2],
      minBooking: data[i][3],
      maxDiscount: data[i][4],
      usage: data[i][5],
      usageLimit: data[i][6],
      expiry: data[i][7],
      status: data[i][8],
      createdAt: data[i][9],
      createdBy: data[i][10],
      paymentRule: data[i][11]

    });

  }

  return {

    success: true,

    promocodes: result

  };

}

function updatePromocode(data){

  data.code = String(data.code)
              .trim()
              .toUpperCase();

  const sheet = getSheet("Promocodes");

  const values = sheet.getDataRange().getValues();

  // Check duplicate code (ignore current row)
  for(let i = 1; i < values.length; i++){

    if(i + 1 == data.row) continue;

    const existingCode = String(values[i][0]).trim().toUpperCase();

    const newCode = String(data.code).trim().toUpperCase();

    if(existingCode == newCode){

      return{

        success:false,

        message:"Promocode already exists."

      };

    }

  }

  sheet.getRange(data.row,1).setValue(data.code);
  sheet.getRange(data.row,2).setValue(data.type);
  sheet.getRange(data.row,3).setValue(data.value);
  sheet.getRange(data.row,4).setValue(data.minBooking);
  sheet.getRange(data.row,5).setValue(data.maxDiscount);
  sheet.getRange(data.row,7).setValue(data.usageLimit);
  sheet.getRange(data.row,8).setValue(data.expiry);
  sheet.getRange(data.row,9).setValue(data.status);
  sheet.getRange(data.row,12).setValue(data.paymentRule);

  return{

    success:true,

    message:"Promocode updated successfully."

  };

}

function deletePromocode(row){

  const sheet = getSheet("Promocodes");

  sheet.deleteRow(Number(row));

  return{

    success:true

  };

}


function updateExpiredPromocodes() {

  const sheet = getSheet("Promocodes");

  const data = sheet.getDataRange().getValues();

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  for (let i = 1; i < data.length; i++) {

    const expiry = new Date(data[i][7]);

    expiry.setHours(0, 0, 0, 0);

    const status = data[i][8];

    if (status === "Active" && expiry < today) {

      sheet.getRange(i + 1, 9).setValue("Expired");

    }

  }

}

function applyPromocode(code, amount){

  const sheet = getSheet("Promocodes");
  const rows = sheet.getDataRange().getValues();

  code = String(code).trim().toUpperCase();
  amount = Number(amount);

  const today = new Date();
  today.setHours(0,0,0,0);

  for(let i=1;i<rows.length;i++){

    const promoCode = String(rows[i][0]).trim().toUpperCase();

    if(promoCode !== code) continue;

    const type = rows[i][1];
    const value = Number(rows[i][2]);

    const minBooking = Number(rows[i][3]);

    const maxDiscount = Number(rows[i][4]);

    const usage = Number(rows[i][5]);

    const usageLimit = Number(rows[i][6]);

    const expiry = new Date(rows[i][7]);
    expiry.setHours(0,0,0,0);

    const status = String(rows[i][8]).trim();

    const paymentRule = String(rows[i][11]).trim();

    if(status !== "Active"){

      return{
        success:false,
        message:"Promo Code is disabled."
      };

    }

    if(expiry < today){

      return{
        success:false,
        message:"Promo Code has expired."
      };

    }

    if(usage >= usageLimit){

      return{
        success:false,
        message:"Promo usage limit reached."
      };

    }

    if(amount < minBooking){

      return{
        success:false,
        message:`Minimum booking ₹${minBooking}`
      };

    }

    let discount = 0;

    if(type === "Fixed"){

      discount = value;

    }else{

      discount = amount * value / 100;

      if(discount > maxDiscount){

        discount = maxDiscount;

      }

    }

    const finalAmount = Math.max(0, amount - discount);

    return{

      success:true,

      discount:discount,

      finalAmount:finalAmount,

      paymentRule:paymentRule,

      message:"Promo Applied Successfully"

    };

  }

  // =======================================
  // CHECK REDEEMED COUPONS
  // =======================================

  const rewardSheet = getSheet("RedeemedCoupons");

  const rewardRows = rewardSheet.getDataRange().getValues();

  for(let i=1;i<rewardRows.length;i++){

      const coupon = String(rewardRows[i][0]).trim().toUpperCase();

      if(coupon !== code){

          continue;

      }

      const reward = String(rewardRows[i][3]).trim();

      const status = String(rewardRows[i][5]).trim();

      const expiry = new Date(rewardRows[i][7]);

      expiry.setHours(0,0,0,0);

      if(status !== "Unused"){

          return{

              success:false,

              message:"This reward coupon has already been used."

          };

      }

      if(expiry < today){

          return{

              success:false,

              message:"Reward coupon has expired."

          };

      }

      let discount = 0;

      let finalAmount = amount;

      switch(reward){

          case "OFF15":

              discount = Number((amount * 0.15).toFixed(2));

              finalAmount = amount - discount;

              break;

          case "FREE5":

              finalAmount = 0;

              discount = amount;

              break;

          case "FREE10":

              finalAmount = 0;

              discount = amount;

              break;

          case "FREE20":

              finalAmount = 0;

              discount = amount;

              break;

      }

      return{

          success:true,

          isRewardCoupon:true,

          row:i+1,

          reward:reward,

          discount:discount,

          finalAmount:Math.max(0,finalAmount),

          message:"Reward Coupon Applied"

      };

  }

  return{

    success:false,

    message:"Invalid Promo Code"

  };

}

function increasePromoUsage(code){

  if(!code) return;

  const sheet = getSheet("Promocodes");

  const rows = sheet.getDataRange().getValues();

  code = String(code).trim().toUpperCase();

  for(let i=1;i<rows.length;i++){

    const promoCode =
      String(rows[i][0]).trim().toUpperCase();

    if(promoCode === code){

      const usage = Number(rows[i][5]) || 0;

      sheet.getRange(i+1,6).setValue(usage + 1);

      return;

    }

  }

}

function getAvailablePromocodes(){

    updateExpiredPromocodes();

    const sheet = getSheet("Promocodes");

    const rows = sheet.getDataRange().getValues();

    const promos = [];

    const today = new Date();
    today.setHours(0,0,0,0);

    for(let i=1;i<rows.length;i++){

        const status = String(rows[i][8]).trim();

        if(status !== "Active") continue;

        const expiry = new Date(rows[i][7]);
        expiry.setHours(0,0,0,0);

        if(expiry < today) continue;

        promos.push({

            code: rows[i][0],

            type: rows[i][1],

            value: rows[i][2],

            minBooking: rows[i][3],

            maxDiscount: rows[i][4],

            expiry: rows[i][7]

        });

    }

    return{

        success:true,

        promocodes:promos

    };

}