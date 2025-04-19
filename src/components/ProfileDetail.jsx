import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hook/useAuthContext";
import { useParams } from "react-router-dom"; // Import useParams
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import BlogCard from "./BlogCard";
import { handleApiError } from "../lib/handleApiError";

const ProfileDetail = () => {
  const { user, logout } = useAuthContext();
  //  Get userName from params
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://blog-backend-0th4.onrender.com/api/posts/profile/" + username
        );
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        // setError("Failed to fetch posts. Please try again later.");
        handleApiError(error, logout, setError);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [username]);

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
      <ul className="card_grid-sm">
        {posts.map((post) => (
          <BlogCard
            key={post.id}
            post={post}
            className={"profile-startup-card"}
          />
        ))}
      </ul>
    );
  };

  return (
    <section className="profile_container">
      <div className="profile_card">
        <div className="profile_title">
          {" "}
          <h3 className="text-24-black uppercase text-center line-clamp-1">
            {user.firstName}
          </h3>{" "}
        </div>

        <img
          src={user.imageUrl}
          alt={user.userName}
          width={220}
          height={220}
          className="profile_image"
        />

        <p className="text-30-extrabold mt-7 text-center">@{user?.userName}</p>
        {/* TODO: Should be Bio */}
        <p className="mt-1 text-center font-normal text-sm text-white">
          Entrepreneur
        </p>
      </div>
      <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
        <p className="text-30-bold">
          {user?.userName === username ? "Your" : "All"} Startups
        </p>
        {renderBlogSection()}
      </div>
    </section>
  );
};

export default ProfileDetail;
