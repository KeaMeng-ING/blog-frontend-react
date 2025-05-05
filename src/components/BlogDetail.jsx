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
import DOMPurify from "dompurify"; // Import DOMPurify for sanitizing HTML
import Comment from "./Comment";

const BlogDetail = () => {
  const { slug } = useParams(); // Extract the slug from the URL
  const [blog, setBlog] = useState(null);
  const [sameAuthorBlogs, setSameAuthorBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuthContext();
  const hasIncrementedView = useRef(false);
  const [message, setMessage] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/posts/${slug}`
        );

        // Store the blog data
        setBlog(response.data.post);
        setSameAuthorBlogs(response.data.postsFromSameAuthor);
        setMessage(response.data.message);
        setAllComments(response.data.post.comments);

        // Only increment view if not already viewed and not incremented in this mount
        if (!hasIncrementedView.current) {
          hasIncrementedView.current = true; // Mark as attempted
          await axios.put(
            `http://localhost:8080/api/posts/${slug}/incrementViews`
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

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    // Check if comments empty
    if (!newComment.trim()) {
      setCommentError("Comment cannot be empty");
      return;
    }

    // Check if user is logged in
    if (!user) {
      setCommentError("You must be logged in to comment");
      return;
    }

    const data = {
      postSlug: slug,
      content: newComment,
      userId: user.id,
    };

    try {
      setCommentError("");
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8080/api/comments",
        data
      );

      const newCommentData = response.data;
      console.log(newCommentData);

      setAllComments([...allComments, newCommentData]);
      setNewComment("");

      setTimeout(() => {
        const commentElement = document.getElementById(
          `comment-${newCommentData.id}`
        );
        if (commentElement) {
          commentElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    } catch (err) {
      console.error("Error posting comment:", err);
      handleApiError(err, logout, setCommentError);
    } finally {
      setLoading(false);
    }
  };

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
            <NavLink
              to={"/profile/" + blog.author.username}
              className="flex gap-5 items-center mb-3"
            >
              <img
                src={blog.author.imageUrl}
                alt="avatar"
                className="rounded-full drop-shadow-lg w-[48px] h-[48px] object-cover"
              />
              <div>
                <p className="text-20-medium">{blog.author.firstName}</p>
                <p className="text-16-medium !text-black-300">
                  @{blog.author.username}
                </p>
              </div>
            </NavLink>
            <p className="category-tag">{blog.category.name}</p>
          </div>

          <h3 className="text-[30px] font-bold text-black;">Blog Details</h3>
          {blog.content ? (
            <article
              className="prose max-w-4xl text-[18px]/6 break-words article-content"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(blog.content), // Sanitize the HTML content
              }}
            ></article>
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>
        <hr className="divider" />

        <div className="max-w-4xl mx-auto">
          <section className="bg-white">
            <div className="max-w-4xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg lg:text-2xl font-bold text-gray-900">
                  Discussion ({allComments.length})
                </h2>
              </div>
              <form className="mb-6" onSubmit={handleCommentSubmit}>
                <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
                  <label htmlFor="comment" className="sr-only">
                    Your comment
                  </label>
                  <textarea
                    id="comment"
                    rows="6"
                    className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={handleCommentChange}
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-my-primary rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-my-primary-100"
                >
                  Post comment
                </button>
                {commentError && (
                  <p className="mt-2 text-sm text-red-600">{commentError}</p>
                )}
              </form>
              {allComments && allComments.length > 0 ? (
                <ul className="comment-list space-y-4">
                  {allComments.map((comment, i) => (
                    <li key={i}>
                      <Comment
                        setAllComments={setAllComments}
                        comment={comment}
                        currentUser={user.id}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-result">No comments available</p>
              )}
            </div>
          </section>
        </div>
        <hr className="divider" />

        {sameAuthorBlogs.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <p className="font-semibold text-[30px] text-black">{message}</p>
            <div className="horizontal-scroll-container">
              <ul className="horizontal-card-grid">
                {sameAuthorBlogs.map((post, i) => (
                  <BlogCard
                    key={i}
                    post={post}
                    className={"startup-card"}
                    profileImage={blog.author.imageUrl}
                  />
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
