// References:
// Author: Danh Hong (danhhong@gmail.com)
// repo: https://github.com/danhhong/khmer_lunar_date

import { khZodiac, khStems, khMonth, khDigit, khDay } from "./Constant";

// Validate Gregorian date
function isValidDate(day, month, year) {
  if (month < 1 || month > 12) {
    return false;
  }
  if (year < 1) {
    return false;
  }

  let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Leap year check
  if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
    daysInMonth[1] = 29;
  }

  if (day < 1 || day > daysInMonth[month - 1]) {
    return false;
  }

  return true;
}

// Convert Gregorian date to Julian Day Number (JDN)
function gregorianToJD(day, month, year) {
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;

  let jd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  return jd;
}

// Calculate the mean lunar month (synodic month, ~29.530588853 days)
function getNewMoonDay(k, timezone = 7.0) {
  let T = k / 1236.85;
  let JDE =
    2451550.09766 +
    29.530588861 * k +
    0.00015437 * Math.pow(T, 2) -
    0.00000015 * Math.pow(T, 3) +
    0.00000000073 * Math.pow(T, 4);

  JDE += timezone / 24.0;
  return Math.floor(JDE + 0.5);
}

// Calculate solar longitude for a given JDN
function getSunLongitude(jd) {
  let T = (jd - 2451545.0) / 36525.0;

  let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * Math.pow(T, 2);
  let M = 357.52911 + 35999.05029 * T - 0.0001537 * Math.pow(T, 2);
  M = (M * Math.PI) / 180; // Convert degrees to radians

  let C =
    (1.914602 - 0.004817 * T - 0.000014 * Math.pow(T, 2)) * Math.sin(M) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M) +
    0.000289 * Math.sin(3 * M);

  let solarLong = (L0 + C) % 360;
  if (solarLong < 0) solarLong += 360; // Ensure 0–360 range

  return solarLong;
}

// Determine if a lunar month is a leap month
function isLeapMonth(jdStart, jdEnd) {
  let longStart = getSunLongitude(jdStart);
  let longEnd = getSunLongitude(jdEnd);

  for (let i = 0; i < 12; i++) {
    let term = i * 30.0;

    if (
      (longStart <= term && term < longEnd) ||
      (longEnd < longStart && (longStart <= term || term < longEnd))
    ) {
      return false;
    }
  }
  return true;
}

// Calculate Khmer zodiac year
function getKhmerZodiacYear(lunar_year) {
  return khZodiac[(lunar_year - 2020) % 12];
}

// Calculate Khmer heavenly stem
function getKhmerStem(year) {
  return khStems[(year - 2019) % 10];
}

function replaceAll(text, dic) {
  for (let key in dic) {
    if (dic.hasOwnProperty(key)) {
      text = text.split(key).join(dic[key]);
    }
  }
  return text;
}

// Convert Gregorian date to Khmer lunar date
function gregorianToKhmerLunar(day, month, year) {
  if (!isValidDate(day, month, year)) {
    throw new Error("Invalid Gregorian date");
  }

  // Convert to JDN
  let jd = gregorianToJD(day, month, year);

  // Find the nearest new moon
  let k = Math.floor((jd - 2451545.0) / 29.530588853);
  let newMoonJD = getNewMoonDay(k);

  if (newMoonJD > jd) {
    k -= 1;
    newMoonJD = getNewMoonDay(k);
  } else if (getNewMoonDay(k + 1) <= jd) {
    k += 1;
    newMoonJD = getNewMoonDay(k);
  }

  let lunarDay = jd - newMoonJD + 1;
  if (lunarDay < 1) {
    k -= 1;
    newMoonJD = getNewMoonDay(k);
    lunarDay = jd - newMoonJD + 1;
  }

  // Determine lunar month and year
  // Use April 14 (approximate Khmer New Year) as reference
  let refYear = month > 4 || (month === 4 && day >= 14) ? year : year - 1;
  let jdRef = gregorianToJD(14, 4, refYear);
  let kRef = Math.floor((jdRef - 2451545.0) / 29.530588853);

  let monthCount = 0;
  let currentK = kRef;
  let currentNewMoon = getNewMoonDay(currentK);
  while (currentNewMoon <= newMoonJD) {
    monthCount++;
    currentK++;
    currentNewMoon = getNewMoonDay(currentK);
  }

  // Adjust for leap months
  let isLeap = false;
  let kStart = kRef;
  let tempMonthCount = 0;
  for (let i = 0; i <= monthCount; i++) {
    let monthStart = getNewMoonDay(kStart + i);
    let monthEnd = getNewMoonDay(kStart + i + 1);

    if (isLeapMonth(monthStart, monthEnd)) {
      if (i < monthCount) {
        tempMonthCount++;
      } else {
        isLeap = true;
      }
    }
    tempMonthCount++;
  }

  let lunarMonth = ((monthCount - 1) % 12) + 1;
  let lunarYear =
    month > 4 || (month === 4 && day >= 14) ? year + 544 : year + 543;

  let monthName = khMonth[lunarMonth - 1];
  if (isLeap) {
    monthName += " (Leap)";
  }

  let zodiacYear = getKhmerZodiacYear(year);
  let stem = getKhmerStem(year);

  lunarYear = replaceAll(String(lunarYear), khDigit);
  return {
    lunar_day: khDay[String(lunarDay)],
    lunar_month: monthName,
    lunar_year: lunarYear,
    zodiac_year: zodiacYear,
    stem: stem
  };
}

export { gregorianToKhmerLunar };
