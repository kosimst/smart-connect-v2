import { useEffect } from 'react'
import preventDefault from '../helpers/prevent-default'

const useNoContextMenu = () => {
  useEffect(() => {
    document.addEventListener('contextmenu', preventDefault)

    return () => {
      document.removeEventListener('contextmenu', preventDefault)
    }
  }, [])
}

export default useNoContextMenu
