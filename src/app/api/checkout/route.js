import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const endpoint =
      process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL ||
      'https://dev-headlessecommerce.pantheonsite.io/graphql';

    const ck = process.env.WC_CONSUMER_KEY;
    const cs = process.env.WC_CONSUMER_SECRET;

    const headers = {
      'Content-Type': 'application/json',
    };

    if (ck && cs) {
      const auth = Buffer.from(`${ck}:${cs}`).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;
    }

    const mutation = `
      mutation CreateOrder($input: CreateOrderInput!) {
        createOrder(input: $input) {
          order {
            databaseId
            orderNumber
          }
        }
      }
    `;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: {
            paymentMethod: 'cod',
            isPaid: false,
            billing: body.billing,
            shipping: body.shipping || body.billing,
            lineItems: body.lineItems,
          },
        },
      }),
    });

    const data = await res.json();

    if (data.errors) {
      console.error('WPGraphQL Error:', data.errors);
      return NextResponse.json(
        { error: data.errors[0]?.message || 'GraphQL Error' },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Checkout API Catch Error:', error);
    return NextResponse.json(
      { error: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}