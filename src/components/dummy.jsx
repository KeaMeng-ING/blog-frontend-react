import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "./BlogCard";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://blog-backend-0th4.onrender.com/api/posts"
        );

        // Sort posts by createdAt in descending order (newest first)
        const sortedPosts = response.data.posts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setPosts(sortedPosts);
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
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorMessage error={error} />;
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
