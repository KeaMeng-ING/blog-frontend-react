import React, { useState } from "react";
import CommentDropdown from "./CommentDropdown";
import { formatDate } from "../lib/utils";
import { NavLink } from "react-router-dom";
import EditComment from "./EditComment";

const Comment = ({ comment: initialComment, currentUser }) => {
  const [comment, setComment] = useState(initialComment);
  const [isEditing, setIsEditing] = useState(false);
  const { user, createdAt, content, id } = comment;
  const isOwner = currentUser === user.id;

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
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
        <CommentDropdown isOwner={isOwner} onEditClick={handleEditClick} />
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
    </article>
  );
};

export default Comment;
