const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

/**
 * Base fetch function with default options
 */
async function fetchAPI(endpoint, options = {}) {
  const defaultOptions = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    next: {
      revalidate: 60 // Default cache for 60 seconds
    }
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };

  const res = await fetch(`${API_URL}${endpoint}`, mergedOptions);
  
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

/**
 * Get all products with caching
 */
export async function getProducts() {
  const json = await fetchAPI('/api/products?populate=*');
  return json.data?.map(product => transformProduct(product)) || [];
}

/**
 * Get single product by slug with caching
 */
export async function getProductBySlug(slug) {
  const json = await fetchAPI(`/api/products?filters[slug][$eq]=${slug}&populate=*`);
  if (!json.data?.[0]) return null;
  return transformProduct(json.data[0]);
}

/**
 * Get all categories with caching
 */
export async function getCategories() {
  const json = await fetchAPI('/api/categories?populate=*');
  return json.data?.map(category => ({
    id: category.id,
    name: category.attributes?.name,
    slug: category.attributes?.slug,
    image: category.attributes?.image?.data ? {
      url: `${API_URL}${category.attributes.image.data.attributes.url}`,
      formats: Object.entries(category.attributes.image.data.attributes.formats || {}).reduce((acc, [key, value]) => {
        acc[key] = {
          ...value,
          url: `${API_URL}${value.url}`
        };
        return acc;
      }, {})
    } : null
  })) || [];
}

/**
 * Transform Strapi data to our format
 */
export function transformProduct(productData) {
  if (!productData?.attributes) return null;
  
  const { attributes } = productData;
  
  // Handle image data
  const images = attributes.image?.data ? 
    (Array.isArray(attributes.image.data) ? attributes.image.data : [attributes.image.data])
    .map(img => ({
      url: `${API_URL}${img.attributes.url}`,
      formats: Object.entries(img.attributes.formats || {}).reduce((acc, [key, value]) => {
        acc[key] = {
          ...value,
          url: `${API_URL}${value.url}`
        };
        return acc;
      }, {})
    })) : [];

  return {
    id: productData.id,
    name: attributes.name,
    description: attributes.description,
    price: attributes.price,
    originalPrice: attributes.originalPrice,
    available: attributes.available,
    slug: attributes.slug,
    category: attributes.category?.data ? {
      id: attributes.category.data.id,
      name: attributes.category.data.attributes.name,
      slug: attributes.category.data.attributes.slug
    } : null,
    image: images
  };
} 