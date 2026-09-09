import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();

    // Vercel Server Side Fetch - No CORS limits here
    const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || 'https://dev-headlessecommerce.pantheonsite.io/graphql';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.errors) {
      return NextResponse.json({ error: data.errors[0]?.message || 'GraphQL Mutation Error' }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Server Internal Error' }, { status: 500 });
  }
}