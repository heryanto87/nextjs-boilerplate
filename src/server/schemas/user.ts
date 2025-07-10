import { z } from 'zod';

// Input schemas for user operations
export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot be more than 100 characters'),
  email: z.string().email('Please enter a valid email'),
  age: z.number().min(0, 'Age cannot be negative').max(150, 'Age cannot be more than 150').optional(),
});

export const updateUserSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot be more than 100 characters').optional(),
  email: z.string().email('Please enter a valid email').optional(),
  age: z.number().min(0, 'Age cannot be negative').max(150, 'Age cannot be more than 150').optional(),
});

export const getUserSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
});

export const deleteUserSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
});

// Output schemas
export const userOutputSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string(),
  age: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const usersListOutputSchema = z.array(userOutputSchema);

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type GetUserInput = z.infer<typeof getUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
export type UserOutput = z.infer<typeof userOutputSchema>;
export type UsersListOutput = z.infer<typeof usersListOutputSchema>;