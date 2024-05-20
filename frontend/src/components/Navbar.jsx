import React, { useState } from "react";
import Search from "./Search";
import logo from "../assets/News-Geo-Logo.svg";
import close from "../assets/close.png";
import menu from "../assets/menu-icon.svg";

const borderColors = {
  business: "border-[#0004FF]",
  entertainment: "border-[#FB0000]",
  health: "border-[#00BF00]",
  science: "border-[#F3EA1B]",
  sports: "border-[#FF6B00]",
  technology: "border-[#8F00FF]",
};

const Navbar = ({ categories, category, setCategory, bgColors }) => {
  const [hamburgerToggled, setHamburgerToggled] = useState(false);
  const handleSelectCategory = (cat) => {
    setCategory(cat);
    setHamburgerToggled(false);
  };
  const handleHamburgerToggle = () => {
    setHamburgerToggled(!hamburgerToggled);
  };
  return (
    <div className="p-2 py-4 px-4 fixed z-10 w-[100%] h-[64px] flex items-center justify-between sm:justify-center sm:gap-64 backdrop-filter backdrop-blur-md bg-black gap-4">
      <div className="sm:hidden flex items-center justify-between py-2">
        <input type="checkbox" id="menu-toggle" className="hidden" />
        <label
          htmlFor="menu-toggle"
          className="cursor-pointer"
          onClick={handleHamburgerToggle}
        >
          <img src={menu} alt="menu" className="w-8 h-8"/>
        </label>
      </div>

      <div
        className={`sidebar absolute z-20 top-0 h-screen w-[250px] transition-all flex flex-col gap-6 backdrop-filter backdrop-blur-md bg-white sm:hidden
            p-4 ${hamburgerToggled ? "left-0" : "left-[-100%]"}
          `}
      >
        <img
          src={close}
          alt="close"
          className="w-10 h-10 cursor-pointer"
          onClick={handleHamburgerToggle}
        />
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => handleSelectCategory(cat)}
            className={`px-4 py-1 rounded-md text-sm font-semibold cursor-pointer ${
              category === "all" && "bg-[#FFD700]"
            } ${
              category === cat
                ? `${bgColors[cat]} border-none text-white`
                : `bg-white text-[#0A192F] border-4 ${borderColors[cat]}`
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>
      
      <div className="logo w-[60px] h-[60px] sm:w-[85px] sm:h-[85px] flex justify-center items-center">
        <img src={logo} alt="logo" className="w-[100%]" />
      </div>
      <div className="categories hidden space-x-4 w-[80%] sm:flex overflow-x-auto sm:overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent">
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => handleSelectCategory(cat)}
            className={`px-4 py-1 rounded-md text-sm font-semibold cursor-pointer ${
              category === "all" && "bg-[#FFD700]"
            } ${
              category === cat
                ? `${bgColors[cat]} border-none text-white`
                : `bg-white text-black font-semibold border-4 ${borderColors[cat]}`
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>
      {/* <Search /> */}
    </div>
  );
};

export default Navbar;

