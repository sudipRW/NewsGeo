import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { categories } from "../utils";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import logo from "../assets/logo.jpg";
import map from "../assets/map.svg"

const geoapifyToken = import.meta.env.VITE_GEOAPIFY_TOKEN;

const Portal = () => {
  const [formData, setFormData] = useState({
    newsUrl: "",
    location: "",
    category: "",
    date: "",
  });

  const [data, setData] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isValidUrl, setIsValidUrl] = useState(false);

  const maxDate = new Date().toISOString().split("T")[0];

  const checkIfValidUrl = (url) => {
    // Regular expression for validating URL
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlRegex.test(url);
  };

  const handlePublish = async () => {
    const isValidUrl = checkIfValidUrl(formData.newsUrl);
    setIsValidUrl(isValidUrl);
    if (
      formData.newsUrl == "" ||
      !isValidUrl ||
      formData.location == "" ||
      formData.category == "" ||
      formData.date == ""
    ) {
      setError(
        !isValidUrl && formData.newsUrl != ""
          ? "Invalid URL."
          : "Fields are required."
      );
      setTimeout(() => {
        setError("");
      }, 1500);
      return;
    }
    setIsSubmitting(true);
    const uniqueID = uuidv4();
    const requestData = JSON.stringify(formData);

    try {
      const response = await axios.post(
        `http://localhost:3000/data/${uniqueID}`,
        requestData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.status === 200) {
        throw new Error("Failed to send form data");
      }

      const data = response.data;
      setIsSubmitting(false);
      setError("");
      setData(data);
      setFormData({
        location: "",
        newsUrl: "",
        category: "business",
        date: Date,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = async (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocationChange = async (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    try {
      if (formData.location !== "") {
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${formData.location}&apiKey=${geoapifyToken}`
        );
        const data = await response.json();
        console.log("Geoapify API response:", data);
        const suggestions = data.features.map((feature) =>
          feature.properties.formatted.toLowerCase()
        );
        setSuggestions(suggestions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSelect = (selectedLocation) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      location: selectedLocation,
    }));
    setSuggestions([]);
  };

  const handleReset = () => {
    setFormData({
      newsUrl: "",
      location: "",
      category: "",
      date: Date,
    });
  };

  console.log(formData);

  return (
    <div className="w-screen mx-auto h-screen flex justify-center items-center">
      {/* <div className="overlay absolute w-full h-full top-0 left-0 z-10 bg-black opacity-60"></div> */}
      <img
        src={map}
        alt="bg-img"
        className="w-full h-full absolute top-0 left-0 object-cover opacity-5"
      />
      <div className="flex flex-col items-center gap-4 w-[90%] sm:w-[60%] z-20 bg-white p-8 rounded-lg shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px]">
        <div className="logo w-[200px] h-[75px] flex justify-center items-center">
          <img src={logo} alt="logo" className="w-[100%] h-[100%]" />
        </div>
        <form className="flex flex-col gap-6 w-[90%] relative mt-6">
          {error && (
            <div className="text-red-600 absolute text-center -top-8 left-0">
              {error}
            </div>
          )}
          <div className="flex flex-col">
            <input
              type="text"
              id="newsUrl"
              className={`p-2 outline-none rounded-md border-2 ${
                error && (formData.newsUrl === "" || !isValidUrl) &&
                "border-red-500"
              }`}
              value={formData.newsUrl}
              onChange={handleChange}
              name="newsUrl"
              placeholder="*Enter Newspaper Url"
              required
            />
          </div>
          <div className="flex flex-col relative">
            <input
              type="text"
              id="location"
              className={`p-2 outline-none rounded-md border-2 ${
                error && formData.location === "" && "border-red-500"
              }`}
              value={formData.location.toLocaleLowerCase()}
              onChange={handleLocationChange}
              name="location"
              placeholder="*Enter Location"
              required
            />
            {suggestions.length > 0 && formData.location != "" && (
              <ul className="absolute top-16 overflow-y-scroll h-[200px] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelect(suggestion)}
                    className="bg-white text-black cursor-pointer p-2 hover:bg-[#f2f2f2]"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-col">
            <select
              id="category"
              className={`appearance-none px-2 py-2 outline-none rounded-md border-2 ${
                error && formData.category === "" && "border-red-500"
              }`}
              value={formData.category}
              onChange={handleChange}
              name="category"
              required
            >
              <option value="">*Select Category</option>
              {categories.map(
                (category, i) =>
                  category !== "all" && (
                    <option value={category} key={i}>
                      {category.toUpperCase()}
                    </option>
                  )
              )}
            </select>
          </div>
          <div className="flex flex-col">
            <input
              type="date"
              id="date"
              className={`p-2 outline-none rounded-md border-2 ${
                error && formData.date === "" && "border-red-500"
              }`}
              name="date"
              value={formData.date}
              onChange={handleChange}
              max={maxDate}
              required
            />
          </div>
          <div
            className="btn px-6 py-2 rounded-md bg-black text-white font-bold cursor-pointer md:w-[30%] w-[40%] text-center self-center mt-2"
            onClick={handlePublish}
          >
            Publish
          </div>
          <div
            className="btn px-4 py-1 rounded-md border-2 text-[#A7A7A7] font-bold cursor-pointer md:w-[20%] w-[30%] text-center self-center mt-1"
            onClick={handleReset}
          >
            Clear
          </div>
        </form>
      </div>
      {/* {data && (
        <div className="">
          <h2>Generated News Tag:</h2>
          <a
            href={`http://localhost:3000/data/${data?.uniqueCode}`}
            className="text-white hover:underline"
            target="_blank"
          >{`http://localhost:3000/data/${data?.uniqueCode}`}</a>
        </div>
      )} */}

      {isSubmitting && (
        <div class="absolute flex space-x-2 justify-center items-center z-20 h-screen w-screen dark:invert bg-black bg-opacity-60">
          <span class="sr-only">Loading...</span>
          <div class="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div class="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div class="h-8 w-8 bg-black rounded-full animate-bounce"></div>
        </div>
      )}
    </div>
  );
};

export default Portal;
