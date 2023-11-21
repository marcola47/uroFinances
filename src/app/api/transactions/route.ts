import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from 'uuid';

import { TUUID, TTransaction } from "@/types/types";
import Transaction from "@/app/models/Transaction";
import dbConnection from "@/libs/configs/dbConnection";

export async function GET(req: NextRequest) {
  try {
    await dbConnection();

    const { searchParams } = new URL(req.url);
    const user = searchParams.get('user');

    const transactions = await Transaction.find({ user: user }).lean().select('-_id -__v');
    return NextResponse.json({ 
      status: 200, 
      data: transactions
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
  // use transactions
  try {
    await dbConnection();
    const { transaction } = await req.json();
    let newTransactions: TTransaction[] = [];

    if (transaction.stallments_count) {
      let stallmentPeriodOffset = 0;
      switch (transaction.stallment_period) {
        case "monthly"    : stallmentPeriodOffset = 1;  break;
        case "quarterly"  : stallmentPeriodOffset = 3;  break;
        case "semi-annual": stallmentPeriodOffset = 6;  break;
        case "annual"     : stallmentPeriodOffset = 12; break;
        default: stallmentPeriodOffset = 1;
      }

      const amountPerStallment = parseFloat((transaction.amount / transaction.stallments_count).toFixed(2));
      let stallmentID: TUUID;

      for (let i = 0; i < transaction.stallments_count; i++) {
        const newTransactionID = uuid();
        const curDate = new Date(transaction.due_date);
        curDate.setMonth(curDate.getMonth() + i * stallmentPeriodOffset);

        if (i === 0) 
          stallmentID = newTransactionID;

        const newTransaction = {
          id: newTransactionID,
          name: `${transaction.name} ${i+1}/${transaction.stallments_count}`,
          user: "2f713bd2-2a04-46d7-930b-bba65597fd46",
          account: transaction.account,
          type: transaction.type,
          category: transaction.category,
          amount: amountPerStallment,
          due_date: curDate,
          reg_date: new Date(transaction.due_date),
          confirmation_date: (i === 0 && transaction.confirmation_date) ? new Date(transaction.confirmation_date) : undefined,
          recurrence: undefined,
          stallments: stallmentID,
          stallments_count: transaction.stallments_count,
          stallments_current: i + 1,
          stallments_period: transaction.stallments_period
        }

        newTransactions.push(newTransaction);
      }

      newTransactions = await Transaction.insertMany(newTransactions);
    }

    else {
      const newTransaction = await Transaction.create({
        name: transaction.name,
        user: "2f713bd2-2a04-46d7-930b-bba65597fd46",
        account: transaction.account,
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        due_date: new Date(transaction.due_date),
        reg_date: new Date(transaction.due_date),
        confirmation_date: transaction.confirmation_date ? new Date(transaction.confirmation_date) : undefined,
        recurrence: transaction.recurrence,
        stallments: undefined,
        stallments_count: undefined,
        stallments_current: undefined,
        stallments_period: undefined
      })

      newTransactions.push(newTransaction);
    }

    console.log(newTransactions);
    return NextResponse.json({
      status: 200,
      data: newTransactions
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
  return NextResponse.json({ status: 200, data: "Hello world" })
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnection();
    const { id } = await req.json();

    const deletedTransaction = await Transaction.findOneAndDelete({ id: id });

    if (!deletedTransaction)
      throw new Error("Transaction not found")

    return NextResponse.json({ status: 200 })
  }

  catch (err) {
    console.log(err);

    return NextResponse.json({ 
      status: 500,
      error: err 
    })
  }
}