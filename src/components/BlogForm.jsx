import React, { useEffect } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

const BlogForm = () => {
  // const [pitch, setPitch] = useState("");

  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://blog-backend-l4jw.onrender.com/api/posts/category"
        );
        console.log(response.data.categories);
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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

  const options = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));
  const defaultOption = "Choose Category";

  const handleSelect = (option) => {
    setSelectedOption(option);
    console.log("Selected option:", option);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Generate a preview URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);

    try {
      // Get form values
      const title = e.target.title.value;
      const subtitle = e.target.description.value; // Using description as subtitle
      const content = e.target.content.value;
      const categoryId = selectedOption?.value;

      let imageData = null;
      if (image) {
        const base64 = await toBase64(image);
        imageData = base64;
      }

      console.log(imageData);
      // Create the request payload
      const blogData = {
        title,
        subtitle,
        content,
        categoryId,
        imageUrl: imageData,
      };

      // Send the blog data as JSON
      await axios.post(
        "https://blog-backend-l4jw.onrender.com/api/posts",
        blogData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("Blog submitted successfully!");
      // Optionally reset the form here
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to submit form. Please try again later.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <section className="pink_container  pattern !min-h-[230px]">
        <h1 className="heading">Create Your Blog Today</h1>
      </section>

      <form action="" className="startup-form" onSubmit={handleSubmit}>
        <div className="flex-col">
          <label htmlFor="title" className="startup-form_label font-poppins">
            Title
          </label>
          <input
            id="title"
            name="title"
            className="startup-form_input font-poppins"
            required
            placeholder="Blog Title"
          />

          {/* {errors.title && <p className="startup-form_error">{errors.title}</p>} */}
        </div>

        <div className="flex-col">
          <label htmlFor="description" className="startup-form_label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="startup-form_textarea"
            required
            placeholder="Blog Description"
          />

          {/* {errors.description && (
          <p className="startup-form_error">{errors.description}</p>
        )} */}
        </div>

        <div className="flex-col">
          <label htmlFor="category" className="startup-form_label">
            Category
          </label>
          <Dropdown
            options={options}
            onChange={handleSelect} // Use the defined function here
            value={selectedOption || defaultOption}
            placeholder="Select an option"
            className="startup-form_input"
          />
        </div>

        <div className="flex flex-col space-y-3">
          <label htmlFor="image" className="startup-form_label">
            Image
          </label>

          <div className="flex flex-col md:flex-row md:items-center gap-6 relative">
            {!imagePreview && (
              <label
                htmlFor="file"
                className="image-upload cursor-pointer w-full md:w-64 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition"
              >
                <span className="text-sm">Choose Image File</span>
                <input
                  id="file"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
              </label>
            )}

            {imagePreview && (
              <div className="relative w-full md:w-64 h-32">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-xl border shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)} // make sure this state exists
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 shadow"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            )}
          </div>
          {/* {errors.link && <p className="text-red-500 text-sm">{errors.link}</p>} */}
        </div>

        <div className="flex-col">
          <label htmlFor="content" className="startup-form_label">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            className="startup-form_textarea"
            required
            placeholder="Write your blog content here..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="startup-form_btn text-white"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Submit Your Blog"}
        </button>
      </form>
    </>
  );
};

export default BlogForm;
