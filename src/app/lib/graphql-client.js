// Server-side এবং Client-side দুই জায়গার জন্যই সঠিক Base URL নির্ণয়
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return ''; // Client-side-এ Relative path কাজ করে
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`; // Vercel Server-side
  }
  return 'http://localhost:3000'; // Local Server-side
};

export async function fetchGraphQL(query, variables = {}) {
  const envUrl = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || '/api/graphql';
  
  // URL যদি http দিয়ে শুরু না হয়, তবে Base URL যোগ হবে
  const endpoint = envUrl.startsWith('http') 
    ? envUrl 
    : `${getBaseUrl()}${envUrl}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }, // Product Cache এর জন্য (60s)
  });

  const json = await res.json();
  if (json.errors) {
    console.error("GraphQL Errors:", json.errors);
    throw new Error(json.errors[0]?.message || "Failed to fetch GraphQL API");
  }

  return json.data;
}