import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

import User from '@/app/models/User';
import users from './data_users.json' assert { type: "json" };
import dbConnection from '@/libs/configs/dbConnection';

export async function POST(req: NextRequest) {
  try {  
    await dbConnection();
    await User.deleteMany({})
    
    for (const user of users) {
      const hash = await bcrypt.hash(user.password, 10);
  
      const newUser = new User({
        id: user.id,
        name: user.name,
        email: user.email,
        password: hash,
        provider: user.provider,
        providerID: user.id,
        image: user.image,
        emailVerified: user.emailVerified,
        categories: user.categories,
        accounts: user.accounts,
        settings: {
          open_navbar_on_hover: user.settings.open_navbar_on_hover,
          hide_scrollbars: user.settings.hide_scrollbars,
          dark_mode: user.settings.dark_mode,
          show_category_icons: user.settings.show_category_icons
        }
      });
  
      await User.create(newUser);
    }

    return NextResponse.json({ status: 200 });
  }
  
  catch (err: any) {
    console.log(err);

    return NextResponse.json({ 
      status: 500, 
      error: err.message || err
    });
  }
}