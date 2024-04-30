import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { categories } from "../utils";
import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";

const geoapifyToken = import.meta.env.VITE_GEOAPIFY_TOKEN;

const Portal = () => {
  const [formData, setFormData] = useState({
    newsUrl: "",
    location: "",
    category: "business",
  });

  const [data, setData] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleClick = async () => {
    if (formData.newsUrl == "" || formData.location == "") {
      setError("This field is required");
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
      setFormData({ location: "", newsUrl: "", category: "business" });
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

  console.log(formData);

  return (
    <div className="bg-[#0A192F] text-[#FFD700] w-screen h-screen flex flex-col justify-center items-center gap-10">
      {data && (
        <div className="">
          <h2>Generated News Tag:</h2>
          <a
            href={`http://localhost:3000/data/${data?.uniqueCode}`}
            className="text-white hover:underline"
            target="_blank"
          >{`http://localhost:3000/data/${data?.uniqueCode}`}</a>
        </div>
      )}
      <form className="md:w-[50%] flex flex-col gap-6 w-[90%] border-2 border-[rgb(255,215,0)] p-8 rounded-md shadow-[0_35px_60px_-15px_rgba(255,215,0,0.3)]">
        <div className="flex flex-col gap-2">
          <label htmlFor="newsUrl" className="font-bold">
            News Url :
          </label>
          <input
            type="text"
            id="newsUrl"
            className="p-2 outline-none rounded-md text-white bg-[#0A192F] border-b-2 border-b-[#FFD700]"
            value={formData.newsUrl}
            onChange={handleChange}
            name="newsUrl"
            placeholder="Enter Newspaper Url..."
          />
          {error && formData.newsUrl == "" && (
            <div className="text-red-600">{error}</div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="location" className="font-bold">
            Location :
          </label>
          <input
            type="text"
            id="location"
            className="p-2 outline-none rounded-md text-white bg-[#0A192F] border-b-2 border-b-[#FFD700]"
            value={formData.location.toLocaleLowerCase()}
            onChange={handleLocationChange}
            name="location"
            placeholder="Enter Location..."
          />
          {suggestions.length > 0 && (
            <ul className="overflow-y-scroll h-[100px]">
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

          {error && formData.location == "" && (
            <div className="text-red-600">{error}</div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="category" className="font-bold">
            Category :
          </label>
          <select
            id="category"
            className="appearance-none outline-none px-8 py-2 rounded-md text-white bg-[#0A192F] border-b-2 border-b-[#FFD700] text-sm cursor-pointer font-semibold w-[35%]"
            value={formData.category}
            onChange={handleChange}
            name="category"
          >
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
        <div
          className="btn px-6 py-2 bg-[#FFD700] rounded-md text-[#0A192F] font-bold cursor-pointer md:w-[25%] w-[40%] text-center self-center mt-4"
          onClick={handleClick}
        >
          Submit
        </div>
      </form>
      {isSubmitting && (
        <div class="absolute flex space-x-2 justify-center items-center z-10 h-screen w-screen dark:invert bg-black bg-opacity-60">
          <span class="sr-only">Loading...</span>
          <div class="h-8 w-8 bg-[#FFD700] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div class="h-8 w-8 bg-[#FFD700] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div class="h-8 w-8 bg-[#FFD700] rounded-full animate-bounce"></div>
        </div>
      )}
    </div>
  );
};

export default Portal;
