import { basePath } from "../service/constants";
import moment from "moment";

export const getId = (obj) => {
  if (obj && obj.id) {
    return obj.id;
  }
  if (obj && obj._id) {
    return obj._id;
  }
  return null;
};


export const returnArray = (arr = []) => {
  if (arr && Array.isArray(arr) && arr.length > 0) return arr;
  else return [];
};
export function parseImagePath(filename) {
  if (!filename) return "";
  // remove last slash from basePath if it exists
  let url = import.meta.env.VITE_ASSETS_BASE_PATH|| basePath;
  const lastChar = url.charAt(url.length - 1);
  if (lastChar === "/") {
    url = url.slice(0, -1);
  }
  return `${url}/${filename}`;
}

export function toTitleCase(str = "") {
  return str
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
export const isValidDate = (date) => {
  if (!date) return false;
  const parsedDate = new Date(date);
  return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
}

export const dateFormat = (date, showTime = false, customTime = null) => {
  if (!isValidDate(date)) return '';
  
  // Basic formats
  const DATE_FORMAT = 'MMM DD, YYYY'; // Jun 28, 2025
  const DATETIME_FORMAT = 'MMM DD, YYYY h:mm A'; // Jun 28, 2025 2:30 PM
  
  // If we don't need to show time, just return the date
  if (!showTime) {
    return moment(date).format(DATE_FORMAT);
  }
  
  // If we need to show time with a custom time value
  if (showTime && customTime) {
    const dateObj = new Date(date);
    
    if (typeof customTime === 'string' && customTime.includes(':')) {
      const [hours, minutes] = customTime.split(':');
      dateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    }
    
    return moment(dateObj).format(DATETIME_FORMAT);
  }
  
  // If we need to show time from the date object itself
  return moment(date).format(DATETIME_FORMAT);
}

export const timeFormat = (time = null, use24Hour = false) => {
  if (!time) return '';
  
  const TIME_FORMAT = use24Hour ? 'HH:mm' : 'h:mm A';
  
  // If time is a string in HH:MM format
  if (typeof time === 'string' && time.includes(':')) {
    const [hours, minutes] = time.split(':');
    if (!isNaN(parseInt(hours)) && !isNaN(parseInt(minutes))) {
      const timeObj = new Date();
      timeObj.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      return moment(timeObj).format(TIME_FORMAT);
    }
  }
  
  // If time is a Date object or date string
  if (isValidDate(time)) {
    return moment(time).format(TIME_FORMAT);
  }
  
  // If invalid format, return empty string
  return '';
}

export const setValueIfExist = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    if (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      (!Array.isArray(value) || value.length > 0)
    ) {
      acc[key] = value;
    }

    return acc;
  }, {});
};



export const showUserFullName = (user, defaultText = null) => {
  if (user && typeof user === "object" ) {
    if(user.firstName && user.lastName){
      return `${user.firstName} ${user.lastName}`;
    }
    if(user.firstName){
      return `${user.firstName}`;
    }
    if(user.lastName){
      return `${user.lastName}`;
    }

    return user.email || defaultText || "Name not added";
  }else{
    return defaultText ||"Demo User";
  }
}

export const getFullName = (user) => {
  if (!user) return '';
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  return `${firstName} ${lastName}`.trim();
};

export function getUserLevel(obj = {}) {
  const totalCompletedJobs = obj.completedJobs ?? obj.totalCompletedJobs ?? 0;
  const totalEarnings = obj.amountReceived ?? obj.totalEarnings ?? 0;
  const averageRating = obj.averageRating ?? 0;
  const successPercentage = obj.successPercentage ?? 0;

  if (
    totalCompletedJobs >= 10 &&
    totalEarnings >= 1000 &&
    averageRating >= 4.8 &&
    successPercentage >= 95
  ) {
    return "Top Rated";
  }
  if (
    totalCompletedJobs >= 30 &&
    totalEarnings >= 500 &&
    averageRating >= 4.5 &&
    successPercentage >= 90
  ) {
    return "Level 2";
  }
  if (
    totalCompletedJobs >= 10 &&
    totalEarnings >= 100 &&
    averageRating >= 4 &&
    successPercentage >= 80
  ) {
    return "Level 1";
  }
  return "Beginner";
}
