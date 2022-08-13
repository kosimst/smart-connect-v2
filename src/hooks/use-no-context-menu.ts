import { useEffect } from 'react'
import preventDefault from '../helpers/prevent-default'

const useNoContextMenu = () => {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        e.target instanceof Element &&
        e.target.matches('input:not([type="range"]) ,textarea')
      ) {
        return
      }

      e.preventDefault()
    }

    document.addEventListener('contextmenu', handler)

    return () => {
      document.removeEventListener('contextmenu', handler)
    }
  }, [])
}

export default useNoContextMenu
