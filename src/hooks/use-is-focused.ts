import { MutableRefObject, useEffect, useState } from 'react'

const useIsFocused = (ref: MutableRefObject<HTMLElement | null>) => {
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const handleFocus = () => setIsFocused(true)
    const handleBlur = () => setIsFocused(false)

    ref.current.addEventListener('focus', handleFocus)
    ref.current.addEventListener('blur', handleBlur)

    return () => {
      ref.current?.removeEventListener('focus', handleFocus)
      ref.current?.removeEventListener('blur', handleBlur)
    }
  }, [])

  return isFocused
}

export default useIsFocused
