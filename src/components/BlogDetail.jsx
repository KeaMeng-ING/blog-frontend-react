import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../hook/useAuthContext";
import { formatDate } from "../lib/utils";
import LoadingSpinner from "./LoadingSpinner";
import { NavLink } from "react-router-dom";
import BlogCard from "./BlogCard";
import ErrorMessage from "./ErrorMessage";

const BlogDetail = () => {
  const { slug } = useParams(); // Extract the slug from the URL
  const [blog, setBlog] = useState(null);
  const [sameAuthorBlogs, setSameAuthorBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { logout } = useAuthContext();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://blog-backend-l4jw.onrender.com/api/posts/${slug}`
        );

        setBlog(response.data.post);
        setSameAuthorBlogs(response.data.postsFromSameAuthor);
      } catch (err) {
        console.error("Error fetching blog:", err);
        if (err.response.data == "Forbidden") {
          logout();
        }
        setError("Failed to fetch blog details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug, logout]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

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
            <NavLink to="#" className="flex gap-2 items-center mb-3">
              {/* TODO: Update user profile */}
              <img
                src="https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png"
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />
              <div>
                <p className="text-20-medium">{blog.author.firstName}</p>
                <p className="text-16-medium !text-black-300">
                  @{blog.author.firstName} {/* TODO: Update to have username */}
                </p>
              </div>
            </NavLink>
            <p className="category-tag">{blog.category.name}</p>
          </div>

          <h3 className="text-[30px] font-bold text-black;">Pitch Details</h3>
          {blog.content ? (
            <article className="prose max-w-4xl font-work-sans break-all">
              {blog.content}
            </article>
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>
        <hr className="divider" />
        <div className="max-w-4xl mx-auto">
          <p className="font-semibold text-[30px] text-black">
            From The Same Author
          </p>
          <ul className="mt-7 card_grid-sm">
            {sameAuthorBlogs.map((post, i) => (
              <BlogCard key={i} post={post} />
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default BlogDetail;
