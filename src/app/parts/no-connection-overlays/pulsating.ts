import { motion } from 'framer-motion'
import withProps from '../../../helpers/with-props'

const Pulsating = withProps(motion.div, {
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: 0,
  },
  transition: {
    duration: 0.5,
    repeat: Infinity,
    repeatType: 'reverse',
    ease: 'easeInOut',
  },
})

export default Pulsating
