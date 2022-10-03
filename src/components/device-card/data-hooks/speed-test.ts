import { useCallback, useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import DataHook, { DataText } from '../use-data-hook/data-hook'

const useData: DataHook = (device) => {
  const [download, , , readyState] = useDeviceState(
    device,
    'download-megabits',
    0
  )
  const [upload] = useDeviceState(device, 'upload-megabits', 0)
  const [running] = useDeviceState(device, 'running', false)
  const [, setRunBtn] = useDeviceState(device, 'run', false)

  const texts = useMemo<DataText[]>(
    () =>
      !running
        ? [
            {
              id: 'download',
              text: `${download.toFixed(0)}Mbps`,
            },
            {
              id: 'upload',
              text: `${upload.toFixed(0)}Mbps`,
            },
          ]
        : [
            {
              id: 'running',
              text: 'Running...',
            },
          ],
    [download, upload, running]
  )

  const onToggleChange = useCallback(() => {
    if (running) return

    setRunBtn(true)
  }, [running, setRunBtn])

  return {
    texts,
    onToggleChange,
    readyState,
  }
}

export default useData
