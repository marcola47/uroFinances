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

  catch (err: any) {
    console.log(err);

    return NextResponse.json({ 
      status: 500, 
      error: err.message || err
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
    const { recurrence, updateType, transaction, confirmationDate, currentDate } = await req.json(); 
    let dbTransactions: TTransaction[] = [];

    if (updateType === "all")
      dbTransactions = await Transaction.find({ recurrence: recurrence.id });

    else if (updateType === "future") {
      dbTransactions = await Transaction.find({ 
        recurrence: recurrence.id, 
        confirmation_date: { $gte: new Date(currentDate) } 
      });
    }

    const updatedTransactions = dbTransactions.map(t => {
      t.name = recurrence.name;
      t.user = recurrence.user;
      t.account = recurrence.account;
      t.category = recurrence.category;
      t.amount = recurrence.amount;
      
      return t;
    })
    
    for (let i = 0; i < updatedTransactions.length; i++) {
      if (updatedTransactions[i].id === transaction && !confirmationDate)
        await Transaction.findOneAndDelete({ id: updatedTransactions[i].id });
      
      else
        await Transaction.findOneAndReplace({ id: updatedTransactions[i].id }, updatedTransactions[i]);
    }
    
    // FIX: do something about updating the due_date
    const updatedRecurrence = await Recurrence.findOneAndUpdate(
      { id: recurrence.id },
      {
        name: recurrence.name,
        user: recurrence.user,
        account: recurrence.account,
        category: recurrence.category,
        amount: recurrence.amount,
        reg_date: recurrence.reg_date,
        due_date: recurrence.due_date,
        recurrence_period: recurrence.recurrence_period
      },
      { new: true }
    );

    return NextResponse.json({
      status: 200,
      data: {
        recurrence: updatedRecurrence,
        transactions: updatedTransactions
      }
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
    const { recurrence, transaction, deleteType } = await req.json();
    let deletedTransactions: TTransaction[] = [];

    if (deleteType === "All transactions") {
      deletedTransactions = await Transaction.find({ recurrence: recurrence });
      await Transaction.deleteMany({ recurrence: recurrence });
    }

    else if (deleteType === "Future transactions") {
      const curTransaction = await Transaction.findOne({ id: transaction });

      deletedTransactions = await Transaction.find({
        recurrence: recurrence,
        due_date: { $gte: curTransaction.due_date }
      })

      await Transaction.deleteMany({
        recurrence: recurrence,
        due_date: { $gte: curTransaction.due_date }
      })
    }

    const deletedRecurrence = await Recurrence.findOneAndDelete({ id: recurrence });

    if (!deletedRecurrence && !deletedTransactions)
      throw new Error("Recurrence and transactions not found");

    return NextResponse.json({ 
      status: 200, 
      data: {
        recurrence: deletedRecurrence?.id,
        transactions: deletedTransactions.length > 0 ? deletedTransactions.map(t => t.id) : []
      }
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