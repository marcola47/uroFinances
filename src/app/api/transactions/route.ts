import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from 'uuid';

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
      let stallmentsPeriodOffset = 0;
      switch (transaction.stallments_period) {
        case "monthly"    : stallmentsPeriodOffset = 1;  break;
        case "quarterly"  : stallmentsPeriodOffset = 3;  break;
        case "semi-annual": stallmentsPeriodOffset = 6;  break;
        case "annual"     : stallmentsPeriodOffset = 12; break;
        default: stallmentsPeriodOffset = 1;
      }

      console.log(transaction.stallments_period)
      console.log(stallmentsPeriodOffset)

      const amountPerStallment = parseFloat((transaction.amount / transaction.stallments_count).toFixed(2));
      let stallmentID: TUUID;

      for (let i = 0; i < transaction.stallments_count; i++) {
        const newTransactionID = uuid();
        const curDate = new Date(transaction.due_date);
        curDate.setMonth(curDate.getMonth() + i * stallmentsPeriodOffset);

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
  try {
    await dbConnection();
    const { transaction } = await req.json();
    const newTransactions: TTransaction[] = []; 

    if (transaction.stallments) {

    }

    else {
      const updatedTransaction = await Transaction.findOneAndUpdate(
        { id: transaction.id },
        {
          name: transaction.name,
          user: transaction.user,
          account: transaction.account,
          type: transaction.type,
          category: transaction.category,
          amount: transaction.amount,
          due_date: transaction.due_date,
          confirmation_date: transaction.confirmation_date,
          recurrence: transaction.recurrence,
          stallments: transaction.stallments,
        },
        { new: true }
      )

      if (!updatedTransaction)
        throw new Error("Transaction not found")

      newTransactions.push(updatedTransaction);
    }

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

export async function DELETE(req: NextRequest) {
  try {
    await dbConnection();
    const { transaction } = await req.json();
    const deletedTransactions: TTransaction[] = [];
    
    const deletedTransaction = await Transaction.findOneAndDelete({ id: transaction.id });
    deletedTransactions.push(deletedTransaction);

    return NextResponse.json({ 
      status: 200, 
      data: deletedTransactions
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