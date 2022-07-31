import { useEffect, useState } from 'react'
import { useSocketClient } from '../contexts/socket-client'

const useIsOffline = () => {
  const [isOffline, setIsOffline] = useState(false)
  const { reachable } = useSocketClient()

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOffline || !reachable
}

export default useIsOffline
