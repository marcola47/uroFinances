export function getMonthName(month) {
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

export function getMonthRange(date) {
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);
  return { startDate, endDate };
}

export function shouldRecurrenceShow(reg_date, cur_date, period) {
  const regDate = new Date(reg_date);
  const curDate = new Date(cur_date);
  
  const curMonth = curDate.getMonth();
  const regMonth = regDate.getMonth();
  const monthsDiff = (curDate.getFullYear() - regDate.getFullYear()) * 12 + curMonth - regMonth;

  switch (period) {
    case 'monthly': return true;
    case 'quarterly': return monthsDiff % 3 === 0;
    case 'semi-annual': return monthsDiff % 6 === 0;
    case 'annual': return monthsDiff % 12 === 0;
    default: return false;
  }
}