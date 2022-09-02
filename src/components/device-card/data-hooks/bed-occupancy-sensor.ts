import { useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import DataHook, { DataText } from '../use-data-hook/data-hook'

const useData: DataHook = (device, visible) => {
  const [present, setPresent] = useDeviceState(
    device,
    'present',
    false,
    visible ? 'medium' : 'background'
  )

  const texts = useMemo<DataText[]>(
    () => [
      {
        id: 'present',
        text: present ? 'Present' : 'Absent',
      },
    ],
    [present]
  )

  return {
    toggleValue: present,
    texts,
  }
}

export default useData
