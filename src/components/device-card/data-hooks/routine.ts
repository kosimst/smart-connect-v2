import { useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import DataHook, { DataText } from '../use-data-hook/data-hook'

const useData: DataHook = (device, visible) => {
  const [enabled, setEnabled] = useDeviceState(
    device,
    'enabled',
    false,
    visible ? 'medium' : 'background'
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
  }
}

export default useData
