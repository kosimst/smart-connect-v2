const closestMinute = (date: Date) => {
  if (date.getSeconds() === 0) {
    return date
  }

  const closestMinute = new Date(date)
  const seconds = closestMinute.getSeconds()
  if (seconds >= 30) {
    closestMinute.setMinutes(closestMinute.getMinutes() + 1)
  }
  closestMinute.setSeconds(0)
  return closestMinute
}

export default closestMinute
