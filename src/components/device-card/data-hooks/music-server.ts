import { capitalize } from '@mui/material'
import { useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import DataHook, { DataText } from '../use-data-hook/data-hook'

const useData: DataHook = (device, visible) => {
  const [active] = useDeviceState(
    device,
    'active',
    false,
    visible ? 'medium' : 'background'
  )
  const [paused, setPaused] = useDeviceState(
    device,
    'paused',
    false,
    visible ? 'medium' : 'background'
  )
  const [volume, setVolume] = useDeviceState(
    device,
    'volume',
    0,
    visible ? 'medium' : 'background'
  )
  const [player] = useDeviceState(
    device,
    'player',
    '',
    visible ? 'medium' : 'background'
  )
  const [title] = useDeviceState(
    device,
    'title',
    '',
    visible ? 'medium' : 'background'
  )

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
