import { useEffect, useRef, useState } from 'react'

const useRefState = <T>(initialValue: T) => {
  const [state, setState] = useState(initialValue)
  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])
  return [state, setState, stateRef] as const
}

export default useRefState
