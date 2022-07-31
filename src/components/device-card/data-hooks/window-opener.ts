import useDeviceState from '../../../hooks/use-device-state'
import DataHook from '../use-data-hook/data-hook'

const useData: DataHook = (device) => {
  const [openedLevel, setOpenedLevel] = useDeviceState(
    device,
    'opened-level',
    -0.5
  )

  return {}
}

export default useData
