import { NextResponse } from 'next/server';
import { appRouter } from '@/server/api/root';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse('Not Found', { status: 404 });
  }

  const { renderTrpcPanel } = await import('trpc-ui');

  return new NextResponse(
    renderTrpcPanel(appRouter, {
      url: '/api/trpc', // Default tRPC route in Next.js
      meta: {
        title: 'Next.js Boilerplate API',
        description: 'Interactive tRPC API documentation and testing interface for the Next.js boilerplate project.',
      },
    }),
    {
      status: 200,
      headers: [['Content-Type', 'text/html'] as [string, string]],
    }
  );
}