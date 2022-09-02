import { useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import DataHook, { DataText } from '../use-data-hook/data-hook'

const useData: DataHook = (device, visible) => {
  const [download] = useDeviceState(
    device,
    'download-megabits',
    0,
    visible ? 'medium' : 'background'
  )
  const [upload] = useDeviceState(
    device,
    'upload-megabits',
    0,
    visible ? 'medium' : 'background'
  )
  const [running] = useDeviceState(
    device,
    'running',
    false,
    visible ? 'medium' : 'background'
  )
  const [, setTestButton] = useDeviceState(
    device,
    'test-button',
    true,
    visible ? 'medium' : 'background'
  )

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
