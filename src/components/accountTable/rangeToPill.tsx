const rangeToPill = (
  label: string,
  range: [number | null, number | null],
  isCurrency: boolean = false
): string => {
  const [min, max] = range
  if (min === null && max === null) return ''

  const formatValue = (value: number | null) => {
    if (value === null) return ''
    return isCurrency ? `₹${value.toLocaleString()}` : value.toString()
  }

  if (min !== null && max !== null) {
    return `${label}: ${formatValue(min)} - ${formatValue(max)}`
  } else if (min !== null) {
    return `${label}: ≥ ${formatValue(min)}`
  } else if (max !== null) {
    return `${label}: ≤ ${formatValue(max)}`
  }
  return ''
}
export default rangeToPill
