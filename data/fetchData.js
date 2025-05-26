const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://wise-book-dea9d4bff7.strapiapp.com";

/**
 * Fetches product data from Strapi API
 * @returns {Promise<Array>} Array of products with their details
 */
export default async function fetchData() {
  try {
    // Fetch products with all related data including images
    const res = await fetch(`${API_URL}/api/products?populate=*`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      next: {
        revalidate: 60 // Revalidate data every 60 seconds
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();

    // Validate the response structure
    if (!json?.data || !Array.isArray(json.data)) {
      console.error('Invalid data structure received:', json);
      return [];
    }

    // Transform and validate each product
    const validProducts = json.data.filter(product => {
      return (
        product.id &&
        product.name &&
        typeof product.available === 'boolean' &&
        typeof product.price === 'number'
      );
    });

    if (validProducts.length < json.data.length) {
      console.warn(`Some products were filtered out due to invalid data structure. 
        Received: ${json.data.length}, Valid: ${validProducts.length}`);
    }

    return validProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
