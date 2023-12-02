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

  catch (err: any) {
    console.log(err);

    return NextResponse.json({ 
      status: 500, 
      error: err.message || err
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnection();
    const { transaction } = await req.json();

    const newTransaction = await Transaction.create({
      name: transaction.name,
      user: transaction.user,
      account: transaction.account,
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      due_date: new Date(transaction.due_date),
      reg_date: new Date(transaction.reg_date),
      confirmation_date: transaction.confirmation_date ? new Date(transaction.confirmation_date) : undefined,
    })

    return NextResponse.json({ 
      status: 200, 
      data: newTransaction
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

export async function PUT(req: NextRequest) {
  try {
    await dbConnection();
    const { transaction } = await req.json();

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { id: transaction.id },
      {
        name: transaction.name,
        user: transaction.user,
        account: transaction.account,
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        due_date: new Date(transaction.due_date),
        reg_date: new Date(transaction.reg_date),
        confirmation_date: transaction.confirmation_date ? new Date(transaction.confirmation_date) : undefined,
      },
      { new: true }
    )

    if (!updatedTransaction)
      throw new Error("Transaction not found")

    return NextResponse.json({
      status: 200,
      data: updatedTransaction
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

export async function DELETE(req: NextRequest) {
  try {
    await dbConnection();
    const { transaction } = await req.json();
    const deletedTransaction = await Transaction.findOneAndDelete({ id: transaction });

    if (!deletedTransaction)
      throw new Error("Transaction not found");

    return NextResponse.json({
      status: 200,
      data: deletedTransaction.id
    })
  }

  catch (err: any) {
    console.log(err);

    return NextResponse.json({ 
      status: 500,
      error: err.message
    })
  }
}