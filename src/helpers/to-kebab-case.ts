const toKebabCase = (str: string) => {
  return str
    .split(/(?=[A-Z])/)
    .join('-')
    .toLowerCase()
}

export default toKebabCase
