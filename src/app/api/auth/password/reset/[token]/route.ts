import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';

import dbConnection from "@/libs/dbConnection";
import PasswordToken from "@/app/models/PasswordToken";
import User from "@/app/models/User";

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    await dbConnection();
    const { token } = params;
    const { password } = await req.json()

    console.log(token);
    console.log(password);
    
    const passwordToken = await PasswordToken.findOne({ token: token });
    if (!passwordToken || passwordToken.verified_at !== null) 
      return NextResponse.json({ status: 400, err: "Invalid token" });
    
    if (Date.now() - passwordToken.created_at.getTime() > 1000 * 60 * 60) 
      return NextResponse.json({ status: 400, err: "Token expired" });
    
    const user = await User.findOne({ id: passwordToken.user });
    if (!user || user.password) 
      return NextResponse.json({ status: 400, err: "Invalid user" });
    
    const passwordHashed = await bcrypt.hash(password, 10);
    await User.updateOne({ id: passwordToken.user }, { password: passwordHashed });
    await PasswordToken.updateOne({ token }, { verified_at: Date.now() });
  
    return NextResponse.json({ status: 200 });
  }

  catch (err) {
    console.log(err)
    return NextResponse.json({ status: 500, err: err });
  }
}
