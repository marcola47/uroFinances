import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import User from '@/app/models/User';
import users from './data_users.json' assert { type: "json" };

import Category from '@/app/models/Category';
import categories from './data_categories.json' assert { type: "json" };

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');

  type SeedCollectionParams = {
    Model: mongoose.Model<any>;
    data: any[];
  }

  async function seedCollection(params: SeedCollectionParams) {
    const { Model, data } = params;

    await Model.deleteMany({});

    for (const item of data) 
      await Model.create(item);
  }

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
    
    switch (type) {
      case 'users': await seedUsers(); break;
      case 'categories': await seedCollection({ Model: Category, data: categories }); break;
    }

    await mongoose.connection.close();
    return NextResponse.json({ status: 200 });
  }

  catch (error) {
    console.log(error)
    return NextResponse.json({ status: 500 });
  }
}