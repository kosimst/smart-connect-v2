import { useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import DataHook, { DataText } from '../use-data-hook/data-hook'

const useData: DataHook = (device, visible) => {
  const [on, setOn] = useDeviceState(
    device,
    'on',
    false,
    visible ? 'medium' : 'background'
  )

  const texts = useMemo<DataText[]>(
    () => [
      {
        id: 'on',
        text: on ? 'On' : 'Off',
      },
    ],
    [on]
  )

  return {
    texts,
    toggleValue: on,
    onToggleChange: setOn,
  }
}

export default useData
