import React, { createContext, useContext, useState } from "react";

const BlogContext = createContext();

export const useBlogContext = () => useContext(BlogContext);

export const BlogProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const value = {
    categories,
    setCategories,
    selectedCategory,
    setSelectedCategory,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};
