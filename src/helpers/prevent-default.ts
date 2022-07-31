import { SyntheticEvent } from 'react'

const preventDefault = <E extends SyntheticEvent | Event>(event: E) => {
  event.preventDefault()
  event.stopPropagation()
}

export default preventDefault
