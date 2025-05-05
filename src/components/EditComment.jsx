import React, { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../hook/useAuthContext";
import { handleApiError } from "../lib/handleApiError";

const EditComment = ({ comment, onCancel, onUpdate }) => {
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { logout } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate content
    if (!editedContent.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const data = {
      id: comment.id,
      content: editedContent,
    };

    try {
      const response = await axios.put(
        "http://localhost:8080/api/comments",
        data
      );
      console.log(response.data);
      // Update the comment locally
      onUpdate(response.data);
    } catch (err) {
      console.error("Error updating comment:", err);
      handleApiError(err, logout, setError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="py-2 px-4 mb-2 bg-white rounded-lg border border-gray-200">
        <textarea
          rows="4"
          className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          placeholder="Edit your comment..."
          required
        ></textarea>
      </div>

      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center py-2 px-3 text-xs font-medium text-center text-white bg-my-primary rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-my-primary-100 disabled:opacity-70"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center py-2 px-3 text-xs font-medium text-center text-gray-900 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditComment;
