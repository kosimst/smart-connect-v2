import styled from '@emotion/styled'
import { IconButton, Slider, Stack, Tooltip } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { FC, useCallback } from 'react'
import CustomActions from '../../../components/custom-actions'
import CustomInfos from '../../../components/custom-infos'
import CustomSlider from '../../../components/custom-slider'
import CustomToggle from '../../../components/custom-toggle'
import Icon from '../../../components/icon'
import useDeviceState from '../../../hooks/use-device-state'
import Device from '../../../types/device'
import { Fix, SliderFlex } from './styles'

const Controls: FC<{
  device: Device
}> = ({ device }) => {
  const [on, setOn] = useDeviceState(device, 'on', false, 'high')
  const [power, , powerExists] = useDeviceState(device, 'power', 0, 'high')

  return (
    <>
      <SliderFlex>
        <CustomToggle value={on} onChange={setOn} />

        {powerExists && (
          <CustomInfos>
            Currently consuming{' '}
            <AnimatePresence>
              <Fix>
                <motion.span
                  key={power}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {power}
                </motion.span>
              </Fix>
            </AnimatePresence>{' '}
            watts
          </CustomInfos>
        )}
      </SliderFlex>
    </>
  )
}

export default Controls
