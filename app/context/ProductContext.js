"use client";
import { createContext, useContext } from "react";

// Create the context
export const ProductContext = createContext([]);
export function useProducts() {
  return useContext(ProductContext);
}