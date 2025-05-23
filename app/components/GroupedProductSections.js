import FoodCard from "@/app/components/FoodCard";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export default function GroupedProductSections({ categories, groupedProducts, sectionRefs }) {
  // Function to get category image URL
  const getCategoryImageUrl = (category) => {
    // Handle the case where image is in attributes (new Strapi structure)
    if (category.attributes?.image?.data) {
      const imageData = category.attributes.image.data;
      // Prioritize original image, then fall back to formats if needed
      if (imageData.attributes?.url) {
        return `${API_URL}${imageData.attributes.url}`;
      } else if (imageData.attributes?.formats?.large?.url) {
        return `${API_URL}${imageData.attributes.formats.large.url}`;
      } else if (imageData.attributes?.formats?.medium?.url) {
        return `${API_URL}${imageData.attributes.formats.medium.url}`;
      } else if (imageData.attributes?.formats?.small?.url) {
        return `${API_URL}${imageData.attributes.formats.small.url}`;
      }
    }
    
    // Handle the case where image is direct array (old structure)
    if (category.image && Array.isArray(category.image) && category.image.length > 0) {
      const imageData = category.image[0];
      // Prioritize original image, then fall back to formats if needed
      if (imageData.url) {
        return `${API_URL}${imageData.url}`;
      } else if (imageData.formats?.large?.url) {
        return `${API_URL}${imageData.formats.large.url}`;
      } else if (imageData.formats?.medium?.url) {
        return `${API_URL}${imageData.formats.medium.url}`;
      } else if (imageData.formats?.small?.url) {
        return `${API_URL}${imageData.formats.small.url}`;
      }
    }
    
    return null;
  };

  return (
    <div className="space-y-8 sm:space-y-12 md:space-y-16">
      {categories.map((cat) =>
        groupedProducts[cat.id]?.length ? (
          <section
            key={cat.id}
            ref={el => (sectionRefs.current[cat.id] = el)}
            className="mb-8 sm:mb-12 md:mb-16 last:mb-0"
            id={`category-${cat.id}`}
          >
            {/* Category Header with Image */}
            <div className="mb-6 sm:mb-8">
              {getCategoryImageUrl(cat) ? (
                <div className="relative w-full h-[120px] sm:h-[150px] md:h-[180px] lg:h-[200px] mb-4 sm:mb-6 rounded-2xl overflow-hidden">
                  <img
                    src={getCategoryImageUrl(cat)}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-sans antialiased text-gray-900 tracking-tight px-2">
                  {cat.name}
                </h2>
              )}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {groupedProducts[cat.id].map(item => (
                <FoodCard
                  key={item.id}
                  food={item}
                />
              ))}
            </div>
          </section>
        ) : null
      )}
    </div>
  );
}