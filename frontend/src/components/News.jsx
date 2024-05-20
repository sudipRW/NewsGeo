import React, { useState, useEffect } from "react";
import close from "../assets/Close-Icon.svg";
import axios, { all } from "axios";
import TwitterEmbed  from './TwitterEmbed'

const News = ({
  isNewsComponentOpened,
  setIsNewsComponentOpened,
  setSelectedMarker,
  selectedMarker,
  hotspots,
  category,
}) => {
  return (
    <div className="w-[80%] mx-auto mt-4 rounded-3xl relative bg-[#0A192F] bg-opacity-50 backdrop-blur-sm">
      <div
        className="close-btn absolute right-10 top-2 w-6 h-6 rounded-full bg-[#f2f2f2] cursor-pointer flex justify-center items-center"
        onClick={() => {
          setIsNewsComponentOpened(!isNewsComponentOpened);
          setSelectedMarker(null);
        }}
      >
        <img src={close} alt="close" className="bg-[#0A192F] rounded-full" />
      </div>
      <div className="news-container p-8 h-[70vh] lg:h-[80vh] flex flex-col">
        <h2 className="text-[#FFD700] text-lg">
          {hotspots[selectedMarker]?.metaData?.locationName.toUpperCase()}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 self-center h-[100%] w-[100%] overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent">
          {hotspots.map((hotspot, index) => {
            if (
              hotspot?.metaData?.locationName ===
              hotspots[selectedMarker]?.metaData?.locationName
            ) {
              return (
                <div className="" key={index}>
                  <TwitterEmbed tweetUrl={hotspot?.metaData?.newsUrl}/>
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default News;
