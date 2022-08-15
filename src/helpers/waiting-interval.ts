const setWaitingInterval = (
  callback: () => Promise<void>,
  interval: number
) => {
  let active = true
  let timeout: ReturnType<typeof setTimeout>

  const fn = async () => {
    if (!active) {
      return
    }

    const now = performance.now()
    await callback()
    const elapsed = performance.now() - now
    const remaining = Math.max(interval - elapsed, 0)

    if (!active) {
      return
    }

    timeout = setTimeout(fn, remaining)
  }

  timeout = setTimeout(fn, interval)

  return () => {
    active = false
    clearTimeout(timeout)
  }
}

export default setWaitingInterval
