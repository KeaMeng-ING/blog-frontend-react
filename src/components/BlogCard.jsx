import React from "react";
import { EyeIcon } from "lucide-react";
import { formatDate } from "../lib/utils";
import { NavLink } from "react-router-dom";

const BlogCard = ({ post }) => {
  const {
    title,
    createdAt,
    author,
    imageUrl,

    subtitle,
    views,
    categoryName,
  } = post;

  return (
    <li className="startup-card group ">
      <div className=" flex justify-between items-center">
        <p className="startup-card_date text-black">{formatDate(createdAt)}</p>
        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-my-primary" />
          <span className="text-16-medium text-black">{views}</span>
          {/* TODO: make views update everytime they click on it */}
        </div>
      </div>

      <div className="flex justify-between mt-5 gap-5">
        <div className="flex-1">
          <NavLink href="#">
            <p className="font-medium text-lg line-clamp-1">{author}</p>
          </NavLink>
          <NavLink href="#">
            <h3 className="font-semibold text-xl line-clamp-2 h-[56px]">
              {title}
            </h3>
          </NavLink>
        </div>
        <NavLink href="#">
          {/* <Image
            src={image_url}
            alt={author}
            width={48}
            height={48}
            className="rounded-full"
          /> */}
          <h1>author</h1>
        </NavLink>
      </div>

      <NavLink href="#">
        <p className="startup-card_desc">{subtitle}</p>

        {/* TODO: To be updated */}
        <img
          src={imageUrl}
          width={400}
          height={200}
          alt="placeholder"
          className="startup-card_img"
        />
      </NavLink>

      <div className="flex justify-between gap-3 mt-5 items-center">
        <NavLink href="#">
          <p className=" font-medium text-lg">{categoryName}</p>
        </NavLink>
        <button className="startup-card_btn" asChild>
          <NavLink href="#">Details</NavLink>
        </button>
      </div>
    </li>
  );
};

export default BlogCard;
