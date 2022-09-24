import { AnimatePresence, motion } from 'framer-motion'
import { FC } from 'react'
import CustomSlider from '../../../components/custom-slider'
import CustomToggle from '../../../components/custom-toggle'
import withProps from '../../../helpers/with-props'
import useDeviceState from '../../../hooks/use-device-state'
import Device from '../../../types/device'
import { SliderFlex } from './styles'

const FadeInSlider = withProps(motion(CustomSlider), {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
  transition: {
    duration: 0.2,
  },
})

const Controls: FC<{
  device: Device
}> = ({ device }) => {
  const [brightness, setBrightness, brightnessExists] = useDeviceState(
    device,
    'brightness',
    0,
    'high'
  )
  const [hue, setHue, hueExists] = useDeviceState(device, 'hue', 0)
  const [colorTemperature, setColorTemperature, ctExists] = useDeviceState(
    device,
    'color-temperature',
    2198,
    'high'
  )
  const [on, setOn, onExists] = useDeviceState(device, 'on', false, 'high')

  return (
    <AnimatePresence>
      <SliderFlex>
        {onExists && (
          <CustomToggle label="On/Off" value={on} onChange={setOn} />
        )}

        {brightnessExists && (
          <FadeInSlider
            label="Brightness"
            value={brightness}
            onChange={setBrightness}
          />
        )}

        {ctExists && (
          <FadeInSlider
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
          <FadeInSlider
            label="Hue"
            unit="°"
            max={360}
            variant="hue"
            value={hue}
            onChange={setHue}
          />
        )}
      </SliderFlex>
    </AnimatePresence>
  )
}

export default Controls
