import { useEffect } from 'react'

const useScrollLock = (locked: boolean) => {
  useEffect(() => {
    if (locked) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [locked])
}

export default useScrollLock
