import { z } from 'zod';

// Hello world test schema
export const helloWorldOutputSchema = z.object({
  message: z.string(),
});

// Type exports
export type HelloWorldOutput = z.infer<typeof helloWorldOutputSchema>;