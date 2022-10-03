const toTwoDigits = (number: number) => String(number).padStart(2, '0')

const msToTime = (currentMs: number, durationMs: number) => {
  const currentHours = Math.floor((currentMs / (1000 * 60 * 60)) % 24)
  const currentMinutes = Math.floor((currentMs / (1000 * 60)) % 60)
  const currentSeconds = Math.floor((currentMs / 1000) % 60)

  const durationHours = Math.floor((durationMs / (1000 * 60 * 60)) % 24)
  const durationMinutes = Math.floor((durationMs / (1000 * 60)) % 60)
  const durationSeconds = Math.floor((durationMs / 1000) % 60)

  return `${durationHours ? `${toTwoDigits(currentHours)}:` : ''}${toTwoDigits(
    currentMinutes
  )}:${toTwoDigits(currentSeconds)} / ${
    durationHours ? `${toTwoDigits(durationHours)}:` : ''
  }${toTwoDigits(durationMinutes)}:${toTwoDigits(durationSeconds)}`
}

export default msToTime
