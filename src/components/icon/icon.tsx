import { MotionProps } from 'framer-motion'
import { HTMLMotionProps } from 'framer-motion/types'
import { FC } from 'react'
import clsx from '../../helpers/clsx'
import { AvailableIcon } from './available-icons'
import { Span } from './style'

export type IconProps = {
  filled?: boolean
  icon: AvailableIcon
} & HTMLMotionProps<'span'>

const Icon: FC<IconProps> = ({ icon, className, ...props }) => {
  return (
    <Span className={clsx('material-symbols-rounded', className)} {...props}>
      {icon}
    </Span>
  )
}

export default Icon
