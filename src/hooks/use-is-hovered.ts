import { MutableRefObject, useEffect, useState } from 'react'

const useIsHovered = (ref: MutableRefObject<HTMLElement | null>) => {
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => setIsHovered(false)

    ref.current.addEventListener('mouseenter', handleMouseEnter)
    ref.current.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      ref.current?.removeEventListener('mouseenter', handleMouseEnter)
      ref.current?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return isHovered
}

export default useIsHovered
