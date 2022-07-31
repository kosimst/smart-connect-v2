import { FC, ReactNode } from 'react'
import { Grid } from './styles'

type DeviceGridProps = {
  children: ReactNode
}

const DeviceGrid: FC<DeviceGridProps> = ({ children }) => {
  return <Grid>{children}</Grid>
}

export default DeviceGrid
