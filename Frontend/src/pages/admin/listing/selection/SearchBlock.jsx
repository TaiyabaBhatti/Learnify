import React, { useState } from "react";
import { FaSearchengin } from "react-icons/fa6";

const SearchBlock = () => {
  const [serach, setSearch] = useState("");
  return (
    <div className=" border-athens-gray bg-white sm:text-gray-600 sm:bg-gray-100 sm:border-gray-100 border flex flex-row gap-x-2 px-3 items-center p-2 rounded-sm">
      <FaSearchengin className="text-lg" />
      <input
        id="search"
        className="outline-0 w-full"
        placeholder="Search Property"
        type="text"
        value={serach}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
    </div>
  );
};

export default SearchBlock;
