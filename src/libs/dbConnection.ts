import mongoose from 'mongoose';

export default async function dbConnection()
{  
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || '');
      console.log('Connected to MongoDB');
    }
  }

  catch (err) {
    console.log(err);
  }
}