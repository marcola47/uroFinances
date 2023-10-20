import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import Mailgun from 'mailgun.js';
import formData from 'form-data';

import dbConnection from '@/libs/dbConnection';
import User from '@/app/models/User';
import EmailToken from '@/app/models/EmailToken';

const API_KEY = process.env.MAILGUN_API_KEY || '';
const DOMAIN = process.env.MAILGUN_DOMAIN || '';

export async function POST(req: Request) {
  try {
    await dbConnection();
    const { name, email, password } = await req.json();
    const user = await User.findOne({ email });

    if (user) 
      return NextResponse.json({ message: "Email already registered, try logging in.", status: 400 });
  
    const passwordHashed = await bcrypt.hash(password, 10);

    const newUserID = uuid();
    const newUser = await User.create({
      id: newUserID,
      name: name,
      email: email,
      password: passwordHashed,
      provider: 'credentials'
    })
   
    const token = await EmailToken.create({
      id: uuid(),
      user: newUser.id,
      token: `${uuid()}${uuid()}`.replace(/-/g, '')
    })
    
    const mailgun = new Mailgun(formData)
    const client = mailgun.client({ 
      username: 'api', 
      key: API_KEY 
    });

    const messageData = {
      from: `noreply@${DOMAIN}`,
      to: newUser.email,
      subject: 'Please, verify your email.',
      html: `
        <html>
          <h3>Hello, ${newUser.name}!</h3>
          <a href="${process.env.NEXT_APP_ROUTE}/api/auth/verify-email/${token.token}">Please verify your email by clicking here</a>

          <h4>Or copy and paste the link below in your browser: </h4>
          <p>${process.env.NEXT_APP_ROUTE}/api/auth/verify-email/${token.token}</p>
        </html>
      `
    }

    await client.messages.create(DOMAIN, messageData);
    return NextResponse.json({ message: "User registered", status: 200 });
  }

  catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal server error", status: 500 });
  }
}