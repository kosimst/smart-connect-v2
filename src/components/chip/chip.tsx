import { FC } from 'react'
import { Container } from './styles'

export type ChipProps = {
  children: string
  selected: boolean
  onClick?: () => void
  onContextMenu?: () => void
}

const Chip: FC<ChipProps> = ({
  children,
  selected,
  onClick,
  onContextMenu,
}) => {
  return (
    <Container
      onClick={onClick}
      onContextMenu={onContextMenu}
      style={{
        opacity: selected ? 1 : 0.66,
      }}
    >
      {children}
    </Container>
  )
}

export default Chip
