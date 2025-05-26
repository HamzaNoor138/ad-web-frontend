// fetchCategories.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://wise-book-dea9d4bff7.strapiapp.com";

export default async function fetchCategories() {
  try {
    const res = await fetch(`${API_URL}/api/categories?populate=*`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();

    if (!json?.data) {
      console.error('Invalid category data structure received:', json);
      return [];
    }

    // Transform the data to include necessary fields
    const categories = json.data.map(category => ({
      id: category.id,
      name: category.attributes?.name || category.name,
      slug: category.attributes?.slug || category.slug,
      documentId: category.attributes?.documentId || category.documentId,
      image: category.attributes?.image?.data || category.image
    }));

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
