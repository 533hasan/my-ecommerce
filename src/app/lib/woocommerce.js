export async function createCodOrder(payload) {
  // ব্রাউজার সরাসরি Pantheon-এ না গিয়ে Vercel API Route-এ রিকোয়েস্ট পাঠাবে
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        mutation CheckoutMutation($input: CheckoutInput!) {
          checkout(input: $input) {
            order {
              databaseId
              orderNumber
            }
          }
        }
      `,
      variables: {
        input: {
          paymentMethod: 'cod',
          billing: payload.billing,
          lineItems: payload.lineItems,
          isPaid: false,
        },
      },
    }),
  });

  const json = await res.json();

  if (json.error || json.errors) {
    throw new Error(json.error || json.errors?.[0]?.message || 'Checkout failed');
  }

  return json.data?.checkout?.order;
}