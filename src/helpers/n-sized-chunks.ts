const nSizedChunks = <T extends any>(arr: T[], size: number): T[][] => {
  const chunkedArr = []
  for (let i = 0; i < arr.length; i += size) {
    chunkedArr.push(arr.slice(i, i + size))
  }
  return chunkedArr
}

export default nSizedChunks
