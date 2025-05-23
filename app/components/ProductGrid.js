import { memo } from 'react';
import FoodCard from "@/app/components/FoodCard";
import { Skeleton } from "@/components/ui/skeleton";

function ProductGrid({ foods = [], loading = false, error = null }) {
  if (error) {
    return (
      <div className="col-span-full p-4 sm:p-8 text-center rounded-lg bg-red-50">
        <h3 className="text-base sm:text-lg font-semibold text-red-600 mb-2">Error Loading Products</h3>
        <p className="text-sm sm:text-base text-gray-600">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="flex flex-col space-y-3 sm:space-y-4">
            <Skeleton className="w-full aspect-square rounded-2xl" />
            <Skeleton className="h-3 sm:h-4 w-3/4" />
            <Skeleton className="h-3 sm:h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!foods || foods.length === 0) {
    return (
      <div className="col-span-full py-16 sm:py-24 md:py-32 text-center">
        <div className="max-w-md mx-auto px-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
          <p className="text-sm sm:text-base text-gray-500">
            We couldn't find any products matching your criteria. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {foods.map((food) => (
        <FoodCard
          key={food.id}
          food={food}
        />
      ))}
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(ProductGrid);