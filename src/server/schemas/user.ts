import { z } from 'zod';
import { UserZodSchema } from '../collections/User';

// Base user schema without timestamps for input operations
const baseUserSchema = UserZodSchema.omit({ createdAt: true, updatedAt: true });

// Input schemas for user operations
export const createUserSchema = baseUserSchema;

export const updateUserSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
}).merge(baseUserSchema.partial());

export const getUserSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
});

export const deleteUserSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
});

// Output schemas
export const userOutputSchema = z.object({
  _id: z.string(),
}).merge(UserZodSchema);

export const usersListOutputSchema = z.array(userOutputSchema);

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type GetUserInput = z.infer<typeof getUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
export type UserOutput = z.infer<typeof userOutputSchema>;
export type UsersListOutput = z.infer<typeof usersListOutputSchema>;