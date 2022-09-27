const readableDate = (date: Date) => {
  const now = new Date()

  if (date.getDate() === now.getDate()) {
    if (now.getTime() - date.getTime() < 3600000) {
      const minutes = Math.floor((now.getTime() - date.getTime()) / 60000)

      if (minutes === 0) {
        return 'Just now'
      }

      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
    }

    if (now.getTime() - date.getTime() < 86400000) {
      const hours = Math.floor((now.getTime() - date.getTime()) / 3600000)
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
    }

    return date.toLocaleTimeString('de-AT')
  }

  return date.toLocaleString('de-AT')
}

export default readableDate
