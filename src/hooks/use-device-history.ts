import { useState } from 'react'
import Device from '../types/device'

const useDeviceHistory = (
  device: Device,
  states: string[],
  options: { from: number; to: number }
) => {
  const [history, setHistory] = useState(
    Object.fromEntries(states.map((state) => [state, Array<any>()]))
  )

  return history
}
