import React from "react";
import PageLogo from "./PageLogo";
import NavigationBlock from "./NavigationBlock";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const hideHeader = location.pathname.startsWith("/admin-panel");

  if (hideHeader) return null;

  const copyToClipboard = async (event) => {
    try {
      const value = event.target.value;
      await navigator.clipboard.writeText(value);
      alert("Copied to clipboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="fixed w-full left-0 z-50">
      <div className=" flex items-center justify-between bg-amber-100 m-4 rounded-3xl p-3 shadow-2xl">
        {/* left content */}
        <div className="flex items-center space-x-10">
          <PageLogo />
          <NavigationBlock />
        </div>

        {/* right content | contact */}
        <div className="flex items-center gap-x-2.5">
          <div className="space-x-0.5">
            <span className="font-bold text-sm">Call Us:</span>
            <button
              value={"+92 3085748927"}
              onClick={(event) => copyToClipboard(event)}
              className="text-xs text-scarpa-flow font-semibold cursor-pointer hover:underline transition-all duration-300 ease-in-out"
            >
              +92 3085748927
            </button>
          </div>
          <div>
            <button className="bg-green-haze text-sm font-bold rounded-2xl py-2 px-3 btn-effect">
              Get in touch
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
