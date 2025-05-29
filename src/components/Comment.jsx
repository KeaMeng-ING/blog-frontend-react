import React, { useState } from "react";
import CommentDropdown from "./CommentDropdown";
import { formatDate } from "../lib/utils";
import { NavLink } from "react-router-dom";
import EditComment from "./EditComment";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

const Comment = ({
  comment: initialComment,
  currentUser,
  onCommentDeleted,
  setAllComments,
}) => {
  const [comment, setComment] = useState(initialComment);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Return null if comment was deleted
  if (!comment) return null;

  const { user, createdAt, content, id } = comment;
  const isOwner = currentUser === user.id;
  console.log(currentUser);
  console.log(user);
  console.log(user.id);
  console.log(isOwner);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDeleteComment = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      // Make API call to delete the comment
      await axios.delete(
        `https://blog-backend-a3p6.onrender.com/api/comments/${comment.id}`
      );

      // Close the modal
      setIsDeleteModalOpen(false);

      // Update local state
      setComment(null);
      setAllComments((prevComments) =>
        prevComments.filter((c) => c.id !== comment.id)
      );

      // Notify parent component (if provided)
      if (onCommentDeleted) {
        onCommentDeleted(id);
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      setDeleteError("Failed to delete the comment. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateComment = (updatedComment) => {
    setComment(updatedComment);
    setIsEditing(false);
  };

  return (
    <article id={`comment-${id}`} className="p-6 text-base bg-white rounded-lg">
      <footer className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <NavLink
            to={"/profile/" + user.username}
            className="inline-flex items-center mr-3 text-sm text-my-primary font-semibold"
          >
            <img
              className="mr-2 w-6 h-6 rounded-full object-cover"
              src={user.imageUrl}
              alt={user.username}
            />
            {user.username}
          </NavLink>
          <p className="text-sm text-gray-600">
            <time dateTime={createdAt} title={formatDate(createdAt)}>
              {formatDate(createdAt)}
            </time>
          </p>
        </div>
        <CommentDropdown
          isOwner={isOwner}
          onEditClick={handleEditClick}
          onRemoveClick={() => setIsDeleteModalOpen(true)}
        />
      </footer>

      {isEditing ? (
        <EditComment
          comment={comment}
          onCancel={handleCancelEdit}
          onUpdate={handleUpdateComment}
        />
      ) : (
        <p className="text-black">{content}</p>
      )}

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent className="max-w-md bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-my-primary">
              Delete Comment
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">
              {deleteError}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="hover:text-my-primary"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteComment}
              disabled={isDeleting}
              className="bg-my-primary hover:bg-red-600 focus:ring-red-500 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Comment"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </article>
  );
};

export default Comment;
