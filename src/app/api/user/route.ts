import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/libs/configs/dbConnection";

import { TypeUser } from "@/types/types";
import User from "@/app/models/User";

export async function GET(req: NextRequest) {
  try {
    await dbConnection();
    const { searchParams } = new URL(req.url);

    const user = searchParams.get('user');
    const userData = await User.findOne({ id: user }).lean().select('-_id -__v -password') as TypeUser;

    return NextResponse.json({ 
      status: 200, 
      data: userData
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