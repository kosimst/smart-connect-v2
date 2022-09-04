import { RefObject, useCallback, useEffect, useState } from 'react'

const useRect = (ref: RefObject<HTMLElement | null>) => {
  const [rect, setRect] = useState<DOMRect | null>(null)

  const updateRect = useCallback(() => {
    if (ref.current) {
      setRect(ref.current.getBoundingClientRect())

      requestAnimationFrame(updateRect)
    }
  }, [ref])

  useEffect(() => {
    updateRect()

    if (!ref.current) {
      return
    }

    const resizeObserver = new ResizeObserver(updateRect)

    resizeObserver.observe(ref.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [updateRect])

  return rect
}

export default useRect
