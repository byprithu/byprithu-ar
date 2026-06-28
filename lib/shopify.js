const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const FIELDS = `id title handle availableForSale
  priceRange { minVariantPrice { amount currencyCode } }
  images(first:1) { edges { node { url altText } } }`;

async function query(q, vars = {}) {
  if (!TOKEN || TOKEN === "skip_for_now") return null;
  const res = await fetch(`https://${DOMAIN}/api/2024-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query: q, variables: vars }),
    next: { revalidate: 60 },
  });
  const json = await res.json();
  return json.data;
}

export async function getProducts(limit = 10) {
  const data = await query(`query { products(first:${limit}, sortKey:CREATED_AT, reverse:true) { edges { node { ${FIELDS} } } } }`);
  return data?.products?.edges?.map(e => e.node) ?? [];
}

export async function getProductsByCollection(id, limit = 10) {
  const data = await query(`query($id:ID!){collection(id:$id){products(first:${limit}){edges{node{${FIELDS}}}}}}`, { id });
  return data?.collection?.products?.edges?.map(e => e.node) ?? [];
}

export async function getProductsByTag(tag, limit = 10) {
  const data = await query(`query($q:String!){products(first:${limit},query:$q){edges{node{${FIELDS}}}}}`, { q: `tag:${tag}` });
  return data?.products?.edges?.map(e => e.node) ?? [];
}

export async function fetchProductsForPoster(collectionId, tag) {
  if (collectionId) return getProductsByCollection(collectionId);
  if (tag) return getProductsByTag(tag);
  return getProducts();
}

export function formatPrice(amount, currency) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(parseFloat(amount));
}
