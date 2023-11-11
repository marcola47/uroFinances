import { NextRequest, NextResponse } from "next/server";
import Transaction from "@/app/models/Transaction";

export async function PUT(req: NextRequest, { params }: { params: { transaction: string } }) {
  try {
    const { transaction } = params;
    const { confirmed } = await req.json();
    
    await Transaction.findOneAndUpdate({ id: transaction }, { confirmed });
    return NextResponse.json({ status: 200, err: null, data: null })
  }

  catch (err) {
    console.log(err)
    return NextResponse.json({ status: 500, err, data: null })
  }
}