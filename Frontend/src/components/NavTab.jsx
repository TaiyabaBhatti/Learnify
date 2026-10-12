import React from "react";
import { NavLink } from "react-router-dom";

const NavTab = ({ text, path }) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `relative  after:absolute after:bg-amber-900 after:w-full after:h-1 after:rounded-3xl after:-bottom-2 after:left-0  after:origin-left after:transition-transform after:duration-200 ${
          isActive ? "after:scale-x-100" : "after:scale-x-0"
        }`
      }
    >
      {text}
    </NavLink>
  );
};

export default NavTab;
