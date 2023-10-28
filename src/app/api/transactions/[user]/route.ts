import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/libs/dbConnection";
import Transaction from "@/app/models/Transaction";

export async function GET(req: NextRequest, { params }: { params: { user: string } }) {
  try {
    await dbConnection();
    const user = params.user;
    console.log(user)    
    // const transactions = await Transaction.find({ user: user });
    // console.log(transactions);

    return NextResponse.json({ status: 200 })
  }

  catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 })
  }
}