const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function parseDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatUtcDate(value: string | Date) {
  const date = parseDate(value);

  if (!date) {
    return "-";
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
}

export function formatUtcMonthDay(value: string | Date) {
  const date = parseDate(value);

  if (!date) {
    return "-";
  }

  return `${MONTH_SHORT[date.getUTCMonth()]} ${date.getUTCDate()}`;
}
