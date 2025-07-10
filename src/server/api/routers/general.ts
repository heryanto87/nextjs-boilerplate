import { createTRPCRouter, publicProcedure } from '../trpc';
import { helloWorldOutputSchema } from '../../schemas/general';

export const generalRouter = createTRPCRouter({
  // Hello world test endpoint
  hello: publicProcedure
    .meta({ description: 'A simple test endpoint that returns a "hello world" message.' })
    .output(helloWorldOutputSchema)
    .query(() => {
      return {
        message: 'hello world',
      };
    }),
});