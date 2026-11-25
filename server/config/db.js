import mongoose from 'mongoose';

export async function connectDB() {
  const { MONGO_URI } = process.env;
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not configured. Add it to the server environment.');
  }

  await mongoose.connect(MONGO_URI);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}
