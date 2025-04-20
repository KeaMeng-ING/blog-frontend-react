import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import Header from "../components/layouts/Header";

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [contextPosts, setContextPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://blog-backend-0th4.onrender.com/api/posts"
        );
        // const topViewedPosts = response.data.posts
        //   .sort((a, b) => b.views - a.views)
        //   .slice(0, 6);
        setContextPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <LoadingSpinner />;
      </>
    );
  }

  return (
    <BlogContext.Provider
      value={{
        contextPosts,
        loading,
        error,
        setContextPosts,
        setLoading,
        setError,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export default BlogContext;
