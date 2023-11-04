//@ts-nocheck
import bcrypt from 'bcrypt';
import dbConnection from "@/libs/configs/dbConnection";
import User from "@/app/models/User";

export default async function login(email: string, password: string): Promise<any> {
  try {
    await dbConnection();
    
    const user = await User.findOne({ email: email }).lean().select('-_id -__v');
    if (!user)
      return null;

    if (user.password) {
      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return null;
    }

    return user;
  } 

  catch (error) {
    console.error("Error during login:", error);
  }
}