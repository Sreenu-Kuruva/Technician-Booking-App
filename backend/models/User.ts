import mongoose, { Schema } from 'mongoose';

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'technician';
  category?: string;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'technician'], required: true },
  category: { type: String, enum: ['Cat 1', 'Cat 2', 'Cat 3'] },
});

export default mongoose.model('User', userSchema);