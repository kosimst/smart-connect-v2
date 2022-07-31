import { useSpring as _useSpring } from 'use-spring'

const useSpring = (target: number, active = true) => {
  const [curr] = _useSpring(target)

  return active ? curr : target
}

export default useSpring
