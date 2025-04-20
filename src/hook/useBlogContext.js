import BlogContext from "../context/BlogContext";
import { useContext } from "react";

export const useBlogContext = () => {
  const context = useContext(BlogContext);

  if (!context) {
    throw new Error("useBlogContext must be used within an AuthProvider");
  }
  return context;
};
