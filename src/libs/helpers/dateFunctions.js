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