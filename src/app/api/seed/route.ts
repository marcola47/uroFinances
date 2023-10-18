import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import User from '@/app/models/User';
import users from './users.json' assert { type: "json" };

export async function POST() {
  async function seedUsers() {
    await User.deleteMany({})
    
    for (const user of users) {
      const hash = await bcrypt.hash(user.password, 10);
  
      const newUser = new User({
        id: user.id,
        name: user.name,
        email: user.email,
        password: hash,
      });
  
      await User.create(newUser);
    }
  }
  
  try {  
    await mongoose.connect(process.env.MONGO_URI ?? "");
    await seedUsers();
    await mongoose.connection.close();
  
    return NextResponse.json({ status: 200 });
  }

  catch (error) {
    console.log(error)
  }
}