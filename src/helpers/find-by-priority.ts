const findByPriority = (arr: string[], possibilities: string[]) => {
  for (let i = 0; i < possibilities.length; i++) {
    const possibility = possibilities[i]
    if (arr.indexOf(possibility) > -1) {
      return possibility
    }
  }
  return null
}

export default findByPriority
