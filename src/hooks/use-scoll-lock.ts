import { useEffect, useMemo } from 'react'

const useScrollLock = (locked: boolean) => {
  const element = useMemo(() => document.getElementById('scroll-lock')!, [])

  useEffect(() => {
    if (locked) {
      element.style.overflow = 'hidden'
    } else {
      element.style.overflow = 'auto'
    }
  }, [locked])
}

export default useScrollLock
