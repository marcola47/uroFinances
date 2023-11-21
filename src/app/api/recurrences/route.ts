import { NextRequest, NextResponse } from "next/server";

import dbConnection from "@/libs/configs/dbConnection";
import Recurrence from "@/app/models/Recurrence";
import Transaction from "@/app/models/Transaction";

export async function GET(req: NextRequest) {
  try {
    await dbConnection();

    const { searchParams } = new URL(req.url);
    const user = searchParams.get('user');

    const recurrences = await Recurrence.find({ user: user }).lean().select('-_id -__v');
    return NextResponse.json({ 
      status: 200, 
      data: recurrences 
    })
  }

  catch (err) {
    console.log(err);
    return NextResponse.json({ 
      status: 500, 
      error: err 
    })
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnection();
    const { recurrence } = await req.json();
    let newTransaction;

    const newRecurrence = await Recurrence.create({
      name: recurrence.name,
      user: recurrence.user,
      account: recurrence.account,
      type: recurrence.type,
      category: recurrence.category,
      amount: recurrence.amount,
      reg_date: recurrence.reg_date,
      due_date: recurrence.due_date,
      recurrence_period: recurrence.recurrence_period
    })

    if (recurrence.confirmation_date) {
      newTransaction = await Transaction.create({
        name: recurrence.name,
        user: recurrence.user,
        account: recurrence.account,
        type: recurrence.type,
        category: recurrence.category,
        amount: recurrence.amount,
        reg_date: recurrence.reg_date,
        due_date: recurrence.due_date,
        confirmation_date: new Date(recurrence.confirmation_date),
        recurrence: newRecurrence.id,
      })
    }

    return NextResponse.json({ 
      status: 200, 
      data: { recurrence: newRecurrence, transaction: newTransaction } 
    })
  }

  catch (err) {
    console.log(err);
    return NextResponse.json({ 
      status: 500, 
      error: err 
    })
  }
}