import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from 'react'
import ioBrokerDb from '../db/iobroker-db'
import randomUUID from '../helpers/randomUUID'
import useIoBroker from './iobroker-context'

type IoBrokerStates = {
  subscribeState(id: string): () => void
  updateState(id: string, val: any): void
}

const IoBrokerStatesContext = createContext<IoBrokerStates>({
  subscribeState: () => {
    throw new Error('State provider not initialized yet')
  },
  updateState: () => {
    throw new Error('State provider not initialized yet')
  },
})

export const IoBrokerStatesProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { fetchIoBroker, connected } = useIoBroker()

  const fetchDevices = useCallback(async () => {
    const serviceWorker = navigator.serviceWorker.controller

    if (!serviceWorker) {
      return
    }

    serviceWorker.postMessage({
      type: 'fetch-devices',
    })
  }, [fetchIoBroker])

  const fetchStates = useCallback(async () => {
    const serviceWorker = navigator.serviceWorker.controller

    if (!serviceWorker) {
      return
    }

    serviceWorker.postMessage({
      type: 'fetch-states',
    })
  }, [fetchIoBroker])

  const updateState = useCallback(
    async (id: string, value: any) => {
      await fetchIoBroker(`/set/${id}?value=${value}`)

      await ioBrokerDb.states.put({
        id: id,
        value,
      })

      fetchStates()
    },
    [fetchIoBroker, fetchStates]
  )

  useEffect(() => {
    if (!connected) {
      return
    }

    fetchDevices()
    const interval = setInterval(fetchDevices, 15 * 1000)

    return () => {
      clearInterval(interval)
    }
  }, [connected, fetchDevices])

  useEffect(() => {
    if (!connected) {
      return
    }

    fetchStates()
    const interval = setInterval(fetchStates, 2000)

    return () => {
      clearInterval(interval)
    }
  }, [connected, fetchStates])

  const subscribeState = useCallback<IoBrokerStates['subscribeState']>((id) => {
    const subscriptionId = randomUUID()

    ioBrokerDb.subscribedStates.put({ id, subscriptionId })

    return () => {
      ioBrokerDb.subscribedStates.delete(subscriptionId)
    }
  }, [])

  return (
    <IoBrokerStatesContext.Provider
      value={{
        subscribeState,
        updateState,
      }}
    >
      {children}
    </IoBrokerStatesContext.Provider>
  )
}

export const useIoBrokerStates = () => useContext(IoBrokerStatesContext)

export default IoBrokerStatesContext
