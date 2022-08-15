import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useMemo, useState } from 'react'
import ioBrokerDb from '../db/iobroker-db'
import Device from '../types/device'

const useHistories = (
  device: Device,
  states: string[],
  from: number,
  to: number
) => {
  const [history, setHistory] = useState<{
    [state: string]: {
      timestamp: number
      value: any
    }[]
  }>(Object.fromEntries(states.map((state) => [state, []])))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const credentials = useLiveQuery(
    () => ioBrokerDb.credentials.toArray(),
    [],
    []
  )[0]

  const fromIsoDate = useMemo(() => new Date(from).toISOString(), [from])
  const toIsoDate = useMemo(() => new Date(to).toISOString(), [to])

  useEffect(() => {
    if (!credentials || !states.length) {
      return
    }

    const fetchHistory = async () => {
      setLoading(true)
      setError(false)

      const response = await fetch(
        `https://${credentials.url}/query/${states
          .map((state) => `${device.id}.${state}`)
          .join(',')}?dateFrom=${fromIsoDate}&dateTo=${toIsoDate}`,
        {
          headers: {
            'CF-Access-Client-Id': credentials.cfClientId,
            'CF-Access-Client-Secret': credentials.cfClientSecret,
          },
        }
      )

      if (!response.ok) {
        setError(true)
        setLoading(false)
        return
      }

      const json = await response.json()

      console.log(json)

      //setHistory(json)
      setLoading(false)
      setError(false)
    }

    fetchHistory()
  }, [credentials, device, from, to, states])

  return [history, loading, error] as const
}

export default useHistories
