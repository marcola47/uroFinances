import { NextResponse } from "next/server";
import { faker } from "@faker-js/faker";

import Transaction from "@/app/models/Transaction";
import Recurrence from "@/app/models/Recurrence";
import dbConnection from "@/libs/configs/dbConnection";

import expenseCategories from "./expense_categories.json" assert { type: "json" };
import incomeCategories from "./income_categories.json" assert { type: "json" };

// refazer
export async function POST() {
  try { 
    await dbConnection();
    await Transaction.deleteMany({});
    await Recurrence.deleteMany({});

    const accounts = [
      "ff5ec9d3-a89b-48dc-89d1-1651f047fc6f",
      "4065fc7a-f416-4c5d-8673-ace51a6b6f15",
      "398819b5-263c-4e88-9a46-829bf0058b7e",
      "a1c61540-548b-4448-831b-f530428a8327"
    ]

    const financialEventPeriods = [
      "monthly", 
      "quarterly", 
      "semi-annual", 
      "annual"
    ]

    const recurrences = [];
    for (let i = 0; i < 10; i++) {
      const type = Math.round(Math.random()) ? "expense" : "income";
      const dueDate = faker.date.between({ from: '2018-01-01T00:00:00.000Z', to: '2028-01-01T00:00:00.000Z' });
      const curDate = new Date(); curDate.setUTCHours(0, 0, 0, 0);
      const diffDate = new Date(dueDate); diffDate.setUTCHours(0, 0, 0, 0);
      const recurrencePeriod = faker.helpers.arrayElement(financialEventPeriods);

      interface Category { root: string | null, child: string | null, grandchild: string | null };
      const category: Category = { root: null, child: null, grandchild: null };
      const arrayCategory = faker.helpers.arrayElement(type === "expense" ? expenseCategories : incomeCategories);

      if (!arrayCategory.grandparent || arrayCategory.grandparent === null) {
        if (!arrayCategory.parent || arrayCategory.parent === null) 
          category.root = arrayCategory.id;
        
        else {
          category.root = arrayCategory.parent;
          category.child = arrayCategory.id;
        }
      }

      else {
        category.root = arrayCategory.grandparent;
        category.child = arrayCategory.parent;
        category.grandchild = arrayCategory.id;
      }

      let recurringPeriodOffset = 0;
      switch (recurrencePeriod) {
        case "monthly"    : recurringPeriodOffset = 1;  break;
        case "quarterly"  : recurringPeriodOffset = 3;  break;
        case "semi-annual": recurringPeriodOffset = 6;  break;
        case "annual"     : recurringPeriodOffset = 12; break;
        default: 1;
      }

      interface PaidMonth { due_month: string, paid_month: string };
      const paidMonths: PaidMonth[] = [];

      while (diffDate <= curDate) {
        const newPaidMonth: PaidMonth = {
          due_month: diffDate.toISOString(),
          paid_month: diffDate.toISOString()
        }

        paidMonths.push(newPaidMonth);
        diffDate.setMonth(diffDate.getMonth() + recurringPeriodOffset);
      }

      const newTransaction = {
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        user: "2f713bd2-2a04-46d7-930b-bba65597fd46",
        account: faker.helpers.arrayElement(accounts),
        type: type,
        category: category,
        amount: faker.number.float({ min: 1, max: 1000, precision: 0.01 }),
        due_date: dueDate,
        recurrence_period: recurrencePeriod
      }

      recurrences.push(newTransaction);
    }

    const transactions = [];
    for (let i = 0; i < 1000; i++) {
      const type = Math.round(Math.random()) ? "expense" : "income";
      const recurrence = Math.floor(Math.random() * 10); // 0 -> in stallments

      interface Category { root: string | null, child: string | null, grandchild: string | null };
      const category: Category = { root: null, child: null, grandchild: null };
      const arrayCategory = faker.helpers.arrayElement(type === "expense" ? expenseCategories : incomeCategories);

      if (!arrayCategory.grandparent || arrayCategory.grandparent === null) {
        if (!arrayCategory.parent || arrayCategory.parent === null) 
          category.root = arrayCategory.id;
        
        else {
          category.root = arrayCategory.parent;
          category.child = arrayCategory.id;
        }
      }

      else {
        category.root = arrayCategory.grandparent;
        category.child = arrayCategory.parent;
        category.grandchild = arrayCategory.id;
      }

      if (recurrence === 0) {
        const startDate = faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: '2030-01-01T00:00:00.000Z' });
        const stallmentsCount = Math.floor(Math.random() * 24) + 1;
        const stallmentPeriod = faker.helpers.arrayElement(financialEventPeriods);

        let stallmentPeriodOffset = 0;
        switch (stallmentPeriod) {
          case "monthly"    : stallmentPeriodOffset = 1;  break;
          case "quarterly"  : stallmentPeriodOffset = 3;  break;
          case "semi-annual": stallmentPeriodOffset = 6;  break;
          case "annual"     : stallmentPeriodOffset = 12; break;
          default: 1;
        }
        
        const name = faker.commerce.productName();
        const account = faker.helpers.arrayElement(accounts);
        let stallment = "";
        let amountPerStallment = (faker.number.float({ min: 100, max: 10000 })) / stallmentsCount; 
        amountPerStallment = parseFloat(amountPerStallment.toFixed(2));

        for (let i = 0; i < stallmentsCount; i++) {
          const curDate = new Date(startDate);
          curDate.setMonth(curDate.getMonth() + i * stallmentPeriodOffset);

          const newTransactionID = faker.string.uuid();

          if (i === 0) 
            stallment = newTransactionID;

          const newTransaction = {
            id: newTransactionID,
            name: name,
            user: "2f713bd2-2a04-46d7-930b-bba65597fd46",
            account: account,
            type: type,
            category: category,
            amount: amountPerStallment,
            due_date: curDate,
            confirmation_date: curDate,
            stallments: stallment,
            stallments_count: stallmentsCount,
            stallments_current: i + 1,
            stallments_period: stallmentPeriod
          }

          transactions.push(newTransaction);
        }
      }
      
      else {
        const newDueDate = faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: '2030-01-01T00:00:00.000Z' });

        const newTransaction = {
          id: faker.string.uuid(),
          name: faker.commerce.productName(),
          user: "2f713bd2-2a04-46d7-930b-bba65597fd46",
          account: faker.helpers.arrayElement(accounts),
          type: type,
          category: category,
          amount: faker.number.float({ min: 1, max: 1000, precision: 0.01 }),
          due_date: newDueDate,
          confirmation_date: newDueDate
        }

        transactions.push(newTransaction);
      }
    }

    await Recurrence.insertMany(recurrences);
    await Transaction.insertMany(transactions);
    return NextResponse.json({ status: 200 });
  }

  catch (err: any) {
    console.log(err);

    return NextResponse.json({ 
      status: 500, 
      error: err.message || err
    });
  }
}