import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';

import sendEmail from '@/libs/helpers/nodemailer';
import EmailToken from '@/app/models/EmailToken';

export async function POST(req: NextRequest) {
  try {
    const { id, name, email } = await req.json();

    if (!id || !name || !email || id === "" || name === "" || email === "") 
      return NextResponse.json({ status: 400, err: "Either id, name or email is not valid" });
  
    // implement anti-spam

    const token = await EmailToken.create({
      user: id,
      token: `${uuid()}${uuid()}`.replace(/-/g, '')
    })
  
    const mailBody = {
      from: 'test@example.com',
      to: 'test@example.com',
      subject: 'Verify your email',
      html: `
        <html>
          <h3>Hello, ${name}!</h3>
          <a href="${process.env.NEXT_APP_ROUTE}/api/auth/email/verify/${token.token}">Please verify your email by clicking here</a>
  
          <h4>Or copy and paste the link below in your browser: </h4>
          <p>${process.env.NEXT_APP_ROUTE}/api/auth/email/verify/${token.token}</p>
        </html>
      `
    };
  
    sendEmail(mailBody);
    return NextResponse.json({ message: "Email sent", status: 200 });
  }

  catch (err: any) {
    console.log(err);

    return NextResponse.json({ 
      status: 500, 
      error: err.message || err
    });
  }
}