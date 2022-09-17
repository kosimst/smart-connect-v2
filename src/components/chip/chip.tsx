import { FC } from 'react'
import Icon from '../icon'
import { AvailableIcon } from '../icon/available-icons'
import { Container, Chip as StyledChip } from './styles'

export type ChipProps = {
  children: string
  selected: boolean
  onClick?: () => void
  onContextMenu?: () => void
  icon: AvailableIcon
}

const Chip: FC<ChipProps> = ({
  children,
  selected,
  onClick,
  onContextMenu,
  icon,
}) => {
  return (
    <Container onClick={onClick} onContextMenu={onContextMenu}>
      <StyledChip
        label={children}
        variant={selected ? 'filled' : 'outlined'}
        icon={<Icon icon={icon} />}
        tabIndex={0}
        role="button"
      />
    </Container>
  )
}

export default Chip
