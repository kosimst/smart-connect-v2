import { useEffect, useMemo } from 'react'

const useScrollLock = (locked: boolean) => {
  const elements = useMemo(
    () =>
      document.querySelectorAll(
        '#scroll-lock > div > main, #scroll-lock, #scroll-lock > div'
      ),
    []
  )

  useEffect(() => {
    if (locked) {
      elements.forEach((el) => ((el as HTMLElement).style.overflowY = 'hidden'))
    } else {
      elements.forEach((el) => ((el as HTMLElement).style.overflowY = 'auto'))
    }
  }, [locked])
}

export default useScrollLock
