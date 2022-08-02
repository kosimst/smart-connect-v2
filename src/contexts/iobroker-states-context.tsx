import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { isSupportedDeviceType } from '../constants/device-definitions'
import nSizedChunks from '../helpers/n-sized-chunks'
import Device from '../types/device'
import useIoBroker from './iobroker-context'

type IoBrokerStates = {
  subscribeState(id: string, cb: (val: any) => void): () => void
  //updateState(id: string, val: any): void
  devices: Device[]
}

const IoBrokerStatesContext = createContext<IoBrokerStates>({
  subscribeState: () => {
    throw new Error('State provider not initialized yet')
  },
  devices: [],
})

export const IoBrokerStatesProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [devices, setDevices] = useState<Device[]>([])
  const [stateSubscriptions, setStateSubscriptions] = useState<
    Map<string, Set<Parameters<IoBrokerStates['subscribeState']>['1']>>
  >(new Map())

  useEffect(() => {
    const devices = localStorage.getItem('devices')
    if (devices) {
      setDevices(JSON.parse(devices))
    }
  }, [])

  const { fetchIoBroker, connected } = useIoBroker()

  const fetchDevices = useCallback(async () => {
    const deviceStates = await fetchIoBroker(
      '/objects?pattern=alias.0.*&type=channel'
    )

    const newDevices = Array<Device>()

    for (const {
      common: { name, role },
      _id: id,
      enums,
    } of Object.values<any>(deviceStates)) {
      if (!isSupportedDeviceType(role)) {
        continue
      }

      const roomName = Object.entries(enums).find(
        ([k, v]) => k.startsWith('enum.rooms.') && v
      )?.[1] as string | undefined

      newDevices.push({
        id,
        name,
        type: role,
        roomName,
      })
    }

    setDevices(newDevices)
    localStorage.setItem('devices', JSON.stringify(newDevices))
  }, [fetchIoBroker])

  const fetchStates = useCallback(async () => {
    const chunks = nSizedChunks([...stateSubscriptions.entries()], 10)

    for (const chunk of chunks) {
      const path = '/getBulk/' + chunk.map(([id]) => `${id}`).join(',')

      const res = await fetchIoBroker(path)

      for (const { id, val } of res) {
        const subscriptions = stateSubscriptions.get(id)
        if (subscriptions) {
          for (const cb of subscriptions) {
            cb(val)
          }
        }
      }
    }
  }, [fetchIoBroker, stateSubscriptions])

  useEffect(() => {
    if (!connected) {
      return
    }

    fetchDevices()
    const interval = setInterval(fetchDevices, 2 * 60 * 1000)

    return () => {
      clearInterval(interval)
    }
  }, [connected, fetchDevices])

  useEffect(() => {
    if (!connected) {
      return
    }

    fetchStates()
    const interval = setInterval(fetchStates, 5 * 1000)

    return () => {
      clearInterval(interval)
    }
  }, [connected, fetchStates])

  const subscribeState = useCallback<IoBrokerStates['subscribeState']>(
    (id, cb) => {
      setStateSubscriptions((prev) => {
        const stateSubscriptionSet = new Set(prev.get(id))
        const newVal = new Map(prev)

        stateSubscriptionSet.add(cb)
        newVal.set(id, stateSubscriptionSet)

        return newVal
      })

      return () => {
        setStateSubscriptions((prev) => {
          const stateSubscriptionSet = new Set(prev.get(id))
          const newVal = new Map(prev)

          stateSubscriptionSet.delete(cb)
          newVal.set(id, stateSubscriptionSet)

          return newVal
        })
      }
    },
    []
  )

  return (
    <IoBrokerStatesContext.Provider
      value={{
        subscribeState,
        devices,
      }}
    >
      {children}
    </IoBrokerStatesContext.Provider>
  )
}

export const useIoBrokerStates = () => useContext(IoBrokerStatesContext)

export default IoBrokerStatesContext
