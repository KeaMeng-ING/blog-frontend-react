import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "./BlogCard";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import SearchForm from "./SearchForm";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allPosts, setAllPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [showAllPosts, setShowAllPosts] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://blog-backend-a3p6.onrender.com/api/posts"
        );

        // Sort all posts by views
        const sortedPosts = response.data.posts.sort(
          (a, b) => b.views - a.views
        );

        setAllPosts(sortedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Filter and display posts whenever relevant state changes
  useEffect(() => {
    if (allPosts.length === 0) return;

    // First filter posts based on query if it exists
    let filteredResults = allPosts;
    if (query.trim()) {
      filteredResults = allPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.content.toLowerCase().includes(query.toLowerCase()) ||
          (post.author &&
            post.author.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Then decide how many to show based on showAllPosts flag
    if (showAllPosts) {
      setDisplayedPosts(filteredResults); // Show all filtered posts
    } else {
      setDisplayedPosts(filteredResults.slice(0, 6)); // Show only first 6
    }
  }, [allPosts, query, showAllPosts]);

  const handleViewAllBlogs = () => {
    setShowAllPosts(true);
  };

  const renderBlogSection = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorMessage error={error} />;
    }

    if (displayedPosts.length === 0) {
      return (
        <p className="text-gray-500">
          {query
            ? "No posts found matching your search."
            : "No posts available."}
        </p>
      );
    }

    return (
      <ul className="mt-7 card_grid">
        {displayedPosts.map((post) => (
          <BlogCard key={post.id} post={post} className={"startup-card"} />
        ))}
      </ul>
    );
  };

  // Only show button if there are more posts to display
  const shouldShowViewAllButton = () => {
    if (showAllPosts) return false; // Don't show if already showing all

    let filteredResults = allPosts;
    if (query.trim()) {
      filteredResults = allPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.content.toLowerCase().includes(query.toLowerCase()) ||
          (post.author &&
            post.author.toLowerCase().includes(query.toLowerCase()))
      );
    }

    return filteredResults.length > 6; // Only show if there are more than 6 posts to display
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
        <SearchForm query={query} setQuery={setQuery} />
      </section>
      <section className="section_container">
        <p className="font-bold text-3xl">
          {query ? `Search results for "${query}"` : "All Blogs"}
        </p>
        {renderBlogSection()}
        <div className="mt-10 text-center">
          {shouldShowViewAllButton() && (
            <button
              onClick={handleViewAllBlogs}
              className="bg-my-primary text-white px-6 py-2 rounded-md font-bold hover:bg-my-primary-100 hover:text-my-primary duration-200"
            >
              View All Blogs
            </button>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
