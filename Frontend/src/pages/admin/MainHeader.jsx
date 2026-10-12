import React from "react";
import { IoMdAdd } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";

const MainHeader = ({ title }) => {
  return (
    <div className="text-center space-y-1.5">
      <p className="font-semibold text-xs text-gray-800 tracking-wider">
        YOUR PERSONAL AI LEARNING PARTNER
      </p>
      <p className="font-bold text-4xl text-gray-950">
        What do you want to learn?
      </p>
      <p className="text-base font-normal text-gray-800">
        Turn any topic into a visual lesson.
      </p>
    </div>
  );
};

export default MainHeader;
