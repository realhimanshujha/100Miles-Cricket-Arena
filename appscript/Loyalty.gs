function verifyRedeemCard(data){

    const sheet = getSheet("Loyalty");

    const rows = sheet.getDataRange().getValues();

    const cardNo = String(data.cardNo).trim();

    const phone = String(data.phone).trim();

    const requiredPoints = Number(data.points);

    const today = new Date();

    today.setHours(0,0,0,0);

    for(let i=1;i<rows.length;i++){

        const row = rows[i];

        if(String(row[0]).trim() !== cardNo){

            continue;

        }

        if(String(row[2]).trim() !== phone){

            return{

                success:false,

                message:"Phone number does not match this loyalty card."

            };

        }

        if(row[5] !== "Active"){

            return{

                success:false,

                message:"This loyalty card is inactive."

            };

        }

        const expiry = new Date(row[7]);

        expiry.setHours(0,0,0,0);

        if(expiry < today){

            return{

                success:false,

                message:"Your loyalty card has expired."

            };

        }

        const currentPoints = Number(row[3]);

        if(currentPoints < requiredPoints){

            return{

                success:false,

                message:`You need ${requiredPoints-currentPoints} more points.`

            };

        }

        return{

            success:true,

            name:row[1],

            points:currentPoints,

            cardNo:row[0]

        };

    }

    return{

        success:false,

        message:"Loyalty card not found."

    };

}