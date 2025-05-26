"use client";
import FoodCard from "@/app/components/FoodCard";
import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export default function GroupedProductSections({ categories, groupedProducts, sectionRefs }) {
  const [loadedImages, setLoadedImages] = useState({});

  // Function to get category image URL
  const getCategoryImageUrl = (category) => {
    // Handle the case where image is in attributes (new Strapi structure)
    if (category.attributes?.image?.data) {
      const imageData = category.attributes.image.data;
      // Use only original image URL
      if (imageData.attributes?.url) {
        return `${API_URL}${imageData.attributes.url}`;
      }
    }
    
    // Handle the case where image is direct array (old structure)
    if (category.image && Array.isArray(category.image) && category.image.length > 0) {
      const imageData = category.image[0];
      // Use only original image URL
      if (imageData.url) {
        return `${API_URL}${imageData.url}`;
      }
    }
    
    return null;
  };

  const handleImageLoad = (catId) => {
    setLoadedImages(prev => ({ ...prev, [catId]: true }));
  };

  return (
    <div className="space-y-8 sm:space-y-12 md:space-y-16">
      {categories.map((cat, categoryIndex) => {
        const imageUrl = getCategoryImageUrl(cat);
        return groupedProducts[cat.id]?.length ? (
          <section
            key={cat.id}
            ref={el => (sectionRefs.current[cat.id] = el)}
            className="mb-8 sm:mb-12 md:mb-16 last:mb-0"
            id={`category-${cat.id}`}
          >
            {/* Category Header with Image */}
            <div className="px-2 sm:px-4">
              <div className="relative w-full max-w-[1100px] aspect-[16/7] sm:aspect-[16/9] md:aspect-[16/7] lg:aspect-[16/5] mx-auto overflow-hidden rounded-2xl">
                {/* Category Image */}
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, 1100px"
                    className={`transition-opacity duration-300 object-contain sm:object-cover ${
                      loadedImages[cat.id] ? 'opacity-100' : 'opacity-0'
                    }`}
                    priority={categoryIndex === 0}
                    quality={100}
                    onLoad={() => handleImageLoad(cat.id)}
                  />
                )}
              </div>
            </div>

            {/* Products Grid */}
            <div className="mt-1 sm:mt-4 md:mt-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 w-full max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8">
              {groupedProducts[cat.id].map((item, index) => (
                <FoodCard
                  key={item.id}
                  food={item}
                  priority={categoryIndex === 0 && index < 4}
                />
              ))}
            </div>
          </section>
        ) : null;
      })}
    </div>
  );
}