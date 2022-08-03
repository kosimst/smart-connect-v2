import { AnimatePresence, motion } from 'framer-motion'
import { FC, useEffect, useMemo, useState } from 'react'
import Chip from '../../components/chip'
import DeviceCard from '../../components/device-card'
import DeviceGrid from '../../components/device-grid'
import Icon from '../../components/icon'
import deviceDefinitions from '../../constants/device-definitions'
import { useIoBrokerStates } from '../../contexts/iobroker-states-context'
import { useSettings } from '../../contexts/settings'
import greeting from '../../helpers/greeting'
import groupBy from '../../helpers/group-by'
import {
  Chips,
  Hr,
  Link,
  LinksGrid,
  PageTitle,
  Room,
  RoomTitle,
} from './styles'

const DevicesPage: FC = () => {
  const { devices } = useIoBrokerStates()

  const deviceTypes = useMemo(
    () =>
      devices
        .map((device) => device.type)
        .map((type) => deviceDefinitions[type].name)
        .filter((type, index, types) => types.indexOf(type) === index)
        .sort(),
    [devices]
  )
  const [selectedDeviceTypes, setSelectedDeviceTypes] = useState(
    deviceTypes.map((type) => type)
  )

  useEffect(() => {
    setSelectedDeviceTypes(deviceTypes.map((type) => type))
  }, [deviceTypes])

  const selectedDevices = useMemo(
    () =>
      devices.filter((device) =>
        selectedDeviceTypes.includes(deviceDefinitions[device.type].name)
      ),
    [devices, selectedDeviceTypes]
  )

  const groupedByRoom = useMemo(
    () => groupBy(selectedDevices, 'roomName', 'Other devices'),
    [selectedDevices]
  )

  const { open: openSettings } = useSettings()

  return (
    <>
      <Chips>
        {deviceTypes.map((type) => (
          <Chip
            key={type}
            selected={selectedDeviceTypes.includes(type)}
            onClick={() => {
              if (selectedDeviceTypes.includes(type)) {
                setSelectedDeviceTypes(
                  selectedDeviceTypes.filter((t) => t !== type)
                )
              } else {
                setSelectedDeviceTypes([...selectedDeviceTypes, type])
              }
            }}
            onContextMenu={() => {
              setSelectedDeviceTypes((prev) =>
                prev.length === 1 && prev[0] === type ? deviceTypes : [type]
              )
            }}
          >
            {type}
          </Chip>
        ))}
      </Chips>
      {Object.entries(groupedByRoom).map(([roomName, devices]) => (
        <Room
          key={roomName}
          transition={{
            layout: {
              duration: 0.15,
            },
          }}
          layout
        >
          <RoomTitle>{roomName}</RoomTitle>

          <DeviceGrid>
            <AnimatePresence>
              {devices.map((device) => (
                <DeviceCard device={device} key={device.id} />
              ))}
            </AnimatePresence>
          </DeviceGrid>
        </Room>
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          layout: {
            duration: 0.15,
          },
          opacity: {
            duration: 0.15,
            delay: 0.5,
          },
        }}
        layout
      >
        <Hr />

        <LinksGrid>
          <Link onClick={openSettings}>
            <Icon icon="settings" />
            <span>Settings</span>
          </Link>
        </LinksGrid>
      </motion.div>
    </>
  )
}

export default DevicesPage
