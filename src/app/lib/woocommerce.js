const WORDPRESS_GRAPHQL_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL ||
  'https://dev-headlessecommerce.pantheonsite.io/graphql';

async function fetchAPI(query = '', { variables } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  const res = await fetch(WORDPRESS_GRAPHQL_URL, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
    }),
    next: { revalidate: 60 },
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }
  return json.data;
}

// ১. সমস্ত প্রোডাক্ট পাওয়ার ফাংশন (Inline Fragment সহ)
export async function getProducts() {
  const data = await fetchAPI(`
    query GetProducts {
      products {
        nodes {
          id
          databaseId
          name
          slug
          image {
            sourceUrl
            altText
          }
          ... on SimpleProduct {
            price
          }
          ... on VariableProduct {
            price
          }
          ... on ExternalProduct {
            price
          }
          ... on GroupProduct {
            price
          }
        }
      }
    }
  `);
  return data?.products?.nodes || [];
}

// ২. সিঙ্গেল প্রোডাক্ট Slug দিয়ে পাওয়ার ফাংশন (Inline Fragment সহ)
export async function getProductBySlug(slug) {
  const data = await fetchAPI(
    `
    query GetProductBySlug($id: ID!) {
      product(id: $id, idType: SLUG) {
        id
        databaseId
        name
        slug
        description
        image {
          sourceUrl
          altText
        }
        ... on SimpleProduct {
          price
        }
        ... on VariableProduct {
          price
        }
        ... on ExternalProduct {
          price
        }
        ... on GroupProduct {
          price
        }
      }
    }
  `,
    { variables: { id: slug } }
  );
  return data?.product || null;
}

// ৩. COD অর্ডারের জন্য ফাংশন
export async function createCodOrder(payload) {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to place order');
  }

  return data.data?.createOrder || data;
}