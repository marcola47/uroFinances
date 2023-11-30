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

export function shouldRecurrenceShow(due_date, cur_date, period) {
  const dueDate = new Date(due_date);
  const curDate = new Date(cur_date);
  
  const curMonth = curDate.getMonth();
  const dueMonth = dueDate.getMonth();
  const monthsDiff = (curDate.getFullYear() - dueDate.getFullYear()) * 12 + curMonth - dueMonth;

  const { endDate } = getMonthRange(curDate);

  if (endDate < dueDate) 
    return false;

  switch (period) {
    case 'monthly': return true;
    case 'quarterly': return monthsDiff % 3 === 0;
    case 'semi-annual': return monthsDiff % 6 === 0;
    case 'annual': return monthsDiff % 12 === 0;
    default: return false;
  }
}

export function getTimeZoneOffset() {
  const currentDate = new Date();
  const offsetInMinutes = currentDate.getTimezoneOffset();
  const offsetInHours = -offsetInMinutes / 60;
  return offsetInHours;
}

export function applyTimeZoneOffset(originalDate) {
    const timezoneOffset = getTimeZoneOffset();

    const offsetInMinutes = timezoneOffset * 60;
    const originalTimestamp = originalDate.getTime();
    
    const adjustedTimestamp = originalTimestamp + offsetInMinutes * 60 * 1000;
    const adjustedDate = new Date(adjustedTimestamp);
  
    return adjustedDate;
}