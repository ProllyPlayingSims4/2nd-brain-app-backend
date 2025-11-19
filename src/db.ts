import mongoose from 'mongoose';
import 'dotenv/config';

const connection =  await mongoose.connect(`${process.env.MONGODB_URI}/Second-Brain-App`);

export default connection;


