import { Badge, IconButton, Typography, Chip as MuiChip } from '@mui/material'
import { AnimatePresence, AnimateSharedLayout } from 'framer-motion'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import Chip from '../../components/chip'
import DeviceCard from '../../components/device-card'
import DeviceGrid from '../../components/device-grid'
import ExpandableChips from '../../components/expandable-chips'
import Icon from '../../components/icon'
import { AvailableIcon } from '../../components/icon/available-icons'
import deviceDefinitions, {
  SupportedDeviceType,
} from '../../constants/device-definitions'
import useDeviceDetails from '../../contexts/device-details'
import { useSettings } from '../../contexts/settings'
import groupBy from '../../helpers/group-by'
import toKebabCase from '../../helpers/to-kebab-case'
import useDevices from '../../hooks/use-devices'
import useLowBatteryDevices from '../../hooks/use-low-battery-devices'
import useOpenedDevices from '../../hooks/use-opened-devices'
import useUnavailableDevices from '../../hooks/use-unavailable-devices'
import {
  FilterIconButton,
  Link,
  LinksGrid,
  Room,
  RoomTitle,
  StatusContainer,
  StyledDeviceGrid,
  StyledExpandableChips,
  StyledExpandableStatus,
  Title,
  Version,
} from './styles'

const DevicesPage: FC = () => {
  const devices = useDevices()

  const isHidden = useCallback(
    (deviceFullName: string) =>
      Object.values(deviceDefinitions).some(
        // @ts-ignore
        ({ fullName, hidden }) => fullName === deviceFullName && !!hidden
      ),
    []
  )

  const deviceTypes = useMemo(
    () =>
      devices
        .map((device) => device.type)
        .map((type) => deviceDefinitions[type].fullName)
        .filter((type, index, types) => types.indexOf(type) === index)
        .sort(),
    [devices]
  )
  const getIcon = useCallback((fullName: string): AvailableIcon => {
    const deviceDefinition = Object.entries(deviceDefinitions).find(
      ([, definition]) => definition.fullName === fullName
    )
    return deviceDefinition ? deviceDefinition[1].icon : 'home_iot_device'
  }, [])
  const [selectedDeviceTypes, setSelectedDeviceTypes] = useState([] as string[])
  useEffect(() => {
    const storedSelectedDeviceTypes = localStorage.getItem(
      'selectedDeviceTypes'
    )
    if (storedSelectedDeviceTypes) {
      setSelectedDeviceTypes(JSON.parse(storedSelectedDeviceTypes))
    } else {
      setSelectedDeviceTypes(deviceTypes)
    }
  }, [deviceTypes])

  const [favoriteRoom, setFavoriteRoom] = useState('Simon')
  useEffect(() => {
    const storedFavoriteRoom = localStorage.getItem('favoriteRoom')

    if (storedFavoriteRoom) {
      setFavoriteRoom(storedFavoriteRoom)
    }
  }, [])

  const selectedDevices = useMemo(
    () =>
      devices.filter(
        (device) =>
          selectedDeviceTypes.includes(
            deviceDefinitions[device.type].fullName
          ) && !isHidden(deviceDefinitions[device.type].fullName)
      ),
    [devices, selectedDeviceTypes]
  )

  const groupedByRoom = useMemo(() => {
    const sorted = Object.entries(groupBy(devices, 'roomName', 'Other devices'))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([roomName, devices]) =>
          [
            roomName,
            devices.sort((a, b) => b.type.localeCompare(a.type)),
          ] as const
      )
      .map(([roomName, devices]) => {
        const devicesWithVisibility = devices.map((device) => {
          const visible =
            selectedDeviceTypes.includes(
              deviceDefinitions[device.type].fullName
            ) && !isHidden(deviceDefinitions[device.type].fullName)

          return {
            device,
            visible,
          }
        })

        return [roomName, devicesWithVisibility] as const
      })

    const withoutFavorite = sorted.filter(
      ([roomName]) => roomName !== favoriteRoom
    )
    const favorite = sorted.filter(([roomName]) => roomName === favoriteRoom)

    return [...favorite, ...withoutFavorite]
  }, [selectedDevices, favoriteRoom])

  const { open: openSettings } = useSettings()

  const hiddenDeviceTypesCount = useMemo(
    () =>
      deviceTypes.filter((type) => !selectedDeviceTypes.includes(type)).length,
    [deviceTypes, selectedDeviceTypes]
  )

  const [filterExpanded, setFilterExpanded] = useState(false)
  useEffect(() => {
    const storedFilterExpanded = localStorage.getItem('filterExpanded')
    if (storedFilterExpanded) {
      setFilterExpanded(JSON.parse(storedFilterExpanded))
    }
  }, [])

  const devicesWithLowBattery = useLowBatteryDevices()
  const unavailableDevices = useUnavailableDevices()

  const devicesHealthText = useMemo(() => {
    const lowBatCount = devicesWithLowBattery.length
    const unavailableCount = unavailableDevices.length

    if (lowBatCount === 0 && unavailableCount === 0) {
      return 'All devices are up and running'
    }

    if (lowBatCount > 0 && unavailableCount === 0) {
      return `${lowBatCount} device${lowBatCount > 1 ? 's' : ''} ${
        lowBatCount > 1 ? 'have' : 'has'
      } low battery`
    }

    if (lowBatCount === 0 && unavailableCount > 0) {
      return `${unavailableCount} device${unavailableCount > 1 ? 's' : ''} ${
        unavailableCount > 1 ? 'are' : 'is'
      } unavailable`
    }

    return `${unavailableCount} device${
      unavailableCount > 1 ? 's' : ''
    } unavailable • ${lowBatCount} low on battery`
  }, [devicesWithLowBattery.length, unavailableDevices.length])

  const openedDevices = useOpenedDevices()

  const securityText = useMemo(() => {
    const openedCount = openedDevices.length

    if (openedCount === 0) {
      return 'No security issues'
    }

    return `${openedCount} security issue${openedCount > 1 ? 's' : ''}`
  }, [openedDevices.length])

  const { open } = useDeviceDetails()

  return (
    <>
      <Title variant="h1">
        <span>My home</span>
        <FilterIconButton
          onClick={() =>
            setFilterExpanded((prev) => {
              localStorage.setItem('filterExpanded', JSON.stringify(!prev))
              return !prev
            })
          }
        >
          <Badge
            variant="standard"
            badgeContent={hiddenDeviceTypesCount}
            color="error"
          >
            <Icon icon="tune" />
          </Badge>
        </FilterIconButton>
      </Title>

      <StyledExpandableChips
        expanded={filterExpanded}
        marginBottom={16}
        marginTop={24}
      >
        {deviceTypes.map(
          (type) =>
            !isHidden(type) && (
              <Chip
                key={type}
                icon={getIcon(type)}
                selected={selectedDeviceTypes.includes(type)}
                onClick={() => {
                  if (selectedDeviceTypes.includes(type)) {
                    setSelectedDeviceTypes((prev) => {
                      const newVal = prev.filter((t) => t !== type)
                      localStorage.setItem(
                        'selectedDeviceTypes',
                        JSON.stringify(newVal)
                      )
                      return newVal
                    })
                  } else {
                    setSelectedDeviceTypes((prev) => {
                      const newVal = [...prev, type]
                      localStorage.setItem(
                        'selectedDeviceTypes',
                        JSON.stringify(newVal)
                      )
                      return newVal
                    })
                  }
                }}
                onContextMenu={() => {
                  setSelectedDeviceTypes((prev) => {
                    const newVal =
                      prev.length === 1 && prev[0] === type
                        ? deviceTypes
                        : [type]
                    localStorage.setItem(
                      'selectedDeviceTypes',
                      JSON.stringify(newVal)
                    )
                    return newVal
                  })
                }}
              >
                {type}
              </Chip>
            )
        )}
      </StyledExpandableChips>

      <StatusContainer>
        <StyledExpandableStatus statusText={securityText} icon="security">
          {openedDevices.map(({ device, openedState }) => (
            <div key={device.id}>
              <MuiChip
                label={device.name || deviceDefinitions[device.type].fullName}
                size="small"
                icon={<Icon icon={deviceDefinitions[device.type].icon} />}
                onClick={() => open(device)}
              />
              <span>
                in <b>{device.roomName}</b> is{' '}
                {openedState === 1 ? 'tilted' : 'opened'}
              </span>
            </div>
          ))}
        </StyledExpandableStatus>

        <StyledExpandableStatus
          statusText={devicesHealthText}
          icon="monitor_heart"
        >
          {devicesWithLowBattery.map(({ device, battery }) => (
            <div key={device.id}>
              <MuiChip
                label={device.name || deviceDefinitions[device.type].fullName}
                size="small"
                icon={<Icon icon={deviceDefinitions[device.type].icon} />}
                onClick={() => open(device)}
              />
              <span>
                in <b>{device.roomName}</b> is low on battery ({battery}%)
              </span>
            </div>
          ))}
          {unavailableDevices.map(({ device }) => (
            <div key={device.id}>
              <MuiChip
                label={device.name || deviceDefinitions[device.type].fullName}
                size="small"
                icon={<Icon icon={deviceDefinitions[device.type].icon} />}
                onClick={() => open(device)}
              />
              <span>
                {' '}
                in <b>{device.roomName}</b> is unavailable
              </span>
            </div>
          ))}
        </StyledExpandableStatus>
      </StatusContainer>

      {/* @ts-ignore */}
      <AnimateSharedLayout>
        {groupedByRoom.map(([roomName, devices]) => (
          <Room
            key={roomName}
            transition={{
              layout: {
                duration: 0.15,
              },
            }}
            layout
          >
            <RoomTitle
              onContextMenu={() => {
                setFavoriteRoom(roomName)
                localStorage.setItem('favoriteRoom', roomName)
              }}
              variant="h2"
            >
              <a id={'#' + toKebabCase(roomName)}>{roomName}</a>
            </RoomTitle>
            <div className="shadow"></div>

            <StyledDeviceGrid>
              {devices.map(({ device, visible }) => (
                <DeviceCard device={device} key={device.id} visible={visible} />
              ))}
            </StyledDeviceGrid>
          </Room>
        ))}
      </AnimateSharedLayout>

      <LinksGrid
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
        <Link onClick={openSettings}>
          <Icon icon="settings" filled />
          <span>Settings</span>
        </Link>
      </LinksGrid>
    </>
  )
}

export default DevicesPage
