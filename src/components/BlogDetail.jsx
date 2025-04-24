import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../hook/useAuthContext";
import { formatDate } from "../lib/utils";
import LoadingSpinner from "./LoadingSpinner";
import { NavLink } from "react-router-dom";
import BlogCard from "./BlogCard";
import ErrorMessage from "./ErrorMessage";
import { handleApiError } from "../lib/handleApiError";

const BlogDetail = () => {
  const { slug } = useParams(); // Extract the slug from the URL
  const [blog, setBlog] = useState(null);
  const [sameAuthorBlogs, setSameAuthorBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { logout } = useAuthContext();
  const hasIncrementedView = useRef(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://blog-backend-0th4.onrender.com/api/posts/${slug}`
        );

        // Store the blog data
        setBlog(response.data.post);
        setSameAuthorBlogs(response.data.postsFromSameAuthor);
        setMessage(response.data.message);

        // Only increment view if not already viewed and not incremented in this mount
        if (!hasIncrementedView.current) {
          hasIncrementedView.current = true; // Mark as attempted
          await axios.put(
            `https://blog-backend-0th4.onrender.com/api/posts/${slug}/incrementViews`
          );
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        handleApiError(err, logout, setError);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug, logout]);

  useEffect(() => {
    hasIncrementedView.current = false;
  }, [slug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  console.log(blog);

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <div className="bg-yellow-300 inline-block px-6 py-3 rounded-md mb-4 transform ">
          <span className="font-bold text-black">
            {formatDate(blog.createdAt)}
          </span>
        </div>
        <h1 className="heading">{blog.title}</h1>
        <p className="sub-heading !max-w-3xl">{blog.subtitle}</p>
      </section>
      <section className="section_container">
        <img
          src={blog.imageUrl}
          alt="thumbnail"
          className="w-full h-auto rounded-xl"
        />
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex justify-between items-center gap-5">
            <NavLink to="#" className="flex gap-5 items-center mb-3">
              {/* TODO: Update user profile */}
              <img
                src={blog.author.imageUrl}
                alt="avatar"
                width={45}
                height={45}
                className="rounded-full drop-shadow-lg"
              />
              <div>
                <p className="text-20-medium">{blog.author.firstName}</p>
                <p className="text-16-medium !text-black-300">
                  @{blog.author.username} {/* TODO: Update to have username */}
                </p>
              </div>
            </NavLink>
            <p className="category-tag">{blog.category.name}</p>
          </div>

          <h3 className="text-[30px] font-bold text-black;">Blog Details</h3>
          {blog.content ? (
            <article className="prose max-w-4xl font-work-sans break-words">
              {blog.content.split("\n").map((line, idx) => (
                <p key={idx} className="mb-4">
                  {line}
                </p>
              ))}
            </article>
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>
        <hr className="divider" />
        {sameAuthorBlogs.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <p className="font-semibold text-[30px] text-black">{message}</p>
            <div className="horizontal-scroll-container">
              <ul className="horizontal-card-grid">
                {sameAuthorBlogs.map((post, i) => (
                  <BlogCard key={i} post={post} className={"startup-card"} />
                ))}
              </ul>
            </div>
          </div>
        )}
        <div className="view-container">
          <div className="absolute -top-2 -right-2">
            <div className="relative">
              <div className="absolute -left-4 top-1">
                <span className="flex size-[11px]">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex size-[11px] rounded-full bg-my-primary"></span>
                </span>
              </div>
            </div>
          </div>

          <p className="view-text">
            <span className="font-black">Views: {blog.views + 1}</span>
          </p>
        </div>
      </section>
    </>
  );
};

export default BlogDetail;
