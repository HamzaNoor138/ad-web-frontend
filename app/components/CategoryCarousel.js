"use client";

export default function CategoryCarousel({ categories, selectedCat, onSelect }) {
  return (
    <div className="sticky top-0 z-30 bg-white py-4 mb-8">
      <div className="flex justify-center">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide px-2 py-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`whitespace-nowrap px-6 py-2 rounded-full border font-semibold transition-all duration-200
                ${selectedCat === cat.id
                  ? "bg-red-500 text-white border-red-500 shadow"
                  : "bg-red-100 text-red-700 border-red-200 hover:bg-red-200"}
                `}
              onClick={() => onSelect(cat.id)}
              style={{ fontSize: "1.1rem", letterSpacing: "0.01em" }}
              aria-label={cat.name}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}