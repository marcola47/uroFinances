import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

import dbConnection from '@/libs/dbConnection';
import User from '@/app/models/User';

export async function POST(req: Request) {
  try {
    await dbConnection();
    const { name, email, password } = await req.json();
    const user = await User.findOne({ email });

    if (user) 
      return NextResponse.json({ message: "Email already registered, try logging in.", status: 400 });
  
    const passwordHashed = await bcrypt.hash(password, 10);

    await User.create({ 
      id: uuid(), 
      name: name, 
      email: email, 
      password: passwordHashed 
    })
   
    return NextResponse.json({ message: "User registered", status: 200 });
  }

  catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal server error", status: 500 });
  }
}