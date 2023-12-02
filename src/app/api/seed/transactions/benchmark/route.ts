import { NextResponse } from "next/server";
import { faker } from "@faker-js/faker";

import Transaction from "@/app/models/Transaction";
import dbConnection from "@/libs/configs/dbConnection";

import expenseCategories from "../expense_categories.json" assert { type: "json" };
import incomeCategories from "../income_categories.json" assert { type: "json" };

// refazer
export async function POST() {
  try { 
    await dbConnection();

    const transactions = [];
    for (let i = 0; i < 100000; i++) {
      const type = Math.round(Math.random()) ? "expense" : "income";

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
  
      const newDueDate = faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: '2030-01-01T00:00:00.000Z' });

      const newTransaction = {
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        user: faker.string.uuid(),
        account: faker.string.uuid(),
        type: type,
        category: category,
        amount: faker.number.float({ min: 1, max: 1000, precision: 0.01 }),
        due_date: newDueDate,
        confirmation_date: newDueDate
      }

      transactions.push(newTransaction);
    }

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