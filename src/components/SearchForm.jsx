import React from "react";
import { Search } from "lucide-react";
import { X } from "lucide-react";
import { NavLink } from "react-router-dom";

const SearchForm = ({ query }) => {
  console.log(query);
  const reset = () => {
    const form = document.querySelector(".search-form");

    if (form) form.reset();
  };
  return (
    <form action="/" scroll={false} className="search-form">
      <input
        name="query"
        defaultValue={query}
        className="search-input"
        placeholder="Search Startups"
      />

      <div className="flex gap-2">
        {query && (
          <button type="reset" onClick={reset}>
            <NavLink href="/" className="search-btn text-white">
              <X className="size-5" />
            </NavLink>
          </button>
        )}
        <button type="submit" className="search-btn text-white">
          <Search className="size-5" />
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
