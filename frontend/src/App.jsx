import { useState, useEffect, useRef } from "react";
import { Clock, Navbar, News, Timeline } from "./components";
import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { divIcon, point } from "leaflet";
import {
  categories,
  timeline,
  getFormattedDate,
  currentWeekTimeline,
} from "./utils";
import axios from "axios";
import play from "./assets/play-button.png";
import pause from "./assets/pause.png";
import resume from "./assets/resume.png";

// const bgColors = {
//   business: "bg-[#0004FF]",
//   entertainment: "bg-[#FB0000]",
//   health: "bg-[#00BF00]",
//   science: "bg-[#F3EA1B]",
//   sports: "bg-[#FF6B00]",
//   technology: "bg-[#8F00FF]",
// };

const bgColors = {
  business: "bg-gradient-to-br from-blue-500 to-blue-700 via-blue-500",
  entertainment: "bg-gradient-to-br from-red-500 to-red-700 via-red-500",
  health: "bg-gradient-to-br from-green-500 to-green-700 via-green-500",
  science: "bg-gradient-to-br from-yellow-500 to-yellow-700 via-yellow-500",
  sports: "bg-gradient-to-br from-orange-500 to-orange-700 via-orange-500",
  technology: "bg-gradient-to-br from-purple-500 to-purple-700 via-purple-500",
};

function App() {
  const [isNewsComponentOpened, setIsNewsComponentOpened] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [category, setCategory] = useState("all");
  const [hotspots, setHotspots] = useState([]);
  const [originalCenter, setOriginalCenter] = useState([0, 0]);
  const [originalZoom, setOriginalZoom] = useState(2);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isAdvanceSearchOpen, setIsAdvanceSearchOpen] = useState(false);
  const [calendar, setCalendar] = useState({
    startDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
    key: "selection",
  });
  const [range, setRange] = useState("today");
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const timeoutRef = useRef();

  const handleAdvanceSearchClick = () => {
    setIsAdvanceSearchOpen(!isAdvanceSearchOpen);
  };

  useEffect(() => {
    setHotspots([]);

    const fetchData = async () => {
      try {
        let url = `http://localhost:3000/data?category=${category}&startDate=${calendar.startDate}&endDate=${calendar.endDate}`;

        const response = await axios.get(url);
        if (!response.data || response.data.length === 0) {
          throw new Error("No data found");
        }
        setHotspots(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [category, calendar]);

  const handleMarkerClick = (index) => {
    setIsNewsComponentOpened(true);
    setSelectedMarker(index);
  };

  const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    map.flyTo(center, zoom, {
      duration: 1,
    });
    return null;
  };

  const getNewCenter = (position) => {
    let offsetX = 0;
    let offsetY = 0;
    if (windowWidth < 1024) {
      offsetY = 0.4;
    } else if (windowWidth <= 820) {
      offsetY = 0.3;
    } else if (windowWidth <= 768) {
      offsetY = 0.2;
    } else {
      offsetX = -0.6;
    }
    const newCenter = [position[0] - offsetY, position[1] - offsetX];
    return newCenter;
  };

  let countAllArticlesForALocation = {};
  let countAllArticlesBasedOnCategoryForALocation = {};
  const articleCountForACountry = () => {
    hotspots.map((article) => {
      let location = article?.metaData?.locationName;
      let category = article?.metaData?.category;
      if (!countAllArticlesForALocation[location]) {
        countAllArticlesForALocation[location] = 0;
      }
      if (!countAllArticlesBasedOnCategoryForALocation[location]) {
        countAllArticlesBasedOnCategoryForALocation[location] = {};
      }
      if (!countAllArticlesBasedOnCategoryForALocation[location][category]) {
        countAllArticlesBasedOnCategoryForALocation[location][category] = 0;
      }

      countAllArticlesForALocation[location] += 1;
      countAllArticlesBasedOnCategoryForALocation[location][category]++;
    });
  };

  articleCountForACountry();

  const getCategoryWithMaxArticlesByLocation = (location) => {
    const counts = countAllArticlesBasedOnCategoryForALocation[location];

    if (!counts) {
      return null;
    }

    let maxCategory = null;
    let maxCount = 0;

    for (const category in counts) {
      const count = counts[category];
      if (count > maxCount) {
        maxCategory = category;
        maxCount = count;
      }
    }

    return maxCategory;
  };

  const getMarkerIcon = (locationName) => {
    const minArticleCount = Math.min(
      ...Object.values(countAllArticlesForALocation)
    );
    const maxArticleCount = Math.max(
      ...Object.values(countAllArticlesForALocation)
    );
    let articleCount = countAllArticlesForALocation[locationName];
    const minLog = Math.log(minArticleCount);
    const maxLog = Math.log(maxArticleCount);
    const artLog = Math.log(articleCount);
    let minRadius = 10;
    let maxRadius = 35;
    let radius = 0;
    if (minLog === maxLog) {
      radius = (minRadius + maxRadius) / 2; // Handle the edge case where all counts are equal
    } else {
      radius =
        minRadius +
        ((artLog - minLog) / (maxLog - minLog)) * (maxRadius - minRadius);
    }
    let category = getCategoryWithMaxArticlesByLocation(locationName);

    let markerIconHtml = ``;
    if (radius > 22.5) {
      markerIconHtml = `
      <span>
        <span class="animate-ping absolute h-[100%] w-[100%] rounded-full bg-black opacity-30"></span>
        <span class="rounded-full h-3 w-3"></span>
      </span>
    `;
    } else {
      markerIconHtml = `<span></span>`;
    }

    const markerIcon = new divIcon({
      html: markerIconHtml,
      className: `rounded-full ${bgColors[category]}`,
      iconSize: point(5 + radius, 5 + radius, true),
    });
    console.log(radius);
    return markerIcon;
  };

  let index = useRef(0);
  const fetchDataRef = useRef(null);
  const intervals = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const fetchData = async () => {
    if (isPaused || index.current >= Object.keys(currentWeekTimeline).length) {
      return;
    }
    fetchDataRef.current = fetchData;
    const { startDate, endDate } =
      currentWeekTimeline[intervals[index.current]];
    console.log(currentWeekTimeline[intervals[index.current]]);
    setCalendar((prevCalendar) => ({
      ...prevCalendar,
      startDate,
      endDate,
    }));

    console.log(
      `Fetching data for ${
        intervals[index.current]
      }: ${startDate} to ${endDate}`
    );
    try {
      let url = `http://localhost:3000/data?category=${category}&startDate=${startDate}&endDate=${startDate}`;

      const response = await axios.get(url);
      if (!response.data || response.data.length === 0) {
        throw new Error("No data found");
      }
      setHotspots(response.data);
    } catch (error) {
      console.error("Error:", error);
    }

    index.current++;
    if (index.current < Object.keys(currentWeekTimeline).length) {
      timeoutRef.current = setTimeout(fetchData, 2000);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setHotspots([]);
    index.current = 0; // Reset the index when play is pressed
    setIsPaused(false);
    clearTimeout(timeoutRef.current);
    fetchData();
  };

  const handlePause = () => {
    setIsPlaying(false);
    setIsPaused(true);
    clearTimeout(timeoutRef.current); // Clear the timeout to stop fetching
  };

  const handleResume = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setIsPaused(false);
    console.log("Index before resuming:", index.current);
    console.log(
      "Length of currentWeekTimeline:",
      Object.keys(currentWeekTimeline).length
    );
    if (index.current < Object.keys(currentWeekTimeline).length) {
      fetchDataRef.current(); // Resume fetching from the current index
    }
  };

  const findMatchingRange = (startDate, endDate) => {
    for (const [key, value] of Object.entries(timeline)) {
      if (
        value.startDate === getFormattedDate(new Date(startDate)) &&
        value.endDate === getFormattedDate(new Date(endDate))
      ) {
        return key; // Return the range if found
      }
    }
    return null; // Return null if no matching range is found
  };

  // Update the range based on the calendar dates
  const updateRange = () => {
    const matchingRange = findMatchingRange(
      calendar.startDate,
      calendar.endDate
    );
    if (matchingRange) {
      setRange(matchingRange);
    } else {
      const formatDate = (dateString) => {
        // Create a Date object from the input date string
        const date = new Date(dateString);

        // Extract the day, month, and year from the Date object
        const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits
        const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns 0-based month
        const year = date.getFullYear();

        // Return the formatted date string
        return `${day}/${month}/${year}`;
      };
      const startDateString = getFormattedDate(new Date(calendar.startDate));
      const endDateString = getFormattedDate(new Date(calendar.endDate));
      const startDate = formatDate(startDateString);
      const endDate = formatDate(endDateString);
      setRange(`${startDate} to ${endDate}`);
    }
  };

  useEffect(() => {
    updateRange();
  }, [calendar.startDate, calendar.endDate]);

  return (
    <div className="dashboard flex-1 relative overflow-x-hidden h-screen">
      <Navbar
        categories={categories}
        category={category}
        setCategory={setCategory}
        bgColors={bgColors}
      />

      <div
        className={`news-container w-[100%] lg:w-[90%] absolute -right-[100%] top-[10%] lg:top-[10%] transition-all duration-1000 z-10 ${
          isNewsComponentOpened && "right-0"
        }`}
      >
        <News
          isNewsComponentOpened={isNewsComponentOpened}
          setIsNewsComponentOpened={setIsNewsComponentOpened}
          setSelectedMarker={setSelectedMarker}
          category={category}
          hotspots={hotspots}
          selectedMarker={selectedMarker}
        />
      </div>

      <div className="map-container">
        <MapContainer
          center={originalCenter}
          zoom={originalZoom}
          className="h-screen w-screen absolute top-0 z-0"
          zoomControl={false}
          scrollWheelZoom={false}
          maxBounds={[
            [-90, -180],
            [90, 180],
          ]}
          
          minZoom={2}
        >
          <TileLayer
            url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* <TileLayer
            url={`https://tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token=${jawgMapsToken}`}
            attribution='https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          /> */}
          <ZoomControl position="bottomright" />
          {hotspots.map((article, index) => {
            const latitude = article?.metaData?.latitude;
            const longitude = article?.metaData?.longitude;
            // Check if latitude and longitude are defined
            if (latitude !== undefined && longitude !== undefined) {
              return (
                <Marker
                  key={index}
                  position={[latitude, longitude]}
                  eventHandlers={{ click: () => handleMarkerClick(index) }}
                  icon={getMarkerIcon(article?.metaData?.locationName)}
                ></Marker>
              );
            }

            return null;
          })}
          {selectedMarker !== null ? (
            <ChangeView
              center={getNewCenter([
                hotspots[selectedMarker].metaData.latitude,
                hotspots[selectedMarker].metaData.longitude,
              ])}
              zoom={10}
            />
          ) : (
            <ChangeView center={originalCenter} zoom={originalZoom} />
          )}
        </MapContainer>
      </div>

      <div className="clock absolute bottom-6 left-6">
        <Clock />
      </div>

      <div className={`timeline ${isPlaying ? "opacity-60" : "opacity-100"}`}>
        <Timeline
          isAdvanceSearchOpen={isAdvanceSearchOpen}
          handleAdvanceSearchClick={isPlaying ? null : handleAdvanceSearchClick}
          setCalendar={setCalendar}
        />
      </div>

      <div className="controls absolute top-20 left-4 cursor-pointer flex justify-center items-center gap-2">
        <div className="play flex flex-col justify-center items-center">
          <img src={play} alt="play" className="w-8 h-8" onClick={handlePlay} />
          <p className="font-semibold text-sm">play</p>
        </div>
        <div className="play flex flex-col justify-center items-center">
          <img
            src={pause}
            alt="pause"
            className="w-8 h-8"
            onClick={handlePause}
          />
          <p className="font-semibold text-sm">pause</p>
        </div>
        <div className="play flex flex-col justify-center items-center">
          <img
            src={resume}
            alt="resume"
            className="w-8 h-8"
            onClick={handleResume}
          />
          <p className="font-semibold text-sm">resume</p>
        </div>
      </div>

      {range && (
        <div className="range px-4 py-2 bg-black absolute top-20 right-6 sm:right-10 rounded-md">
          <h2 className="text-white text-sm font-semibold">{range}</h2>
        </div>
      )}
    </div>
  );
}

export default App;
