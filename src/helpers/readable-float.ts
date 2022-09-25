const readableFloat = (value: number, precision = 2) => {
  const rounded = Math.round(value * 10 ** precision) / 10 ** precision
  return rounded.toLocaleString(undefined, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })
}

export default readableFloat
