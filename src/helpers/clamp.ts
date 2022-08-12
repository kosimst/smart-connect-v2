const clamp = (val: number, range: [number, number]) => {
  const [min, max] = range
  return Math.min(Math.max(val, min), max)
}

export default clamp
