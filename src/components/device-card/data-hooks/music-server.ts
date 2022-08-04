import { capitalize } from '@mui/material'
import { useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import DataHook, { DataText } from '../use-data-hook/data-hook'

const useData: DataHook = (device) => {
  const [active] = useDeviceState(device, 'active', false)
  const [paused, setPaused] = useDeviceState(device, 'paused', false)
  const [volume, setVolume] = useDeviceState(device, 'volume', 0)
  const [player] = useDeviceState(device, 'player', '')
  const [title] = useDeviceState(device, 'title', '')

  const texts = useMemo<DataText[]>(
    () =>
      [
        active && {
          id: 'playback',
          text: `${paused ? 'Paused' : capitalize(player)}`,
        },
        active && {
          id: volume,
          text: `${volume}%`,
        },
        !active && {
          id: active,
          text: 'Idle',
        },
      ].filter(Boolean) as DataText[],
    [active, paused, volume, player, title]
  )

  return {
    toggleValue: active && !paused,
    onToggleChange: (val) => setPaused(!val),
    sliderValue: volume,
    onSliderChange: (vol) => setVolume(Math.floor(vol)),
    texts,
  }
}

export default useData
