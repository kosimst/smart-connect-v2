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
import ioBrokerDb from '../db/iobroker-db'
import nSizedChunks from '../helpers/n-sized-chunks'
import randomUUID from '../helpers/randomUUID'
import Device from '../types/device'
import useIoBroker from './iobroker-context'

type IoBrokerStates = {
  subscribeState(id: string): () => void
  updateState(id: string, val: any): void
  devices: Device[]
}

const IoBrokerStatesContext = createContext<IoBrokerStates>({
  subscribeState: () => {
    throw new Error('State provider not initialized yet')
  },
  updateState: () => {
    throw new Error('State provider not initialized yet')
  },
  devices: [],
})

export const IoBrokerStatesProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [devices, setDevices] = useState<Device[]>([])

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
        devices,
        updateState,
      }}
    >
      {children}
    </IoBrokerStatesContext.Provider>
  )
}

export const useIoBrokerStates = () => useContext(IoBrokerStatesContext)

export default IoBrokerStatesContext
