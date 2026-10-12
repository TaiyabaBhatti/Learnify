import React from "react";
import { NavLink } from "react-router-dom";

const FooterTab = ({ path, text }) => {
  return (
    <NavLink
      to={path}
      className={`text-gray-100 capitalize text-sm hover:underline
        `}
    >
      {text}
    </NavLink>
  );
};

export default FooterTab;
