import React from "react";
import { NavLink } from "react-router-dom";
import NavTab from "./NavTab";

const NavigationBlock = () => {
  return (
    <nav className="space-x-4 font-bold capitalize leading-5 text-sm">
      <NavTab text={"Home"} path={"/home"} />
      <NavTab text={"Services"} path={"/services"} />
      <NavTab text={"Contact"} path={"/contact-form"} />
      <NavTab text={"Admin"} path={"/admin-panel"} />
    </nav>
  );
};

export default NavigationBlock;
