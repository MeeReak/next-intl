import { khDay, khDayInWeek, khDigit, khMonthInWeek } from "./Constant";

const generateUUID = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

const randomDate = () => {
  const start = new Date(2025, 0, 1);
  const end = new Date();
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().slice(0, 10);
};

const randomLastTime = () => {
  const start = new Date(2015, 0, 1);
  const end = new Date();
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString();
};

const randomString = () => {
  const names = ["John Doe", "Jane Smith", "Alex Johnson", "Emily Brown"];
  const khmerNames = ["ជន ដូ", "ជេន ស្មិច", "អេលិច ស៍", "អេមី ប្រោន"];
  return {
    en: names[Math.floor(Math.random() * names.length)],
    km: khmerNames[Math.floor(Math.random() * khmerNames.length)]
  };
};

const randomAge = () => {
  const minAge = 18;
  const maxAge = 30;
  return `${Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge}`;
};

const randomDegree = () => {
  const degrees = [
    "Associate's Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "PhD's Degree"
  ];
  return degrees[Math.floor(Math.random() * degrees.length)];
};

const getKhmerDegree = (degree) => {
  const degreeMap = {
    "Associate's Degree": "បរិញ្ញាបត្ររង",
    "Bachelor's Degree": "បរិញ្ញាបត្រ",
    "Master's Degree": "បរិញ្ញាបត្រជាន់ខ្ពស់",
    "PhD's Degree": "បណ្ឌិត"
  };
  return degreeMap[degree] || degree;
};

const randomMajor = () => {
  const majors = [
    "Computer Science",
    "Business Administration",
    "Engineering",
    "Psychology",
    "Biology"
  ];
  return majors[Math.floor(Math.random() * majors.length)];
};

const getKhmerMajor = (major) => {
  const majorMap = {
    "Computer Science": "វិទ្យាសាស្ត្រកុំព្យូទ័រ",
    "Business Administration": "ការគ្រប់គ្រងអាជីវកម្ម",
    Engineering: "វិស្វកម្ម",
    Psychology: "ចិត្តវិទ្យា",
    Biology: "ជីវវិទ្យា"
  };
  return majorMap[major] || major;
};

const getKhmerNumber = (num) => {
  return num
    .toString()
    .split("")
    .map((digit) => khDigit[digit] || digit)
    .join("");
};

const getKhmerDate = (string) => {
  const date = new Date(string);
  let day = date.getDate();
  if (day.toString().length < 2) {
    day = `0${day}`;
  }
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  return `រាជធានីភ្នំពេញ ថ្ងៃទី${getKhmerNumber(day)} ខែ${khMonthInWeek[month]} ឆ្នាំ${getKhmerNumber(year)}`;
};

const getDate = (string) => {
  const date = new Date(string);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  return `Phnom Penh, ${month} ${day}, ${year}`;
};

export {
  randomString,
  generateUUID,
  randomDate,
  randomLastTime,
  getKhmerDate,
  randomAge,
  getKhmerNumber,
  randomDegree,
  getKhmerDegree,
  randomMajor,
  getKhmerMajor,
  getDate
};
