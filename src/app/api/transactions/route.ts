import { NextRequest, NextResponse } from "next/server";

import Transaction from "@/app/models/Transaction";
import Recurrence from "@/app/models/Recurrence";

import dbConnection from "@/libs/configs/dbConnection";
import { getMonthRange } from "@/libs/helpers/dateFunctions";


export async function GET(req: NextRequest) {
  try {
    await dbConnection();

    const { searchParams } = new URL(req.url);
    const user = searchParams.get('user');
    const date = searchParams.get('date');
    const { startDate, endDate } = getMonthRange(new Date(date!));

    const transactions = await Transaction.find({ 
      user: user, 
      due_date: { $gte: startDate, $lte: endDate } 
    })
    .lean()
    .select('-_id -__v');

    const recurrences = await Recurrence.find({ user: user })
    .lean()
    .select('-_id -__v');

    return NextResponse.json({ 
      status: 200, 
      data: { transactions, recurrences }
    })
  }

  catch (err) {
    console.log(err);
    return NextResponse.json({ 
      status: 500, 
      err: err 
    })
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnection();
    const { transaction, operation } = await req.json();

    if (operation === 'create') {
      const newTransaction = new Transaction(transaction);
      await newTransaction.save();
      
      return NextResponse.json({ status: 200, data: newTransaction })
    }

    else if (operation === 'update') {
      const updatedTransaction = await Transaction.findOneAndUpdate(
        { id: transaction.id }, 
        transaction,
        { new: true, runValidators: true, select: '-_id -__v' }
      );
      
      if (!updatedTransaction)
        throw new Error("Transaction not found")

      return NextResponse.json({ 
        status: 200, 
        data: updatedTransaction 
      })
    }

    else 
      throw new Error("Invalid operation type");
  }

  catch (err) {
    console.log(err);

    return NextResponse.json({ 
      status: 500,
      err: err 
    })
  }
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
      err: err 
    })
  }
}