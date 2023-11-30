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
    const { recurrence, confirmationDate } = await req.json();

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

    const newTransaction = confirmationDate 
    ? await Transaction.create({
        name: recurrence.name,
        user: recurrence.user,
        account: recurrence.account,
        type: recurrence.type,
        category: recurrence.category,
        amount: recurrence.amount,
        reg_date: recurrence.reg_date,
        due_date: recurrence.due_date,
        confirmation_date: new Date(confirmationDate),
        recurrence: newRecurrence.id,
      })
    : undefined

    return NextResponse.json({ 
      status: 200, 
      data: { 
        recurrence: newRecurrence, 
        transaction: newTransaction 
      } 
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

export async function PUT(req: NextRequest) {
  try {
    await dbConnection();
    const { recurrence, updateType, confirmationDate } = await req.json(); 
    let dbTransactions: TTransaction[] = [];

    if (updateType === "all")
      dbTransactions = await Transaction.find({ recurrence: recurrence.id });

    else if (updateType === "future") {
      dbTransactions = await Transaction.find({ 
        recurrence: recurrence.id, 
        due_date: { $gte: new Date() } 
      });
    }
  }

  catch(err) {
    console.log(err);

    return NextResponse.json({ 
      status: 500, 
      error: err 
    })
  }
}