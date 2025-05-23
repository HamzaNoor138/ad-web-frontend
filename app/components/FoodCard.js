"use client";
import { useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ProductDetail from "./ProductDetail";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export default function FoodCard({ food }) {
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
        className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col items-center text-center pb-4 sm:pb-6 pt-0 px-0 border-2 border-transparent 
        transition-all duration-200 relative hover:border-red-500 hover:bg-red-50 group
        hover:scale-[1.02] hover:shadow-xl cursor-pointer h-full"
      >
        {/* Category Tag */}
        {food.category && (
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
            <span className="bg-red-100 text-red-800 text-xs sm:text-sm font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
              {food.category.name}
            </span>
          </div>
        )}

        {/* Availability Badge */}
        {!food.available && (
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
            <span className="bg-gray-100 text-gray-800 text-xs sm:text-sm font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Image Container */}
        <div className="relative w-full aspect-square">
          {!imgLoaded && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={food.name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm text-gray-500 bg-gray-50">
              <span className="flex items-center gap-1 sm:gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                No Image
              </span>
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="px-3 sm:px-4 pt-3 sm:pt-4 w-full flex flex-col flex-grow">
          {/* Title */}
          <h2 
            className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 line-clamp-1 hover:line-clamp-none" 
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
            <p className="text-xs sm:text-sm font-semibold text-white bg-red-600 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 inline-block">
              {formattedPrice}
            </p>

            <button
              className={`w-full py-1.5 sm:py-2.5 text-sm sm:text-base font-semibold rounded-full transition-all duration-200 ${
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