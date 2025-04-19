import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "./BlogCard";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import SearchForm from "./SearchForm";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [query, setQuery] = useState("");

  // TODO: We can change all Blog to recommend/trending Blog based on views
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://blog-backend-0th4.onrender.com/api/posts"
        );
        const sortedPosts = response.data.posts.sort((a, b) => b.id - a.id);
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

  const handleSearch = () => {
    if (!query.trim()) {
      setFilteredPosts(posts);
      return;
    }

    const searchResults = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        (post.author && post.author.toLowerCase().includes(query.toLowerCase()))
    );
    console.log(searchResults);
    setFilteredPosts(searchResults);
  };

  // Run search when query changes
  useEffect(() => {
    handleSearch();
  }, [query]);

  const renderBlogSection = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorMessage error={error} />;
    }

    // Change this section to use filteredPosts instead of posts
    const postsToDisplay = query ? filteredPosts : posts;

    if (postsToDisplay.length === 0) {
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
        {postsToDisplay.map((post) => (
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

        <SearchForm query={query} setQuery={setQuery} />
      </section>

      <section className="section_container">
        <p className="font-bold text-3xl">
          {query ? `Search results for "${query}"` : "All Blogs"}
        </p>
        {renderBlogSection()}
      </section>
    </>
  );
};

export default Home;
