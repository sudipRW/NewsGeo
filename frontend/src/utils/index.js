
const categories = [,
    "all",
    "business",
    "entertainment",
    "health",
    "science",
    "sports",
    "technology",
  ];

  const getFormattedDate = (date) => {
    return date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  };
  
  const getStartOfToday = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };
  
  const getEndOfToday = () => {
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999); // Set time to end of day
    return endOfToday;
  };
  
  const getStartOfThisWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfThisWeek = new Date(today);
    startOfThisWeek.setDate(today.getDate() - dayOfWeek); // Go back to Sunday
    return new Date(startOfThisWeek.getFullYear(), startOfThisWeek.getMonth(), startOfThisWeek.getDate());
  };
  
  const getEndOfThisWeek = () => {
    const endOfThisWeek = getStartOfToday();
    endOfThisWeek.setDate(endOfThisWeek.getDate() + (6 - endOfThisWeek.getDay())); // Move to Saturday
    endOfThisWeek.setHours(23, 59, 59, 999); // Set time to end of day
    return endOfThisWeek;
  };
  
  const getStartOfLastWeek = () => {
    const startOfLastWeek = new Date(getStartOfThisWeek());
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7); // Go back 7 days
    return startOfLastWeek;
  };
  
  const getEndOfLastWeek = () => {
    const endOfLastWeek = new Date(getEndOfThisWeek());
    endOfLastWeek.setDate(endOfLastWeek.getDate() - 7); // Go back 7 days
    return endOfLastWeek;
  };
  
  const getStartOfThisMonth = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  };
  
  const getEndOfThisMonth = () => {
    const endOfMonth = new Date(getStartOfThisMonth());
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(endOfMonth.getDate() - 1);
    endOfMonth.setHours(23, 59, 59, 999); // Set time to end of day
    return endOfMonth;
  };
  
  const getStartOfLastMonth = () => {
    const startOfLastMonth = new Date(getStartOfThisMonth());
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
    return startOfLastMonth;
  };
  
  const getEndOfLastMonth = () => {
    const startOfLastMonth = getStartOfLastMonth();
    const endOfLastMonth = new Date(startOfLastMonth);
    endOfLastMonth.setMonth(endOfLastMonth.getMonth() + 1);
    endOfLastMonth.setDate(endOfLastMonth.getDate() - 1);
    endOfLastMonth.setHours(23, 59, 59, 999); // Set time to end of day
    return endOfLastMonth;
  };
  const startDate = getStartOfToday();
  const endDate = getEndOfToday();
  const yesterday = new Date(startDate);
  yesterday.setDate(startDate.getDate() - 1);
  
  const timeline = {
    "today": {
      startDate: getFormattedDate(startDate),
      endDate: getFormattedDate(endDate),
    },
    "yesterday": {
      startDate: getFormattedDate(yesterday),
      endDate: getFormattedDate(startDate),
    },
    "thisWeek": {
      startDate: getFormattedDate(getStartOfThisWeek()),
      endDate: getFormattedDate(getEndOfThisWeek()),
    },
    "lastWeek": {
      startDate: getFormattedDate(getStartOfLastWeek()),
      endDate: getFormattedDate(getEndOfLastWeek()),
    },
    "thisMonth": {
      startDate: getFormattedDate(getStartOfThisMonth()),
      endDate: getFormattedDate(getEndOfThisMonth()),
    },
    "lastMonth": {
      startDate: getFormattedDate(getStartOfLastMonth()),
      endDate: getFormattedDate(getEndOfLastMonth()),
    },
  };
  

  const getStartOfThisWeekFromMonday = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const distanceToMonday = (dayOfWeek + 6) % 7; // Correct calculation
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - distanceToMonday);
    startOfThisWeek.setHours(0, 0, 0, 0);
    return startOfThisWeek;
};
  
// Helper function to get the current day with 23:59:59.999 timestamp
const getCurrentDay = () => {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  return new Date(now); 
};
  
const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
const generateCurrentWeekTimeline = () => {
  const startDate = getStartOfThisWeekFromMonday();
  const endDate = getCurrentDay();
  const timeline = {};

  let currentDate = new Date(startDate);
  let dayIndex = 0;

  while (currentDate <= endDate) {
      const dayName = dayNames[dayIndex];

      // Set start time to 12:00 AM
      const dayStartDate = new Date(currentDate);
      dayStartDate.setHours(0, 0, 0, 0);

      // Set end time to 11:59:59 PM
      const dayEndDate = new Date(currentDate);
      dayEndDate.setHours(23, 59, 59, 999);

      // Set start and end dates for each day
      timeline[dayName] = {
          startDate: dayStartDate,
          endDate: dayEndDate,
      };

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
      dayIndex++;
  }

  return timeline;
};

  
  // Generate the timeline for the current week
  const currentWeekTimeline = generateCurrentWeekTimeline();

export {categories,timeline,getFormattedDate,currentWeekTimeline}