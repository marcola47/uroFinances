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

// use mongo transactions
// export async function POST(req: NextRequest) {
//   try {
//     await dbConnection();
//     const { transaction, user } = await req.json();
//     let newTransactions: TTransaction[] = [];

//     if (transaction.stallments_count) {
//       let stallmentsPeriodOffset = 0;
//       switch (transaction.stallments_period) {
//         case "monthly"    : stallmentsPeriodOffset = 1;  break;
//         case "quarterly"  : stallmentsPeriodOffset = 3;  break;
//         case "semi-annual": stallmentsPeriodOffset = 6;  break;
//         case "annual"     : stallmentsPeriodOffset = 12; break;
//         default: stallmentsPeriodOffset = 1;
//       }

//       const amountPerStallment = parseFloat((transaction.amount / transaction.stallments_count).toFixed(2));
//       let stallmentID: TUUID;

//       for (let i = 0; i < transaction.stallments_count; i++) {
//         const newTransactionID = uuid();
//         const curDate = new Date(transaction.due_date);
//         curDate.setMonth(curDate.getMonth() + i * stallmentsPeriodOffset);

//         if (i === 0) 
//           stallmentID = newTransactionID;

//         const newTransaction = {
//           id: newTransactionID,
//           name: transaction.name,
//           user: user,
//           account: transaction.account,
//           type: transaction.type,
//           category: transaction.category,
//           amount: amountPerStallment,
//           due_date: curDate,
//           reg_date: new Date(transaction.due_date),
//           confirmation_date: (i === 0 && transaction.confirmation_date) ? new Date(transaction.confirmation_date) : undefined,
//           recurrence: undefined,
//           stallments: stallmentID,
//           stallments_count: transaction.stallments_count,
//           stallments_current: i + 1,
//           stallments_period: transaction.stallments_period
//         }

//         newTransactions.push(newTransaction);
//       }

//       newTransactions = await Transaction.insertMany(newTransactions);
//     }

//     else {
//       const newTransaction = await Transaction.create({
//         name: transaction.name,
//         user: user,
//         account: transaction.account,
//         type: transaction.type,
//         category: transaction.category,
//         amount: transaction.amount,
//         due_date: new Date(transaction.due_date),
//         reg_date: new Date(transaction.due_date),
//         confirmation_date: transaction.confirmation_date ? new Date(transaction.confirmation_date) : undefined,
//         recurrence: transaction.recurrence,
//         stallments: undefined,
//         stallments_count: undefined,
//         stallments_current: undefined,
//         stallments_period: undefined
//       })

//       newTransactions.push(newTransaction);
//     }

//     return NextResponse.json({
//       status: 200,
//       data: { transactions: newTransactions }
//     })
//   }

//   catch (err) {
//     console.log(err);

//     return NextResponse.json({ 
//       status: 500,
//       error: err 
//     })
//   }
// }

// export async function PUT(req: NextRequest) {
//   try {
//     await dbConnection();
//     const { transaction, updateType } = await req.json();
//     const newTransactions: TTransaction[] = []; 

//     if (transaction.stallments && updateType !== "current") {
//       const dbTransactions = await Transaction.find({ stallments: transaction.stallments })
//       let stallmentsForInsertion: TTransaction[] = [];
//       const stallmentsForDeletion: TUUID[] = [];

//       const curTransactionIndex = dbTransactions.findIndex(t => t.id === transaction.id);
//       const curTransaction = dbTransactions[curTransactionIndex];
//       const curStallmentsCount = curTransaction.stallments_count;

//       const stallmentsCountChanged = curStallmentsCount !== transaction.stallments_count; 
//       const nameChanged = curTransaction.name !== transaction.name;
//       const amountChanged = curTransaction.amount !== transaction.amount;
//       const dueDateChanged = new Date(curTransaction.due_date).getTime() !== new Date(transaction.due_date).getTime();
//       const categoryChanged = curTransaction.category.root !== transaction.category.root
//         ? true
//         : curTransaction.category.child !== transaction.category.child
//           ? true
//           : curTransaction.category.grandchild !== transaction.category.grandchild
//             ? true
//             : false;

//       // can be optimized
//       const updatedTransactions = dbTransactions.map((t, index) => {                
//         if (updateType === "all" || (updateType === "future" && index >= curTransactionIndex)) {
//           if (nameChanged)  
//             t.name = transaction.name;

//           if (amountChanged)
//             t.amount = transaction.amount;

//           if (dueDateChanged) {
//             const monthOffset = index - curTransactionIndex;
//             const newDate = new Date(transaction.due_date);
            
//             newDate.setMonth(newDate.getMonth() + monthOffset);
//             t.due_date = new Date(newDate);
//           }

//           if (t.id === transaction.id)
//             t.confirmation_date = new Date(transaction.confirmation_date);

//           if (categoryChanged) {
//             t.category.root = transaction.category.root;
//             t.category.child = transaction.category.child;
//             t.category.grandchild = transaction.category.grandchild;
//           }
//         }

//         if (stallmentsCountChanged) 
//           t.stallments_count = transaction.stallments_count;

//         return t;
//       })

//       if (stallmentsCountChanged) {
//         if (curStallmentsCount > transaction.stallments_count) 
//           updatedTransactions.map(t => { (t.stallments_current > transaction.stallments_count) && stallmentsForDeletion.push(t.id) })
        
//         else if (transaction.stallments_count > curStallmentsCount) {
//           const diff = transaction.stallments_count - curStallmentsCount;
//           const lastStallment = updatedTransactions[updatedTransactions.length - 1].stallments_current + 1;
//           const lastDueDate = new Date(updatedTransactions[updatedTransactions.length - 1].due_date);
//           lastDueDate.setMonth(lastDueDate.getMonth() + 1);

//           let stallmentsPeriodOffset = 0;
//           switch (transaction.stallments_period) {
//             case "monthly"    : stallmentsPeriodOffset = 1;  break;
//             case "quarterly"  : stallmentsPeriodOffset = 3;  break;
//             case "semi-annual": stallmentsPeriodOffset = 6;  break;
//             case "annual"     : stallmentsPeriodOffset = 12; break;
//             default: stallmentsPeriodOffset = 1;
//           }

//           for (let i = 0; i < diff; i++) {
//             const newDueDate = new Date(lastDueDate);
//             newDueDate.setMonth(lastDueDate.getMonth() + i * stallmentsPeriodOffset);

//             const newTransaction = new Transaction({
//               name: transaction.name,
//               user: transaction.user,
//               account: transaction.account,
//               type: transaction.type,
//               amount: transaction.amount,
//               due_date: new Date(newDueDate),
//               confirmation_date: undefined,
//               recurrence: undefined,
//               stallments: transaction.stallments,
//               stallments_count: transaction.stallments_count,
//               stallments_current: lastStallment + i,
//               stallments_period: transaction.stallments_period,
//               category: {
//                 root: transaction.category.root,
//                 child: transaction.category.child,
//                 grandchild: transaction.category.grandchild
//               }
//             })

//             stallmentsForInsertion.push(newTransaction);
//           }
//         }
//       }
      
//       await Transaction.deleteMany({ id: { $in: stallmentsForDeletion } });
//       stallmentsForInsertion = await Transaction.insertMany(stallmentsForInsertion);

//       for (let i = 0; i < updatedTransactions.length; i++) 
//         await Transaction.findOneAndReplace({ id: updatedTransactions[i].id }, updatedTransactions[i]);
      

//       return NextResponse.json({ 
//         status: 200, 
//         data: { 
//           transactions: updatedTransactions,
//           forInsertion: stallmentsForInsertion, 
//           forDeletion: stallmentsForDeletion
//         } 
//       })
//     }

//     else if (transaction.stallments && updateType === "current") {
//       const dbStallmentsRoot = await Transaction.findOne({ id: transaction.stallments });
//       let stallmentsForInsertion: TTransaction[] = [];
//       const stallmentsForDeletion: TUUID[] = [];
//       let updatedTransactions: TTransaction[] = [];

//       if (transaction.stallments_count !== dbStallmentsRoot.stallments_count) {
//         const dbStallments = await Transaction.find({ stallments: transaction.stallments });

//         updatedTransactions = dbStallments.map(t => {
//           if (t.id === transaction.id) {
//             t.name = transaction.name,
//             t.user = transaction.user,
//             t.account = transaction.account,
//             t.type = transaction.type,
//             t.category = transaction.category,
//             t.amount = transaction.amount,
//             t.due_date = transaction.due_date,
//             t.confirmation_date = transaction.confirmation_date ? new Date(transaction.confirmation_date) : null,
//             t.recurrence = transaction.recurrence,
//             t.stallments = transaction.stallments,
//             t.stallments_current = transaction.stallments_current,
//             t.stallments_period = transaction.stallments_period
//             t.category = {
//               root: t.category.root,
//               child: t.category.child,
//               grandchild: t.category.grandchild
//             }
//           }

//           t.stallments_count = transaction.stallments_count;
//           return t;
//         })

//         if (transaction.stallments_count < dbStallmentsRoot.stallments_count)
//           dbStallments.map(t => { (t.stallments_current > transaction.stallments_count) && stallmentsForDeletion.push(t.id) })
        
//         else if (transaction.stallments_count > dbStallmentsRoot.stallments_count) {
//           const diff = transaction.stallments_count - dbStallmentsRoot.stallments_count;
//           const lastStallment = dbStallments.find(t => t.stallments_current === dbStallmentsRoot.stallments_count).stallments_current + 1;
//           const lastDueDate = new Date(dbStallments.find(t => t.stallments_current === dbStallmentsRoot.stallments_count).due_date);
//           lastDueDate.setMonth(lastDueDate.getMonth() + 1);

//           let stallmentsPeriodOffset = 0;
//           switch (transaction.stallments_period) {
//             case "monthly"    : stallmentsPeriodOffset = 1;  break;
//             case "quarterly"  : stallmentsPeriodOffset = 3;  break;
//             case "semi-annual": stallmentsPeriodOffset = 6;  break;
//             case "annual"     : stallmentsPeriodOffset = 12; break;
//             default: stallmentsPeriodOffset = 1;
//           }
          
//           for (let i = 0; i < diff; i++) {
//             const newDueDate = new Date(lastDueDate);
//             newDueDate.setMonth(lastDueDate.getMonth() + i * stallmentsPeriodOffset);
            
//             const newTransaction = new Transaction({
//               name: dbStallmentsRoot.name,
//               user: dbStallmentsRoot.user,
//               account: dbStallmentsRoot.account,
//               type: dbStallmentsRoot.type,
//               amount: dbStallmentsRoot.amount,
//               due_date: new Date(newDueDate),
//               confirmation_date: undefined,
//               recurrence: undefined,
//               stallments: dbStallmentsRoot.stallments,
//               stallments_count: transaction.stallments_count,
//               stallments_current: lastStallment + i,
//               stallments_period: dbStallmentsRoot.stallments_period,
//               category: {
//                 root: dbStallmentsRoot.category.root,
//                 child: dbStallmentsRoot.category.child,
//                 grandchild: dbStallmentsRoot.category.grandchild
//               }
//             })
            
//             stallmentsForInsertion.push(newTransaction);
//           }
//         }
//       }
            
//       await Transaction.deleteMany({ id: { $in: stallmentsForDeletion } });
//       stallmentsForInsertion = await Transaction.insertMany(stallmentsForInsertion);

//       for (let i = 0; i < updatedTransactions.length; i++) 
//         await Transaction.findOneAndReplace({ id: updatedTransactions[i].id }, updatedTransactions[i]);

//       return NextResponse.json({ 
//         status: 200, 
//         data: { 
//           transactions: updatedTransactions,
//           forInsertion: stallmentsForInsertion, 
//           forDeletion: stallmentsForDeletion
//         } 
//       })
//     }

//     else {
//       const updatedTransaction = await Transaction.findOneAndUpdate(
//         { id: transaction.id },
//         {
//           name: transaction.name,
//           user: transaction.user,
//           account: transaction.account,
//           type: transaction.type,
//           category: transaction.category,
//           amount: transaction.amount,
//           due_date: transaction.due_date,
//           confirmation_date: transaction.confirmation_date ? new Date(transaction.confirmation_date) : null,
//           recurrence: transaction.recurrence,
//           stallments: transaction.stallments,
//         },
//         { new: true }
//       )

//       if (!updatedTransaction)
//         throw new Error("Transaction not found")

//       newTransactions.push(updatedTransaction);
//     }

//     return NextResponse.json({ 
//       status: 200, 
//       data: { transactions: newTransactions }
//     })
//   }
  
//   catch (err) {
//     console.log(err);

//     return NextResponse.json({ 
//       status: 500,
//       error: err 
//     })
//   }
// }

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
    const deletedTransaction = await Transaction.findOneAndDelete({ id: transaction.id });

    if (!deletedTransaction)
      throw new Error("Transaction not found");

    return NextResponse.json({
      status: 200,
      data: deletedTransaction.id
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