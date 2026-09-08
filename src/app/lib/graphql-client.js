let woocommerceSession = null;

export async function fetchGraphQL(query, variables = {}) {
  const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL;

  const headers = {
    'Content-Type': 'application/json',
  };

  if (woocommerceSession) {
    headers['woocommerce-session'] = `Session ${woocommerceSession}`;
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const sessionHeader = res.headers.get('woocommerce-session');
  if (sessionHeader) {
    woocommerceSession = sessionHeader;
  }

  const json = await res.json();

  if (json.errors) {
    console.error("GraphQL Errors:", json.errors);
    throw new Error(json.errors[0]?.message || "Failed to fetch GraphQL API");
  }

  return json.data;
}