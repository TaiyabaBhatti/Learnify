import React from "react";

const TabItem = ({ icon, text, onClick, tabStatus }) => {
  return (
    <button
      className={`flex items-center gap-x-2 cursor-pointer w-full rounded-lg p-3 text-base font-semibold ${
        tabStatus ? "bg-light-theme" : "bg-transparent"
      }`}
      onClick={onClick}
    >
      {icon}
      <p className=" capitalize text-light-mint">{text}</p>
    </button>
  );
};

export default TabItem;
