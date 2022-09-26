import { useEffect, useState } from 'react'
import useIoBrokerConnection from '../contexts/iobroker-connection'
import useIoBrokerDevices from '../contexts/iobroker-devices'
import { useIoBrokerStates } from '../contexts/iobroker-states/iobroker-states'
import Device from '../types/device'

const useOpenedDevices = () => {
  const { connection } = useIoBrokerConnection()
  const { getDeviceFromId } = useIoBrokerDevices()
  const { subscribeState } = useIoBrokerStates()

  const [openedStates, setOpenedStates] = useState<string[]>([])

  const [openedDevices, setOpenedDevices] = useState<
    { device: Device; openedState: 0 | 1 | 2 }[]
  >([])

  useEffect(() => {
    const fetchStatesToWatch = async () => {
      if (!connection) {
        return
      }

      const states = await connection.getStates('alias.0.*')
      const newOpenedStates = Object.fromEntries(
        Object.entries(states).filter(([id]) => id.endsWith('.opened'))
      )

      const newOpenedDevices = Object.entries(newOpenedStates)
        .filter(([, state]) => state?.val)
        .map(([id]) => ({ device: getDeviceFromId(id), openedState: 2 }))
        .filter(({ device }) => device) as {
        device: Device
        openedState: 0 | 1 | 2
      }[]

      const combinedOpenedDevices = Array<{
        device: Device
        openedState: 0 | 1 | 2
      }>()

      for (const { device, openedState } of newOpenedDevices) {
        // ignore door-sensor
        if (device.type === 'door-sensor') {
          continue
        }

        if (device.type === 'window-tilted-sensor') {
          const openedSensor = newOpenedDevices.find(
            ({ device: d }) =>
              d.type === 'window-opened-sensor' &&
              d.roomName === device.roomName &&
              d.name === device.name
          )

          if (openedSensor) {
            combinedOpenedDevices.push({
              device,
              openedState: 2,
            })
          } else {
            combinedOpenedDevices.push({
              device,
              openedState: 1,
            })
          }
        } else {
          combinedOpenedDevices.push({
            device,
            openedState,
          })
        }
      }

      setOpenedDevices(combinedOpenedDevices)
      setOpenedStates(Object.keys(newOpenedStates))
    }

    fetchStatesToWatch()
  }, [connection])

  useEffect(() => {
    const abortController = new AbortController()

    const watchStates = async () => {
      for (const id of openedStates) {
        subscribeState(
          id,
          (val) => {
            const device = getDeviceFromId(id)

            if (!device) {
              return
            }

            setOpenedDevices((devices) =>
              devices.filter((d) => d.device.id !== device.id)
            )

            if (val) {
              setOpenedDevices((devices) => {
                const newDevices = [...devices]

                // ignore door-sensor
                if (device.type === 'door-sensor') {
                  return newDevices
                }

                if (device.type === 'window-tilted-sensor') {
                  const openedSensor = newDevices.find(
                    ({ device: d }) =>
                      d.type === 'window-opened-sensor' &&
                      d.roomName === device.roomName &&
                      d.name === device.name
                  )

                  if (openedSensor) {
                    return newDevices
                  } else {
                    return [
                      ...newDevices,
                      {
                        device,
                        openedState: 1,
                      },
                    ]
                  }
                }

                return [
                  ...newDevices,
                  {
                    device,
                    openedState: 2,
                  },
                ]
              })
            }
          },
          abortController.signal
        )
      }
    }

    watchStates()

    return () => {
      abortController.abort()
    }
  }, [openedStates, subscribeState, getDeviceFromId])

  const filtered = openedDevices.filter(({ device, openedState }) => {
    const otherSensorOnSameWindow = openedDevices.find(
      ({ device: d }) =>
        d.type !== device.type &&
        d.name === device.name &&
        d.roomName === device.roomName
    )

    if (!otherSensorOnSameWindow) {
      return true
    }

    if (device.type === 'window-tilted-sensor') {
      return false
    }

    return true
  })

  return filtered
}

export default useOpenedDevices
