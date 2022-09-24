import { useEffect, useState } from 'react'
import useIoBrokerConnection from '../contexts/iobroker-connection'
import usePath from './use-path'
import useQueryParams from './use-query-params'

const useSetStates = () => {
  const path = usePath()
  const { queryParams } = useQueryParams()
  const { connection } = useIoBrokerConnection()

  const [didJustSetStates, setDidJustSetStates] = useState(false)

  useEffect(() => {
    if (!didJustSetStates) return

    const timeout = setTimeout(() => {
      setDidJustSetStates(false)
    }, 3000)

    return () => {
      clearTimeout(timeout)
    }
  }, [didJustSetStates])

  useEffect(() => {
    if (
      path !== '/_set-states' ||
      !connection ||
      !Object.keys(queryParams).length
    ) {
      return
    }

    console.log(queryParams)

    for (const [key, value] of Object.entries(queryParams)) {
      const parsedValue = JSON.parse(value)

      console.log(`Setting ${key} to ${parsedValue}`)

      connection.setState(key, {
        val: parsedValue,
      })
    }

    setDidJustSetStates(true)
    window.history.pushState({}, '', '/')
  }, [path, queryParams, connection])

  return didJustSetStates
}

export default useSetStates
