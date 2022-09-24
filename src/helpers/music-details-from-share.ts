const extractUrl = (str: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const match = str.match(urlRegex)
  return match ? match[0] : ''
}

const isYoutube = (url: string) => {
  return url.includes('youtube.com') || url.includes('youtu.be')
}

export type MusicDetails = {
  player: 'YouTube' | 'Spotify' | 'SoundCloud'
  url: string
  title: string
}

const musicDetailsFromShare = (
  text: string,
  url: string,
  queryTitle: string
): MusicDetails | null => {
  const urlInText = extractUrl(text)
  const urlInUrl = extractUrl(url)

  const urlToUse = urlInText || urlInUrl

  if (!urlToUse) {
    return null
  }

  if (isYoutube(urlToUse)) {
    const titleRegex = /"((?:\\.|[^"\\])*)"/

    const title = titleRegex.exec(queryTitle)?.[1] || ''

    return {
      player: 'YouTube',
      url: urlToUse,
      title,
    }
  }

  return null
}

export default musicDetailsFromShare
