"use client";
import { useRef, useState, useEffect } from "react";
import { Suspense } from "react";
import fetchData from "@/data/fetchData";
import fetchCategories from "@/app/components/fetchCategories";
import CategoryCarousel from "@/app/components/CategoryCarousel";
import GroupedProductSections from "@/app/components/GroupedProductSections";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Fetch both products and categories
        const [productsData, categoriesData] = await Promise.all([
          fetchData(),
          fetchCategories()
        ]);
        
        console.log('Products Data:', productsData);
        console.log('Categories Data:', categoriesData);
        
        // Group products by category
        const grouped = productsData.reduce((acc, product) => {
          if (product.category?.id) {
            if (!acc[product.category.id]) {
              acc[product.category.id] = [];
            }
            acc[product.category.id].push(product);
          }
          return acc;
        }, {});

        console.log('Grouped Products:', grouped);

        setProducts(productsData);
        setCategories(categoriesData);
        setGroupedProducts(grouped);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCategory = (catId) => {
    if (sectionRefs.current[catId]) {
      sectionRefs.current[catId].scrollIntoView({ 
        behavior: "smooth", 
        block: "start" 
      });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-red-700 py-10 px-4">
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-md">
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Products</h2>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-0" />
        <div className="flex flex-col items-center z-10">
          <Image
            src="/logo.webp"
            alt="Logo"
            width={110}
            height={110}
            className="mb-4 animate-pulse"
            priority
          />
          <span className="text-red-700 text-lg font-semibold">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-700 py-6 px-4 sm:px-6 md:px-8 lg:px-10">
      {/* Logo at the top */}
      <div className="w-full flex justify-center mt-4 mb-2">
        <button onClick={() => window.location.reload()} className="focus:outline-none">
          <Image
            src="/logo.webp"
            alt="Logo"
            width={120}
            height={120}
            className="rounded-full bg-white shadow-md hover:scale-105 transition-transform duration-200 w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px]"
            priority
          />
        </button>
      </div>
      {/* Main white container */}
      <div className="w-full bg-white p-4 sm:p-5 md:p-6 lg:p-8 rounded-2xl shadow-md">
        {/* Banner at the top of the inner container */}
        <div className="w-full flex justify-center mb-6">
          <div className="w-full max-w-[1400px] px-2">
            <Image
              src="/header.webp"
              alt="Header Banner"
              width={1400}
              height={400}
              className="rounded-3xl w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] object-cover"
              priority
              quality={100}
            />
          </div>
        </div>
        {/* Category row below banner */}
        <Suspense fallback={<CategorySkeleton />}>
          <CategoryCarousel
            categories={categories}
            selectedCat={null}
            onSelect={handleCategory}
          />
        </Suspense>

        {loading ? (
          <ProductsSkeleton />
        ) : (
          <Suspense fallback={<ProductsSkeleton />}>
            <GroupedProductSections
              categories={categories}
              groupedProducts={groupedProducts}
              sectionRefs={sectionRefs}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}

function CategorySkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-12 w-32 rounded-full" />
      ))}
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="space-y-8 py-8">
      {[1, 2].map((section) => (
        <div key={section} className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} className="h-[250px] sm:h-[280px] md:h-[300px] rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}