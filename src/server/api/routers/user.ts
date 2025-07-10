import { createTRPCRouter, publicProcedure } from '../trpc';
import {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
  deleteUserSchema,
  userOutputSchema,
  usersListOutputSchema,
} from '../../schemas/user';
import User from '../../collections/User';
import { TRPCError } from '@trpc/server';

export const userRouter = createTRPCRouter({
  // Create a new user
  create: publicProcedure
    .meta({ description: 'Create a new user with name, email, and age. Email must be unique.' })
    .input(createUserSchema)
    .output(userOutputSchema)
    .mutation(async ({ input }) => {
      try {
        const user = new User(input);
        const savedUser = await user.save();
        return {
          _id: savedUser._id.toString(),
          name: savedUser.name,
          email: savedUser.email,
          age: savedUser.age,
          createdAt: savedUser.createdAt,
          updatedAt: savedUser.updatedAt,
        };
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User with this email already exists',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user',
        });
      }
    }),

  // Get all users
  getAll: publicProcedure
    .meta({ description: 'Retrieve all users from the database, sorted by creation date (newest first).' })
    .output(usersListOutputSchema)
    .query(async () => {
      try {
        const users = await User.find({}).sort({ createdAt: -1 });
        return users.map(user => ({
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          age: user.age,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }));
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch users',
        });
      }
    }),

  // Get user by ID
  getById: publicProcedure
    .meta({ description: 'Retrieve a specific user by their unique ID.' })
    .input(getUserSchema)
    .output(userOutputSchema)
    .query(async ({ input }) => {
      try {
        const user = await User.findById(input.id);
        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }
        return {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          age: user.age,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      } catch (error: unknown) {
        if (error instanceof TRPCError && error.code === 'NOT_FOUND') {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch user',
        });
      }
    }),

  // Update user
  update: publicProcedure
    .meta({ description: 'Update an existing user\'s information. All fields are optional except ID.' })
    .input(updateUserSchema)
    .output(userOutputSchema)
    .mutation(async ({ input }) => {
      try {
        const { id, ...updateData } = input;
        const user = await User.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        );
        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }
        return {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          age: user.age,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      } catch (error: unknown) {
        if (error instanceof TRPCError && error.code === 'NOT_FOUND') {
          throw error;
        }
        if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User with this email already exists',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update user',
        });
      }
    }),

  // Delete user
  delete: publicProcedure
    .meta({ description: 'Permanently delete a user from the database by their ID.' })
    .input(deleteUserSchema)
    .output(userOutputSchema)
    .mutation(async ({ input }) => {
      try {
        const user = await User.findByIdAndDelete(input.id);
        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }
        return {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          age: user.age,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      } catch (error: unknown) {
        if (error instanceof TRPCError && error.code === 'NOT_FOUND') {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete user',
        });
      }
    }),
});