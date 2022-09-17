import { MutableRefObject, Ref, useEffect, useRef } from 'react'

const useFocusOnHover = (
  hoverRef: MutableRefObject<HTMLElement | null>,
  focusRef: MutableRefObject<HTMLElement | null>,
  inDelay = 500,
  outDelay = 500,
  active = true
) => {
  useEffect(() => {
    if (!hoverRef.current || !focusRef.current || !active) return

    let inTimeout: ReturnType<typeof setTimeout>
    let outTimeout: ReturnType<typeof setTimeout>

    const handleMouseEnter = () => {
      if (inDelay === Infinity) {
        return
      }
      inTimeout = setTimeout(() => {
        focusRef.current?.focus()
      }, inDelay)
    }

    const handleMouseLeave = () => {
      clearTimeout(inTimeout)
      if (outDelay === Infinity) {
        return
      }
      outTimeout = setTimeout(() => {
        focusRef.current?.blur()
      }, outDelay)
    }

    hoverRef.current.addEventListener('mouseenter', handleMouseEnter)
    hoverRef.current.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      hoverRef.current?.removeEventListener('mouseenter', handleMouseEnter)
      hoverRef.current?.removeEventListener('mouseleave', handleMouseLeave)
      clearTimeout(inTimeout)
    }
  }, [])
}

export default useFocusOnHover
