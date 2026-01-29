import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';
import { env } from '../config/env.js';

mongoose.set('strictQuery', true);

const connectDB = async () => {
  if (!env.mongoUri) {
    throw new Error('Missing MONGODB_URI in environment');
  }

  try {
    const connection = await mongoose.connect(`${env.mongoUri}/${DB_NAME}`);
    console.log(`Connected to MongoDB at ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export default connectDB;
