const tryJSON = (json: string): any => {
  try {
    return JSON.parse(json)
  } catch {
    return json
  }
}

export default tryJSON
