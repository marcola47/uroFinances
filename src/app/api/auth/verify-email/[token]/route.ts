import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

import dbConnection from "@/libs/dbConnection";
import User from "@/app/models/User";
import EmailToken from "@/app/models/EmailToken";

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  await dbConnection();
  const { token } = params;

  console.log(token);
  
  const emailToken = await EmailToken.findOne({ token: token });
  if (!emailToken || emailToken.verified_at !== null) {
    throw new Error("Invalid token");
  }

  if (Date.now() - emailToken.created_at.getTime() > 1000 * 60 * 60 * 24) {
    throw new Error("Expired token");
  }

  const user = await User.findOne({ id: emailToken.user });
  if (!user || user.emailVerified === true) {
    throw new Error("User not found or email already verified");
  }

  await User.updateOne({ id: emailToken.user }, { emailVerified: true });
  await EmailToken.updateOne({ token }, { verified_at: Date.now() });

  redirect('/auth/email-verified');
}