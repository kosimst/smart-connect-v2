import { useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import DataHook, { DataText } from '../use-data-hook/data-hook'

const useData: DataHook = (device) => {
  const [enabled, setEnabled, , readyState] = useDeviceState(
    device,
    'enabled',
    false
  )

  const texts = useMemo<DataText[]>(
    () => [
      {
        id: 'on',
        text: enabled ? 'Enabled' : 'Disabled',
      },
    ],
    [enabled]
  )

  return {
    texts,
    toggleValue: enabled,
    onToggleChange: setEnabled,
    readyState,
  }
}

export default useData
