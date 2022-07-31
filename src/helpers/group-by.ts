export function assertString(value: any): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error(`Expected string, got ${typeof value}`)
  }
}

const groupBy = <T extends any, K extends keyof T>(
  arr: T[],
  key: K,
  defaultValue?: T[K]
): Record<string, T[]> => {
  const grouped: Record<string, T[]> = {}
  for (const item of arr) {
    let value = item[key]

    if (value === undefined) {
      if (defaultValue === undefined) {
        throw new Error(`Missing key: ${key}`)
      }
      value = defaultValue
    } else {
      assertString(value)

      grouped[value] ??= []
      grouped[value].push(item)
    }
  }

  return grouped
}

export default groupBy
