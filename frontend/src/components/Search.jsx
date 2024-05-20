import React,{useState} from "react";
import searchIcon from "../assets/Search-Icon.svg";
import close from "../assets/Close-Icon.svg";

const Search = () => {
  const [serachBarToggle, setSerachBarToggle] = useState(false)
  const toggleSearchBar = () => {
    setSerachBarToggle(!serachBarToggle)
  };
  return (
    <div className="">
      <div className="flex justify-center items-center">
        {!serachBarToggle ? (
          <img
          src={searchIcon}
          alt="search"
          className="w-8 h-8 top-2 cursor-pointer"
          onClick={toggleSearchBar}
        />
        ):(
          <img
          src={close}
          alt="close"
          className="w-8 h-8 top-2 cursor-pointer"
          onClick={toggleSearchBar}
        />
        )}
        
      </div>
      <div className={`searchbar absolute w-[80%] sm:w-[50%] transition-all top-[5rem] ${serachBarToggle ?'sm:right-[25%] right-[10%]' : 'right-[-100%]'}`}>
        <input
          type="text"
          placeholder="Search"
          className="p-2 text-sm w-[100%] outline-none rounded-3xl bg-black text-white"
        />
      </div>
    </div>
  );
};

export default Search;
