import { useState, useEffect } from "react";
import { Clock, Navbar, News } from "./components";
import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { divIcon, point } from "leaflet";
import { categories } from "./utils";
import axios, { all } from "axios";

const jawgMapsToken = import.meta.env.VITE_JAWG_MAPS_TOKEN;

const bgColors = {
  business: "bg-[#0004FF]",
  entertainment: "bg-[#FB0000]",
  health: "bg-[#00BF00]",
  science: "bg-[#F3EA1B]",
  sports: "bg-[#FF6B00]",
  technology: "bg-[#8F00FF]",
};

function App() {
  const [isNewsComponentOpened, setIsNewsComponentOpened] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [category, setCategory] = useState("all");
  const [hotspots, setHotspots] = useState([]);
  const [originalCenter, setOriginalCenter] = useState([0, 0]);
  const [originalZoom, setOriginalZoom] = useState(2.5);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/data?category=${category}`
        );
        if (!response.data || response.data.length === 0) {
          throw new Error("No data found");
        }
        setHotspots(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [category]);

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

      countAllArticlesForALocation[location] =
        countAllArticlesForALocation[location] + 1;
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
    let customSize = countAllArticlesForALocation[locationName];
    let category = getCategoryWithMaxArticlesByLocation(locationName);
    const markerIcon = new divIcon({
      html: `<div></div>`,
      className: `rounded-full ${
        category === "all" ? "bg-black" : `${bgColors[category]}`
      }`,
      iconSize: point(12 + customSize, 12 + customSize, true),
    });

    return markerIcon;
  };

  console.log(countAllArticlesBasedOnCategoryForALocation);

  return (
    <div className="flex-1 relative overflow-x-hidden h-screen">
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
        >
          {/* <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          /> */}
          <TileLayer
            url={`https://tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token=${jawgMapsToken}`}
            attribution='https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
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

    </div>
  );
}

export default App;
