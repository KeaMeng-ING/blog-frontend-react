// In SearchForm.js
import React from "react";
import { Search } from "lucide-react";
import { X } from "lucide-react";

const SearchForm = ({ query, setQuery }) => {
  // Added setQuery prop

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const reset = () => {
    setQuery("");
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        name="query"
        value={query} // Changed from defaultValue to value for controlled component
        onChange={(e) => setQuery(e.target.value)} // Add onChange handler
        className="search-input"
        placeholder="Search Blogs" // Changed from "Search Startups"
      />

      <div className="flex gap-2">
        {query && (
          <button type="button" onClick={reset}>
            {" "}
            {/* Changed from reset to button type */}
            <span className="search-btn text-white">
              {" "}
              {/* Changed NavLink to span */}
              <X className="size-5" />
            </span>
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
