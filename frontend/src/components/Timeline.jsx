import React, { useState } from "react";
import { timeline } from "../utils";
import close from "../assets/Close-Icon.svg";
import { DateRangePicker, DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const Timeline = ({
  isAdvanceSearchOpen,
  handleAdvanceSearchClick,
  setCalendar,
}) => {
  const [date, setDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  date.endDate.setHours(23, 59, 59, 999);

  const handleApply = (e) => {
    setCalendar(date);
    handleAdvanceSearchClick(!isAdvanceSearchOpen);
  };

  const handleChange = (ranges) => {
    setDate(ranges.selection);
  };

  return (
    <div
      className={`timeline-container font-sans ${
        isAdvanceSearchOpen
          ? " w-[90%] sm:w-[550px] sm:h-[450px] flex-col right-4 bottom-32 sm:right-20 sm:bottom-6"
          : "w-auto items-center right-14"
      } flex flex-col gap-2 p-2 absolute bottom-6 sm:right-20 bg-black rounded-md transition-all duration-300 ease-in-out`}
    >
      <div className="advance">
        {!isAdvanceSearchOpen ? (
          <div className="">
            <p
              className="text-white cursor-pointer font-semibold text-sm"
              onClick={handleAdvanceSearchClick}
            >
              Change Timeline
            </p>
          </div>
        ) : (
          <img
            src={close}
            alt="close"
            className="bg-[#0A192F] rounded-full cursor-pointer absolute right-2 top-2"
            onClick={handleAdvanceSearchClick}
          />
        )}
      </div>
      {isAdvanceSearchOpen && (
        <div className="flex flex-col gap-2 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent">
          <h2 className="text-white font-semibold">Advance Search</h2>

          <DateRangePicker
            className="w-full hidden sm:flex gap-2 flex-col h-[90vh] sm:h-[80%] sm:flex-row sm:gap-0"
            ranges={[date]}
            onChange={handleChange}
            maxDate={new Date()}
          />
          <DateRange
            className="w-full flex sm:hidden gap-2 flex-col sm:h-[80%] sm:flex-row sm:gap-0"
            ranges={[date]}
            onChange={handleChange}
            maxDate={new Date()}
          />

          <button
            type="submit"
            className="text-black p-2 bg-white w-[30%] self-center rounded-md font-semibold"
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default Timeline;
