import { useState, useEffect, useRef } from "react";

const CommentDropdown = ({ isOwner, onEditClick, onRemoveClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle edit click
  const handleEditClick = (e) => {
    e.preventDefault();
    setIsOpen(false);
    onEditClick();
  };

  const handleRemoveClick = async (e) => {
    e.preventDefault();
    setIsOpen(false);
    onRemoveClick();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg focus:ring-4 focus:outline-none focus:ring-gray-50"
        type="button"
      >
        <svg
          className="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 3"
        >
          <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
        </svg>
        <span className="sr-only">Comment settings</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow">
          <ul className="py-1 text-sm text-gray-700">
            {isOwner && (
              <>
                <li>
                  <a
                    href="#"
                    className="block py-2 px-4 hover:bg-gray-100"
                    onClick={handleEditClick}
                  >
                    Edit
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block py-2 px-4 hover:bg-gray-100"
                    onClick={handleRemoveClick}
                  >
                    Remove
                  </a>
                </li>
              </>
            )}
            <li>
              <a href="#" className="block py-2 px-4 hover:bg-gray-100">
                Report
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default CommentDropdown;
