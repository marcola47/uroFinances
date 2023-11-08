import { NextRequest, NextResponse } from "next/server";

import dbConnection from "@/libs/configs/dbConnection";
import { getMonthRange } from "@/libs/helpers/dateFunctions";
import Transaction from "@/app/models/Transaction";

export async function GET(req: NextRequest) {
  try {
    await dbConnection();

    const { searchParams } = new URL(req.url);
    const user = searchParams.get('user');
    const type = searchParams.get('type');
    const date = searchParams.get('date');
    const { startDate, endDate } = getMonthRange(new Date(date!));

    const transactions = await Transaction.find({ 
      user: user, 
      type: type, 
      due_date: { 
        $gte: startDate, 
        $lte: endDate 
      } 
    }).sort({ due_date: 1 });

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