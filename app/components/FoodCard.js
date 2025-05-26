"use client";
import { useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ProductDetail from "./ProductDetail";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export default function FoodCard({ food, priority = false }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  // Get the appropriate image URL with proper fallbacks
  let imgSrc = null;
  if (food.image && Array.isArray(food.image) && food.image.length > 0) {
    const imageData = food.image[0];
    if (imageData.formats?.small?.url) {
      imgSrc = `${API_URL}${imageData.formats.small.url}`;
    } else if (imageData.url) {
      imgSrc = `${API_URL}${imageData.url}`;
    }
  }

  // Format price with proper currency and separators
  const formattedPrice = new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(food.price);

  // Handle image load complete
  const handleImageLoad = useCallback(() => {
    setImgLoaded(true);
  }, []);

  // Handle image load error
  const handleImageError = useCallback((e) => {
    console.error('Image load error:', e);
    setImgLoaded(true); // Show no-image state
  }, []);

  // Handle card click
  const handleCardClick = useCallback(() => {
    setShowDetail(true);
  }, []);

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col items-center text-center pb-3 sm:pb-4 md:pb-6 pt-0 px-0 border-2 border-transparent 
        transition-all duration-200 relative hover:border-red-500 hover:bg-red-50 group
        hover:scale-[1.02] hover:shadow-xl cursor-pointer h-full w-full"
      >
        {/* Availability Badge */}
        {!food.available && (
          <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 z-10">
            <span className="bg-gray-100 text-gray-800 text-xs sm:text-sm font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Image Container */}
        <div className="relative w-full aspect-square">
          {imgSrc ? (
            <>
              {!imgLoaded && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse" />
              )}
              <Image
                src={imgSrc}
                alt={food.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                className={`transition-opacity duration-300 object-cover ${
                  imgLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                priority={priority}
                quality={85}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}
        </div>

        <div className="px-2 sm:px-3 md:px-4 pt-2 sm:pt-3 md:pt-4 w-full flex flex-col flex-grow">
          {/* Title */}
          <h2 
            className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 line-clamp-1 hover:line-clamp-none" 
            title={food.name}
          >
            {food.name}
          </h2>

          {/* Description */}
          {food.description && (
            <p 
              className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2 sm:mb-3 hover:line-clamp-none flex-grow"
              title={food.description}
            >
              {food.description}
            </p>
          )}

          {/* Price and Action */}
          <div className="mt-auto space-y-2 sm:space-y-3">
            <p className="text-xs sm:text-sm font-semibold text-white bg-red-600 rounded-full px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 inline-block">
              {formattedPrice}
            </p>

            <button
              className={`w-full py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-base font-semibold rounded-full transition-all duration-200 ${
                food.available
                  ? "bg-red-600 hover:bg-red-700 text-white transform hover:scale-[1.02]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!food.available}
              aria-label={food.available ? `Add ${food.name} to cart` : `${food.name} is out of stock`}
            >
              {food.available ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetail
        product={food}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
      />
    </>
  );
}