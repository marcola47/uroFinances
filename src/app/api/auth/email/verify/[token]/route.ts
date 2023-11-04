import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

import dbConnection from "@/libs/configs/dbConnection";
import User from "@/app/models/User";
import EmailToken from "@/app/models/EmailToken";

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    await dbConnection();
    const { token } = params;
    
    const emailToken = await EmailToken.findOne({ token: token });
    if (!emailToken || emailToken.verified_at !== null)
      return NextResponse.json({ status: 400, err: "Invalid token" });
      
    if (Date.now() - emailToken.created_at.getTime() > 1000 * 60 * 60 * 24) 
      return NextResponse.json({ status: 400, err: "Token expired" });
  
    const user = await User.findOne({ id: emailToken.user });
    if (!user || user.emailVerified === true) 
      return NextResponse.json({ status: 400, err: "Invalid user or email already verified" });
  
    await User.updateOne({ id: emailToken.user }, { emailVerified: true });
    await EmailToken.updateOne({ token }, { verified_at: Date.now() });
  
    redirect('/auth/email/verified');
  }

  catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500, err: err });
  }
}