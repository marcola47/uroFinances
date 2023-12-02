import { NextRequest, NextResponse } from "next/server";
import Transaction from "@/app/models/Transaction";

export async function PUT(req: NextRequest, { params }: { params: { transaction: string } }) {
  try {
    const { transaction } = params;
    const { confirmation_date, recurrence } = await req.json();

    if (recurrence) // you can only unconfirm a recurring transaction
      await Transaction.findOneAndDelete({ id: transaction });
    
    else {
      await Transaction.findOneAndUpdate(
        { id: transaction }, 
        { confirmation_date: confirmation_date ? new Date(confirmation_date) : null }
      );
    }
    
    return NextResponse.json({ status: 200, err: null, data: null })
  }

  catch (err: any) {
    console.log(err);

    return NextResponse.json({ 
      status: 500, 
      error: err.message || err
    });
  }
}