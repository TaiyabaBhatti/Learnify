import React from "react";

const ActionButton = ({ properties, btnText }) => {
  return (
    <button
      type="submit"
      className={`cursor-pointer w-full ${properties} bg-gray-200`}
    >
      {btnText}
    </button>
  );
};

export default ActionButton;
