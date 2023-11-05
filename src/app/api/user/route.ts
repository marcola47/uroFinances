import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/libs/configs/dbConnection";

import User from "@/app/models/User";

export async function GET(req: NextRequest) {
  try {
    await dbConnection();
    const { searchParams } = new URL(req.url);
    const user = searchParams.get('user');
    const data = searchParams.get('data');

    const userData = await User.findOne({ id: user }, { [data!]: 1 });  
    return NextResponse.json({ 
      status: 200, 
      data: userData![data!] 
    });
  }

  catch (err) {
    console.log(err);
    return NextResponse.json({ 
      status: 500, 
      error: err 
    });
  }
}