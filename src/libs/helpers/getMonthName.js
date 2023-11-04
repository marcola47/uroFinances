export default function getMonthName(month) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  if (month > 11 || month < 0) 
    throw new Error('Invalid month');

  return monthNames[month];
}