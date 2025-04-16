import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "./BlogCard";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://blog-backend-l4jw.onrender.com/api/posts"
        );
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const renderBlogSection = () => {
    if (loading) {
      return (
        <div className="flex flex-col justify-center items-center min-h-[400px] bg-white  text-gray-900 dark:text-gray-100">
          <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mb-4"></div>
          <h2 className="text-xl font-semibold text-my-primary">Loading</h2>
          <p className="text-black  mt-1">Please wait....</p>
        </div>
      );
    }

    if (error) {
      return <p className="text-red-500">{error}</p>;
    }

    if (posts.length === 0) {
      return <p className="text-gray-500">No posts available.</p>;
    }

    return (
      <ul className="mt-7 card_grid">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </ul>
    );
  };

  return (
    <>
      <section className="pink_container pattern">
        <div className="bg-yellow-300 inline-block px-6 py-3 rounded-md mb-4 transform ">
          <span className="font-bold text-black">READ, WRITE, AND GROW</span>
        </div>
        <h1 className="heading">
          Share Your Stories, <br /> Connect With Readers and Writers
        </h1>

        <p className="sub-heading !max-w-3xl">
          Publish articles, gain followers, and engage with a community of
          passionate writers
        </p>

        {/* <SearchForm query={query} /> */}
      </section>

      <section className="section_container">
        <p className="font-bold text-3xl">
          {/* {query ? `Search results for "${query}"` : "All Blogs"} */}
          All Blogs
        </p>
        {renderBlogSection()}
      </section>
    </>
  );
};

export default Home;
