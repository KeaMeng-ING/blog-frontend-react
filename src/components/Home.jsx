import React, { useEffect } from "react";
import { useAuthContext } from "../hook/useAuthContext";
import axios from "axios";
import { useState } from "react";

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
        console.log(response.data.posts);
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

  if (posts.length === 0) {
    return <p className="text-gray-500">No posts available.</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

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
        </p>
        <ul className="mt-7 card_grid">
          {posts.map((post) => (
            <h2> {post.title}</h2>
            // <BlogCard key={post.id} post={post} />
          ))}
        </ul>
      </section>
    </>
  );
};

export default Home;
