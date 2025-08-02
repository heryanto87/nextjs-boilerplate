import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

// Zod schema for User validation
export const UserZodSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot be more than 100 characters').trim(),
  email: z.string().email('Please enter a valid email').toLowerCase().trim(),
  age: z.number().min(0, 'Age cannot be negative').max(150, 'Age cannot be more than 150').optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Infer TypeScript type from Zod schema
export type IUser = z.infer<typeof UserZodSchema>;

const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    age: {
      type: Number,
      min: [0, 'Age cannot be negative'],
      max: [150, 'Age cannot be more than 150'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation during development
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;