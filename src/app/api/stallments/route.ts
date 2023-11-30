import { NextRequest, NextResponse } from "next/server";
import { faker } from "@faker-js/faker";

import Transaction from "@/app/models/Transaction";
import dbConnection from "@/libs/configs/dbConnection";


export async function POST(req: NextRequest) {
  try {
    await dbConnection();
    const { transaction } = await req.json();
    let newTransactions: TTransaction[] = [];

    let stallmentsPeriodOffset = 0;
    switch (transaction.stallments_period) {
      case "monthly"    : stallmentsPeriodOffset = 1;  break;
      case "quarterly"  : stallmentsPeriodOffset = 3;  break;
      case "semi-annual": stallmentsPeriodOffset = 6;  break;
      case "annual"     : stallmentsPeriodOffset = 12; break;
      default: stallmentsPeriodOffset = 1;
    }

    const amountPerStallment = parseFloat((transaction.amount / transaction.stallments_count).toFixed(2));
    let stallmentID: TUUID;

    for (let i = 0; i < transaction.stallments_count; i++) {
      const newTransactionID = faker.string.uuid();
      const curDate = new Date(transaction.due_date);
      curDate.setMonth(curDate.getMonth() + i * stallmentsPeriodOffset);

      if (i === 0) 
        stallmentID = newTransactionID;

      const newTransaction = {
        id: newTransactionID,
        name: transaction.name,
        user: transaction.user,
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
    console.log(newTransactions)

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
    const { transaction, updateType } = await req.json();
    const stallmentsRoot = await Transaction.findOne({ id: transaction.stallments });
    const dbTransactions = await Transaction.find({ stallments: stallmentsRoot.id });
    let updatedTransactions: TTransaction[] = [];
    let stallmentsForInsertion: TTransaction[] = [];
    let stallmentsForDeletion: TTransaction[] = [];
    
    const curTransaction = dbTransactions.find(t => t.id === transaction.id);
    const stallmentsCountChanged = transaction.stallments_count !== stallmentsRoot.stallments_count;
    const nameChanged = curTransaction.name !== transaction.name;
    const amountChanged = curTransaction.amount !== transaction.amount;
    const accountChanged = curTransaction.account !== transaction.account;
    const dueDateChanged = new Date(curTransaction.due_date).getTime() !== new Date(transaction.due_date).getTime();
    const categoryChanged = curTransaction.category.root !== transaction.category.root
      ? true
      : curTransaction.category.child !== transaction.category.child
        ? true
        : curTransaction.category.grandchild !== transaction.category.grandchild
          ? true
          : false;

    if (transaction.stallments_count < stallmentsRoot.stallments_count)
      stallmentsForDeletion = dbTransactions.filter(t => t.stallments_current > transaction.stallments_count).map(t => t.id);

    else if (transaction.stallments_count > stallmentsRoot.stallments_count) {
      updatedTransactions = dbTransactions;

      const diff = transaction.stallments_count - stallmentsRoot.stallments_count;
      const lastStallment = dbTransactions[dbTransactions.length - 1].stallments_current + 1;
      const lastDueDate = new Date(dbTransactions[dbTransactions.length - 1].due_date);
      lastDueDate.setMonth(lastDueDate.getMonth() + 1);

      let stallmentsPeriodOffset = 0;
      switch (transaction.stallments_period) {
        case "monthly"    : stallmentsPeriodOffset = 1;  break;
        case "quarterly"  : stallmentsPeriodOffset = 3;  break;
        case "semi-annual": stallmentsPeriodOffset = 6;  break;
        case "annual"     : stallmentsPeriodOffset = 12; break;
        default: stallmentsPeriodOffset = 1;
      }

      for (let i = 0; i < diff; i++) {
        const newDueDate = new Date(lastDueDate);
        newDueDate.setMonth(lastDueDate.getMonth() + i * stallmentsPeriodOffset);

        const newStallment = new Transaction({
          name: stallmentsRoot.name,
          user: stallmentsRoot.user,
          account: stallmentsRoot.account,
          type: stallmentsRoot.type,
          amount: stallmentsRoot.amount,
          due_date: new Date(newDueDate),
          confirmation_date: undefined,
          recurrence: undefined,
          stallments: stallmentsRoot.stallments,
          stallments_count: stallmentsRoot.stallments_count,
          stallments_current: lastStallment + i,
          stallments_period: stallmentsRoot.stallments_period,
          category: {
            root: stallmentsRoot.category.root,
            child: stallmentsRoot.category.child,
            grandchild: stallmentsRoot.category.grandchild
          }
        })

        stallmentsForInsertion.push(newStallment);
      }
    }

    updatedTransactions = dbTransactions.map(t => {      
      if (updateType === "all" || (updateType === "future" && t.stallments_current >= transaction.stallments_current)) {
        if (nameChanged)
          t.name = transaction.name;

        if (amountChanged)
          t.amount = transaction.amount;

        if (accountChanged)
          t.account = transaction.account;

        if (dueDateChanged) {
          const monthOffset = t.stallments_current - transaction.stallments_current;
          const newDate = new Date(transaction.due_date);

          newDate.setMonth(newDate.getMonth() + monthOffset);
          t.due_date = new Date(newDate); 
        }

        if (categoryChanged) {
          t.category = {
            root: transaction.category.root,
            child: transaction.category.child,
            grandchild: transaction.category.grandchild
          }
        }

        if (stallmentsCountChanged)
          t.stallments_count = transaction.stallments_count;

        if (t.id === transaction.id)
          t.confirmation_date = transaction.confirmation_date;
      }

      return t;
    })

    if (stallmentsForDeletion.length > 0)
      await Transaction.deleteMany({ id: { $in: stallmentsForDeletion } });

    if (stallmentsForInsertion.length > 0)
      await Transaction.insertMany(stallmentsForInsertion);
    
    for (let i = 0; i < updatedTransactions.length; i++) 
      await Transaction.findOneAndReplace({ id: updatedTransactions[i].id }, updatedTransactions[i]);

    return NextResponse.json({
      status: 200,
      data: {
        transactions: updatedTransactions,
        stallmentsForInsertion,
        stallmentsForDeletion
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

export async function DELETE(req: NextRequest) {
  
}