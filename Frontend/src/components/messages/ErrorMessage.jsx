import React from "react";

const ErrorMessage = ({ text }) => {
  return (
    <div className="w-full mt-10">
      <p className={`text-center font-bold  text-red-500`}>{text}</p>
    </div>
  );
};

export default ErrorMessage;
