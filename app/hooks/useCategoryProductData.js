import { useState, useEffect } from "react";
import fetchData from "@/data/fetchData";

async function fetchCategories() {
  const res = await fetch("https://wise-book-dea9d4bff7.strapiapp.com/api/categories?populate=*", {
    cache: "no-store",
  });
  const json = await res.json();
  return json.data;
}

export default function useCategoryProductData() {
  const [categories, setCategories] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const cats = await fetchCategories();
      setCategories(cats);

      const allFoods = await fetchData();
      const foodMap = {};
      allFoods.forEach((f) => (foodMap[f.id] = f));

      const grouped = {};
      cats.forEach((cat) => {
        grouped[cat.id] = [];
        if (cat.products && cat.products.length > 0) {
          cat.products.forEach((p) => {
            grouped[cat.id].push(foodMap[p.id] || p);
          });
        }
      });
      setGroupedProducts(grouped);
      setLoading(false);
    }
    load();
  }, []);

  return { categories, groupedProducts, loading };
}