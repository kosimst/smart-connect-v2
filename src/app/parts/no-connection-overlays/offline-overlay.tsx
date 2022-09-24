import { FC } from 'react'
import forwardBaseProps from '../../../helpers/forward-base-props'
import { BigIcon, FullBleedCentered, Text } from './styles'

const OfflineOverlay = forwardBaseProps((baseProps) => {
  return (
    <FullBleedCentered {...baseProps}>
      <BigIcon icon="cloud_off" />

      <Text>Offline</Text>
    </FullBleedCentered>
  )
})

export default OfflineOverlay
