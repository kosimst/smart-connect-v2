import { useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import DataHook, { DataText } from '../use-data-hook/data-hook'

const useData: DataHook = (device) => {
  const [download] = useDeviceState(device, 'download-megabits', 0)
  const [upload] = useDeviceState(device, 'upload-megabits', 0)
  const [running] = useDeviceState(device, 'running', false)
  const [, setTestButton] = useDeviceState(device, 'test-button', true)

  const texts = useMemo<DataText[]>(
    () =>
      running
        ? [
            {
              id: 'running',
              text: 'Running...',
            },
          ]
        : [
            {
              id: 'download',
              text: `${download.toFixed(0)}Mbps`,
            },
            {
              id: 'upload',
              text: `${upload.toFixed(0)}Mbps`,
            },
          ],
    [download, upload, running]
  )

  return {
    texts,
    toggleValue: true,
    onToggleChange: () => {
      if (running) {
        return
      }

      setTestButton(true)
    },
  }
}

export default useData
