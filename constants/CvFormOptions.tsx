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
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const year = new Date().getFullYear();
export const yearsOptions = Array.from(
  new Array(50),
  (val, index) => year - index,
);
