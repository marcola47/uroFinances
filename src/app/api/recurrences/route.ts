import { NextRequest, NextResponse } from "next/server";

import dbConnection from "@/libs/configs/dbConnection";
import Recurrence from "@/app/models/Recurrence";

export async function GET(req: NextRequest) {
  try {
    await dbConnection();

    const { searchParams } = new URL(req.url);
    const user = searchParams.get('user');

    const recurrences = await Recurrence.find({ 
      user: user 
    })
    .lean()
    .select('-_id -__v');

    console.log(recurrences);

    return NextResponse.json({ 
      status: 200, 
      data: recurrences 
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