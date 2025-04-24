import React, { memo } from "react";
import { EyeIcon } from "lucide-react";
import { formatDate } from "../lib/utils";
import { NavLink } from "react-router-dom";

const BlogCard = memo(({ post, className }) => {
  const {
    title,
    createdAt,
    author,
    imageUrl,
    subtitle,
    views,
    categoryName,
    slug,
    authorProfileImage,
  } = post;

  const formatViews = (views) => {
    return views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views;
  };

  return (
    <NavLink to={`/blog/${slug}`} className={`${className} group`}>
      <div className="flex justify-between items-center">
        <p className="startup-card_date text-black">{formatDate(createdAt)}</p>
        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-my-primary" />
          <span className="text-16-medium text-black">
            {formatViews(views)}
          </span>
        </div>
      </div>

      <div className="flex justify-between mt-5 gap-5">
        <div className="flex-1">
          {/* Use div or span to avoid nesting anchors */}
          <div>
            <p className="font-medium text-lg line-clamp-1">{author}</p>
          </div>
          <div>
            <h3 className="font-semibold text-xl line-clamp-2 h-[56px]">
              {title}
            </h3>
          </div>
        </div>
        <div>
          <img
            src={authorProfileImage}
            alt={author}
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>
      </div>

      <div>
        <p className="startup-card_desc">{subtitle}</p>

        {/* TODO: To be updated */}
        <img
          src={imageUrl}
          width={400}
          height={200}
          alt="placeholder"
          className="startup-card_img"
        />
      </div>

      <div className="flex justify-between gap-3 mt-5 items-center">
        <div>
          <p className="font-medium text-lg">{categoryName}</p>
        </div>
        <button className="startup-card_btn">Details</button>
      </div>
    </NavLink>
  );
});

export default BlogCard;
