import React from "react";

const ActionButton = ({ properties, btnText }) => {
  return (
    <button
      type="submit"
      className={`cursor-pointer w-fit rounded-xl font-semibold text-lg text-white  ${properties} bg-gray-950 px-5 py-3 
      ml-auto block
      
      `}
    >
      {btnText}
    </button>
  );
};

export default ActionButton;
