import { useEffect, useState } from 'react'

const useIsOffline = () => {
  const isOfflineInitial =
    typeof navigator !== 'undefined' && navigator.onLine === false
  const [isOffline, setIsOffline] = useState(isOfflineInitial)

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
    }
    const handleOffline = () => {
      setIsOffline(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOffline
}

export default useIsOffline
