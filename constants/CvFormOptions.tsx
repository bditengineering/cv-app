export const englishLevels = [
  { value: "no proficiency", label: "No Proficiency" },
  { value: "elementary proficiency", label: "Elementary Proficiency" },
  {
    value: "limited working proficiency",
    label: "Limited Working Proficiency",
  },
  {
    value: "professional working proficiency",
    label: "Professional Working Proficiency",
  },
  {
    value: "full professional proficiency",
    label: "Full Professional Proficiency",
  },
  {
    value: "native or bilingual proficiency",
    label: "Native Or Bilingual Proficiency",
  },
];

export const monthsOptions = [
  { value: "january", label: "January" },
  { value: "february", label: "February" },
  { value: "march", label: "March" },
  { value: "april", label: "April" },
  { value: "may", label: "May" },
  { value: "june", label: "June" },
  { value: "july", label: "July" },
  { value: "august", label: "August" },
  { value: "september", label: "September" },
  { value: "october", label: "October" },
  { value: "november", label: "November" },
  { value: "december", label: "December" },
];

const year = new Date().getFullYear();
export const yearsOptions = Array.from(
  new Array(50),
  (val, index) => year - index,
);
