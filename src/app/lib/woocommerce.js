import { fetchGraphQL } from './graphql-client';

// ১. সমস্ত প্রোডাক্ট পাওয়ার ফাংশন
export async function getProducts(first = 10) {
  const query = `
    query GetProducts($first: Int) {
      products(first: $first) {
        nodes {
          id
          databaseId
          name
          slug
          type
          image {
            sourceUrl
            altText
          }
          ... on SimpleProduct {
            price
            regularPrice
          }
          ... on VariableProduct {
            price
            regularPrice
          }
        }
      }
    }
  `;

  try {
    const data = await fetchGraphQL(query, { first });
    return data?.products?.nodes || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// ২. সিঙ্গেল প্রোডাক্টের ডিটেইলস পাওয়ার ফাংশন
export async function getProductBySlug(slug) {
  const query = `
    query GetProductBySlug($id: ID!, $idType: ProductIdTypeEnum!) {
      product(id: $id, idType: $idType) {
        id
        databaseId
        name
        slug
        description
        shortDescription
        image {
          sourceUrl
          altText
        }
        ... on SimpleProduct {
          price
          regularPrice
        }
        ... on VariableProduct {
          price
          regularPrice
        }
      }
    }
  `;

  try {
    const data = await fetchGraphQL(query, { id: slug, idType: 'SLUG' });
    return data?.product || null;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

// ৩. WooGraphQL Cart-এ আইটেম যোগ করার ফাংশন
export async function addToWooCart(items) {
  const mutation = `
    mutation AddToCart($input: AddToCartInput!) {
      addToCart(input: $input) {
        cart {
          contents {
            itemCount
          }
        }
      }
    }
  `;

  for (const item of items) {
    await fetchGraphQL(mutation, {
      input: {
        productId: item.productId,
        quantity: item.quantity,
      },
    });
  }
}

// ৪. 게স্ট ইউজারের জন্য COD Checkout Mutation
export async function createCodOrder(checkoutData) {
  // প্রথমে সেশন কার্টে আইটেমগুলো যোগ করে নেওয়া হচ্ছে
  await addToWooCart(checkoutData.lineItems);

  const mutation = `
    mutation Checkout($input: CheckoutInput!) {
      checkout(input: $input) {
        order {
          databaseId
          orderNumber
          total
        }
      }
    }
  `;

  const variables = {
    input: {
      paymentMethod: 'cod',
      billing: checkoutData.billing,
      shipping: checkoutData.billing,
      isPaid: false,
    },
  };

  try {
    const data = await fetchGraphQL(mutation, variables);
    return data?.checkout?.order || null;
  } catch (error) {
    console.error("Error creating COD order:", error);
    throw error;
  }
}