import React from "react";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa";

const FilterHeading = ({
  heading,
  handleDropDown,
  dropDown,
  childProperties = "",
  parentProperties,
}) => {
  return (
    <div
      className={`flex items-center gap-x-5 rounded-2xl border-[1.5px] border-haze-green/15 px-2 py-1 bg-haze-green/20 w-fit ${parentProperties}`}
    >
      {" "}
      <h5
        className={`text-gray-800  font-bold max-md:text-sm uppercase tracking-wide ${childProperties}`}
      >
        {heading}
      </h5>
      <button className="cursor-pointer" onClick={() => handleDropDown()}>
        {dropDown ? <FaAngleUp /> : <FaAngleDown />}
      </button>
    </div>
  );
};

export default FilterHeading;
