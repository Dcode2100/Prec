const dateRangeToPill = (
  dateRange: [moment.Moment | null, moment.Moment | null]
): string => {
  const [start, end] = dateRange
  if (!start || !end) return ''

  const formatDate = (date: moment.Moment) => date.format('MMM D, YYYY')
  return `Date: ${formatDate(start)} - ${formatDate(end)}`
}

export default dateRangeToPill
