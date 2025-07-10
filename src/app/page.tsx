'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<number | undefined>(undefined);

  // tRPC queries and mutations
  const helloQuery = trpc.general.hello.useQuery();
  const usersQuery = trpc.user.getAll.useQuery();
  const createUserMutation = trpc.user.create.useMutation({
    onSuccess: () => {
      usersQuery.refetch();
      setName('');
      setEmail('');
      setAge(undefined);
    },
  });
  const deleteUserMutation = trpc.user.delete.useMutation({
    onSuccess: () => {
      usersQuery.refetch();
    },
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      createUserMutation.mutate({ name, email, age });
    }
  };

  const handleDeleteUser = (id: string) => {
    deleteUserMutation.mutate({ id });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          tRPC + Next.js + MongoDB Test
        </h1>
        
        {/* Hello World Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hello World API Test</h2>
          <div className="bg-gray-50 p-4 rounded">
            {helloQuery.isLoading ? (
              <p className="text-gray-600">Loading...</p>
            ) : helloQuery.error ? (
              <p className="text-red-600">Error: {helloQuery.error.message}</p>
            ) : (
              <p className="text-green-600 font-medium">{helloQuery.data?.message}</p>
            )}
          </div>
        </div>

        {/* User CRUD Test */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">User CRUD Operations</h2>
          
          {/* Create User Form */}
          <form onSubmit={handleCreateUser} className="mb-8 p-4 bg-gray-50 rounded">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Create New User</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Age (optional)"
                value={age || ''}
                onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : undefined)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={createUserMutation.isPending}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {createUserMutation.isPending ? 'Creating...' : 'Create User'}
            </button>
            {createUserMutation.error && (
              <p className="text-red-600 mt-2">{createUserMutation.error.message}</p>
            )}
          </form>

          {/* Users List */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">All Users</h3>
            {usersQuery.isLoading ? (
              <p className="text-gray-600">Loading users...</p>
            ) : usersQuery.error ? (
              <p className="text-red-600">Error: {usersQuery.error.message}</p>
            ) : (
              <div className="space-y-3">
                {usersQuery.data?.length === 0 ? (
                  <p className="text-gray-500">No users found. Create one above!</p>
                ) : (
                  usersQuery.data?.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-gray-600">{user.email}</p>
                        {user.age && <p className="text-gray-500">Age: {user.age}</p>}
                      </div>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={deleteUserMutation.isPending}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
