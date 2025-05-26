import { getProductBySlug } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return (
      <div className="min-h-screen bg-red-700 py-10 px-4">
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-md">
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Product Not Found</h2>
            <p className="text-gray-600">The product you're looking for doesn't exist.</p>
            <Link 
              href="/"
              className="mt-6 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors inline-block"
            >
              Back to Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get the appropriate image URL with proper fallbacks
  const getProductImageUrl = () => {
    if (product.image && Array.isArray(product.image) && product.image.length > 0) {
      const imageData = product.image[0];
      if (imageData.url) {
        return imageData.url;
      }
      const formats = imageData.formats;
      if (formats) {
        if (formats.large?.url) return formats.large.url;
        if (formats.medium?.url) return formats.medium.url;
        if (formats.small?.url) return formats.small.url;
      }
    }
    return null;
  };

  // Format price with proper currency and separators
  const formattedPrice = new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(product.price);

  const formattedOriginalPrice = product.originalPrice ? new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(product.originalPrice) : null;

  return (
    <div className="min-h-screen bg-red-700 py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <Link 
          href="/"
          className="mb-6 px-6 py-2 bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-colors inline-flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Menu
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative w-full aspect-[4/3] md:aspect-square rounded-lg overflow-hidden">
            {getProductImageUrl() ? (
              <Image
                src={getProductImageUrl()}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
                priority
                quality={85}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <span>No image available</span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Category Badge */}
            {product.category && (
              <span className="inline-block bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                {product.category.name}
              </span>
            )}

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              {formattedOriginalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  {formattedOriginalPrice}
                </span>
              )}
              <span className="text-3xl font-bold text-red-600">
                {formattedPrice}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-2">Description</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Availability Status */}
            <div className="pt-8">
              {product.available ? (
                <button
                  className="w-full py-4 px-8 bg-red-600 hover:bg-red-700 text-white text-lg font-bold rounded-full transition-colors"
                >
                  Add to Cart
                </button>
              ) : (
                <button
                  className="w-full py-4 px-8 bg-gray-300 text-gray-500 text-lg font-bold rounded-full cursor-not-allowed"
                  disabled
                >
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 