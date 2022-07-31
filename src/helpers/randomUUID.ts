const randomUUID = () => {
  if ('randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  const randomValues = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(randomValues)
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')
}

export default randomUUID
