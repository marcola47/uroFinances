import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import PasswordToken from "@/app/models/PasswordToken";
import sendEmail from "@/libs/helpers/nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { id, name, email } = await req.json();

    if (!id || !name || !email || id === "" || name === "" || email === "") 
      return NextResponse.json({ status: 400, err: "Either id, name or email is not valid" });

    const token = await PasswordToken.create({
      user: id,
      token: `${uuid()}${uuid()}`.replace(/-/g, '')
    })

    const mailBody = {
      from: 'test@example.com',
      to: 'test@example.com',
      subject: 'Reset your password',
      html: `
        <html>
          <h3>Hello, ${name}!</h3>
          <a href="${process.env.NEXT_APP_ROUTE}/auth/password/create/${token.token}">Please reset your password by clicking here</a>

          <h4>Or copy and paste the link below in your browser: </h4>
          <p>${process.env.NEXT_APP_ROUTE}/auth/password/create/${token.token}</p>
        </html>
      `
    };

    sendEmail(mailBody);
    return NextResponse.json({ status: 200 });
  }

  catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500, error: err });
  }
}