import { capitalize, IconButton } from '@mui/material'
import { FC, useCallback, useState } from 'react'
import CustomActions from '../../../components/custom-actions'
import CustomInfos from '../../../components/custom-infos'
import CustomSlider from '../../../components/custom-slider'
import Icon from '../../../components/icon'
import useDeviceState from '../../../hooks/use-device-state'
import Device from '../../../types/device'
import { SliderFlex } from './styles'

const Controls: FC<{
  device: Device
}> = ({ device }) => {
  const [active, setActive] = useDeviceState(device, 'active', false)
  const [artist] = useDeviceState(device, 'artist', '')
  const [title] = useDeviceState(device, 'title', '')
  const [progress, setProgress] = useDeviceState(device, 'progress', 0)
  const [volume, setVolume] = useDeviceState(device, 'volume', 0)
  const [player] = useDeviceState(device, 'player', '')
  const [paused, setPaused] = useDeviceState(device, 'paused', false)
  const [durationMs] = useDeviceState(device, 'duration-ms', 0)

  const toggle = useCallback(() => setPaused(!paused), [paused, setPaused])

  const [beforeMute, setBeforeMute] = useState(volume ?? 33)
  const mute = useCallback(() => {
    setBeforeMute(volume)
    setVolume(0)
  }, [volume, setBeforeMute, setVolume])
  const unmute = useCallback(
    () => setVolume(beforeMute),
    [beforeMute, setVolume]
  )
  const toggleMute = useCallback(() => {
    if (volume === 0) {
      unmute()
    } else {
      mute()
    }
  }, [mute, unmute, volume])

  const forward5Sec = useCallback(() => {
    const currMs = progress * durationMs
    const newMs = currMs + 5000
    const newProgress = newMs / durationMs
    setProgress(newProgress)
  }, [progress, setProgress])
  const backward5Sec = useCallback(() => {
    const currMs = progress * durationMs
    const newMs = currMs - 5000
    const newProgress = newMs / durationMs
    setProgress(newProgress)
  }, [progress, setProgress])
  const forward30Sec = useCallback(() => {
    const currMs = progress * durationMs
    const newMs = currMs + 30000
    const newProgress = newMs / durationMs
    setProgress(newProgress)
  }, [progress, setProgress])
  const backward30Sec = useCallback(() => {
    const currMs = progress * durationMs
    const newMs = currMs - 30000
    const newProgress = newMs / durationMs
    setProgress(newProgress)
  }, [progress, setProgress])
  const stop = useCallback(() => {
    setActive(false)
  }, [setActive])

  return (
    <>
      <SliderFlex>
        <CustomInfos label="Status">
          {active
            ? `Playback from ${capitalize(player)} (${
                paused ? 'paused' : 'playing'
              })`
            : 'Idle'}
        </CustomInfos>
        {active && (
          <CustomInfos label="Media">
            {title} from {artist}
          </CustomInfos>
        )}

        {active && (
          <CustomActions>
            <IconButton onClick={backward5Sec}>
              <Icon icon="replay_5" />
            </IconButton>
            <IconButton onClick={backward30Sec}>
              <Icon icon="replay_30" />
            </IconButton>

            <IconButton onClick={toggle}>
              <Icon icon={paused ? 'play_arrow' : 'pause'} />
            </IconButton>
            <IconButton onClick={stop}>
              <Icon icon="stop" />
            </IconButton>
            <IconButton onClick={toggleMute}>
              <Icon icon={volume === 0 ? 'volume_up' : 'volume_off'} />
            </IconButton>
            <IconButton onClick={forward30Sec}>
              <Icon icon="forward_30" />
            </IconButton>
            <IconButton onClick={forward5Sec}>
              <Icon icon="forward_5" />
            </IconButton>
          </CustomActions>
        )}

        {active && (
          <CustomSlider
            value={progress * durationMs}
            onChange={(value) => setProgress(value / durationMs)}
            min={0}
            max={durationMs}
            step={0.1}
            time
            label="Progress"
          />
        )}

        {active && (
          <CustomSlider
            value={volume}
            onChange={setVolume}
            min={0}
            max={100}
            step={1}
            label="Volume"
          />
        )}
      </SliderFlex>
    </>
  )
}

export default Controls
