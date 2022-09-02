import { FC, ReactNode } from 'react'
import forwardBaseProps from '../../helpers/forward-base-props'
import withProps from '../../helpers/with-props'
import { Grid } from './styles'

type DeviceGridProps = {
  children: ReactNode
}

const DeviceGrid = forwardBaseProps<DeviceGridProps>(
  ({ children }, baseProps) => {
    return <Grid {...baseProps}>{children}</Grid>
  }
)

export default DeviceGrid
