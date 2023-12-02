import { NextRequest, NextResponse } from "next/server";
import Recurrence from "@/app/models/Recurrence";
import Transaction from "@/app/models/Transaction";

export async function POST(req: NextRequest, { params }: { params: { recurrence: string } }) {
  try {
    const { recurrence } = params;
    const { due_date, confirmation_date } = await req.json();
  
    const recurrenceDoc = await Recurrence.findOne({ id: recurrence });
  
    const transaction = await Transaction.create({
      name: recurrenceDoc.name,
      user: recurrenceDoc.user,
      account: recurrenceDoc.account,
      type: recurrenceDoc.type,
      category: recurrenceDoc.category,
      amount: recurrenceDoc.amount,
      reg_date: new Date(confirmation_date),
      due_date: new Date(due_date),
      confirmation_date: new Date(confirmation_date),
      recurrence: recurrenceDoc.id,
    })

    return NextResponse.json({ 
      status: 200, 
      error: null, 
      data: transaction 
    })
  }

  catch (err: any) {
    console.log(err);

    return NextResponse.json({ 
      status: 500, 
      error: err.message || err
    });
  }
}