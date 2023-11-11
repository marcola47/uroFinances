import { NextRequest, NextResponse } from "next/server";

import dbConnection from "@/libs/configs/dbConnection";
import { getMonthRange } from "@/libs/helpers/dateFunctions";
import Transaction from "@/app/models/Transaction";

export async function GET(req: NextRequest) {
  try {
    await dbConnection();

    const { searchParams } = new URL(req.url);
    const user = searchParams.get('user');
    const date = searchParams.get('date');
    const { startDate, endDate } = getMonthRange(new Date(date!));

    const transactions = await Transaction.find({ 
      user: user, 
      $or: [
        { 
          due_date: { 
            $gte: startDate, 
            $lte: endDate 
          } 
        },
        { 
          recurring: true, 
          $and: [
            { 'recurring_months': { $in: [startDate.getMonth() + 1] } },
            { 'due_date': { $lte: endDate } }
          ] 
        }
      ]
    })
    .lean()
    .select('-_id -__v');

    return NextResponse.json({ 
      status: 200, 
      err: null, 
      data: transactions
    })
  }

  catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500, err: err })
  }
}