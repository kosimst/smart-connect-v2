import styled from '@emotion/styled'
import { Slider, Stack } from '@mui/material'
import { FC } from 'react'
import CustomSlider from '../../../components/custom-slider'
import CustomToggle from '../../../components/custom-toggle'
import Icon from '../../../components/icon'
import useDeviceState from '../../../hooks/use-device-state'
import Device from '../../../types/device'
import { SliderFlex } from './styles'

const Controls: FC<{
  device: Device
}> = ({ device }) => {
  const [brightness, setBrightness, brightnessExists] = useDeviceState(
    device,
    'brightness',
    0
  )
  const [hue, setHue, hueExists] = useDeviceState(device, 'hue', 0)
  const [colorTemperature, setColorTemperature, ctExists] = useDeviceState(
    device,
    'color-temperature',
    2198
  )
  const [on, setOn, onExists] = useDeviceState(device, 'on', false)

  return (
    <>
      <SliderFlex>
        {onExists && (
          <CustomToggle label="On/Off" value={on} onChange={setOn} />
        )}

        {brightnessExists && (
          <CustomSlider
            label="Brightness"
            value={brightness}
            onChange={setBrightness}
          />
        )}

        {ctExists && (
          <CustomSlider
            label="Color temperature"
            min={2198}
            max={6494}
            unit="K"
            variant="color-temperature"
            value={colorTemperature}
            onChange={setColorTemperature}
          />
        )}

        {hueExists && (
          <CustomSlider
            label="Hue"
            unit="°"
            max={360}
            variant="hue"
            value={hue}
            onChange={setHue}
          />
        )}
      </SliderFlex>
    </>
  )
}

export default Controls
