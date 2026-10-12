import React from "react";

const DropDown = ({ title, contentArr }) => {
  return (
    // <div className=" border-athens-gray bg-white sm:text-gray-600 sm:bg-gray-100 sm:border-gray-100 border flex flex-row gap-x-2 px-3 items-center p-2 rounded-sm">
    // </div>
    <select
      name={title}
      id={title}
      className="border-athens-gray bg-white text-gray-600  border-gray-300 border flex flex-row gap-x-2 px-3 items-center p-2 rounded-sm outline-none max-w-52"
    >
      <option value="title" className="capitalize">
        {title}
      </option>
      ;
      {contentArr.map((item, index) => {
        return (
          <option key={index} value={item}>
            {item}
          </option>
        );
      })}
    </select>
  );
};

export default DropDown;
