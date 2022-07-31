import { useEffect } from 'react'

const usePreventAlert = () => {
  useEffect(() => {
    window.alert = (msg: string) => {
      console.log(msg)
    }
  })
}

export default usePreventAlert
