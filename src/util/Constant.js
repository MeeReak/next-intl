const CASE_TYPES = [
  { key: "sentence", label: "sentence" },
  { key: "lower", label: "lower" },
  { key: "upper", label: "upper" },
  { key: "capitalized", label: "capitalized" },
  { key: "title", label: "titleCase" },
  { key: "alternating", label: "alternating" },
  { key: "inverse", label: "inverse" },
  { key: "inverse-underscore", label: "inverseUnderscore" },
  {
    key: "no-symbol",
    label: "noSymbol"
  }
];

const Photo_Base64 = "data:image/png;base64,";

const khDay = {
  1: "១កើត",
  2: "២កើត",
  3: "៣កើត",
  4: "៤កើត",
  5: "៥កើត",
  6: "៦កើត",
  7: "៧កើត",
  8: "៨កើត",
  9: "៩កើត",
  10: "១០កើត",
  11: "១១កើត",
  12: "១២កើត",
  13: "១៣កើត",
  14: "១៤កើត",
  15: "១៥កើត",
  16: "១រោច",
  17: "២រោច",
  18: "៣រោច",
  19: "៤រោច",
  20: "៥រោច",
  21: "៦រោច",
  22: "៧រោច",
  23: "៨រោច",
  24: "៩រោច",
  25: "១០រោច",
  26: "១១រោច",
  27: "១២រោច",
  28: "១៣រោច",
  29: "១៤រោច",
  30: "១៥រោច"
};

const khDayInWeek = {
  Monday: "ចន្ទ",
  Tuesday: "អង្គារ",
  Wednesday: "ពុធ",
  Thursday: "ព្រហស្បតិ៍",
  Friday: "សុក្រ",
  Saturday: "សៅរ៍",
  Sunday: "អាទិត្យ"
};

const khMonthInWeek = {
  January: "មករា",
  February: "កុម្ភៈ",
  March: "មីនា",
  April: "មេសា",
  May: "ឧសភា",
  June: "មិថុនា",
  July: "កក្កដា",
  August: "សីហា",
  September: "កញ្ញា",
  October: "តុលា",
  November: "វិច្ឆិកា",
  December: "ធ្នូ"
};

const khDigit = {
  0: "០",
  1: "១",
  2: "២",
  3: "៣",
  4: "៤",
  5: "៥",
  6: "៦",
  7: "៧",
  8: "៨",
  9: "៩"
};

const khMonth = [
  "ចេត្រ",
  "ពិសាខ",
  "ជេស្ឋ",
  "អាសាឍ",
  "ស្រាពណ៍",
  "ភទ្របទ",
  "អស្សុជ",
  "កត្តិក",
  "មិគសិរ",
  "បុស្ស",
  "មាឃ",
  "ផល្គុន"
];

const khZodiac = [
  "ជូត",
  "ឆ្លូវ",
  "ខាល",
  "ថោះ",
  "រោង",
  "ម្សាញ់",
  "មមី",
  "មមែ",
  "វក",
  "រកា",
  "ច",
  "កុរ"
];

const khStems = [
  "ឯកស័ក",
  "ទោស័ក",
  "ត្រីស័ក",
  "ចត្វាស័ក",
  "បញ្ចស័ក",
  "ឆស័ក",
  "សប្តស័ក",
  "អដ្ឋស័ក",
  "នព្វស័ក",
  "សំរឹទ្ធិស័ក"
];

export {
  CASE_TYPES,
  Photo_Base64,
  khDay,
  khDayInWeek,
  khDigit,
  khMonth,
  khStems,
  khZodiac,
  khMonthInWeek
};
