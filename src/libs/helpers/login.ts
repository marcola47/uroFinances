import bcrypt from 'bcrypt';
import dbConnection from "@/libs/configs/dbConnection";
import User from "@/app/models/User";

type LoginUser = TUser & {
  password: string
};

export default async function login(email: string, password: string): Promise<LoginUser | null> {
  try {
    await dbConnection();
    
    const user: LoginUser | null = await User.findOne({ email: email });
    
    if (!user)
      return null;

    if (user.password && !(await bcrypt.compare(password, user.password as string))) {
      return null;
    }

    return user;
  } 

  catch (error) {
    console.error("Error during login:", error);
    return null;
  }
}