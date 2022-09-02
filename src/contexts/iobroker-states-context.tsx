import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import ioBrokerDb from '../db/iobroker-db'
import randomUUID from '../helpers/randomUUID'
import useIoBroker from './iobroker-context'
import IoBrokerSync, { SubscriptionPriority } from '../workers/iobroker-sync'
import Device from '../types/device'

type IoBrokerStates = {
  subscribeState(
    id: string,
    priority: SubscriptionPriority
  ): Promise<() => Promise<void>>
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

const ioBrokerSync = new IoBrokerSync()

export const IoBrokerStatesProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { fetchIoBroker, connected } = useIoBroker()

  useEffect(() => {
    if (connected) {
      ioBrokerSync.start()
    } else {
      ioBrokerSync.stop()
    }
  }, [connected])

  useEffect(() => {
    ioBrokerDb.subscribedStates.clear()
  }, [])

  const updateState = useCallback(
    async function (id: string, value: any) {
      await fetchIoBroker(`/set/${id}?value=${value}`)

      ioBrokerSync.refetchDevice(id.split('.').slice(0, -1).join('.'))

      await ioBrokerDb.states.put({
        id: id,
        value,
        role: id.split('.').at(-1) as string,
        ts: new Date(),
      })
    },
    [fetchIoBroker]
  )

  const subscribeState = useCallback<IoBrokerStates['subscribeState']>(
    async (id, priority: SubscriptionPriority = 'medium') => {
      const unsubscribe = await ioBrokerSync.subscribeState(id, priority)

      return unsubscribe
    },
    []
  )

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
