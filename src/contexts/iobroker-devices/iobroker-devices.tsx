import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from 'react'
import deviceDefinitions from '../../constants/device-definitions'
import useLocalStorage from '../../hooks/use-local-storage'
import Device from '../../types/device'
import useIoBrokerConnection from '../iobroker-connection'

export const IoBrokerDevicesContext = createContext({
  devices: Array<Device>(),
  getDeviceFromId: (id: string) => null as Device | null,
})

export const IoBrokerDevicesProvider: FC<{
  children: ReactNode
}> = ({ children }) => {
  const { connection } = useIoBrokerConnection()

  const [devices, setDevices] = useLocalStorage(
    'iobroker-devices',
    Array<Device>()
  )

  const getDeviceFromId = useCallback(
    (id: string) => {
      const deviceId = id.split('.').slice(0, -1).join('.')

      return devices.find((device) => device.id === deviceId) || null
    },
    [devices]
  )

  const updateDevices = useCallback(async () => {
    if (!connection) {
      return
    }

    const objects = await connection.getObjects(true)
    const roomEnums = await connection.getEnums('rooms')
    const newDevices = Array<Device>()

    const rooms = Object.values(roomEnums).map((roomEnum) => ({
      id: roomEnum._id,
      members: roomEnum.common.members || [],
      name: roomEnum.common.name,
    }))

    for (const [id, object] of Object.entries(objects)) {
      if (!id.startsWith('alias.0') || !object || object.type !== 'channel') {
        continue
      }

      const room = rooms.find((room) =>
        room.members.some((member: string) => id.startsWith(member))
      )

      const type = object.common.role

      if (!room || !type || !(type in deviceDefinitions)) {
        continue
      }

      // @ts-ignore
      const deviceDefinition = deviceDefinitions[type]!

      const name = object.common.name || deviceDefinition.name

      newDevices.push({
        id,
        name,
        type,
        roomName: room.name,
      })
    }

    setDevices(newDevices)
  }, [connection])

  useEffect(() => {
    updateDevices()

    const interval = setInterval(updateDevices, 30 * 1000)

    return () => clearInterval(interval)
  }, [updateDevices])

  return (
    <IoBrokerDevicesContext.Provider
      value={{
        devices,
        getDeviceFromId,
      }}
    >
      {children}
    </IoBrokerDevicesContext.Provider>
  )
}

const useIoBrokerDevices = () => useContext(IoBrokerDevicesContext)

export default useIoBrokerDevices
