import { FC } from 'react'
import forwardBaseProps from '../../../helpers/forward-base-props'
import Pulsating from './pulsating'
import { BigIcon, FullBleedCentered, Text } from './styles'

const ConnectingOverlay = forwardBaseProps((baseProps) => {
  return (
    <FullBleedCentered {...baseProps}>
      <Pulsating>
        <BigIcon icon="cloud_sync" />
      </Pulsating>
    </FullBleedCentered>
  )
})

export default ConnectingOverlay
