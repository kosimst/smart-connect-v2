import { useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import DataHook, { DataText } from '../use-data-hook/data-hook'

const useData: DataHook = (device) => {
  const [present, , , readyState] = useDeviceState(device, 'present', false)

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
    readyState,
  }
}

export default useData
