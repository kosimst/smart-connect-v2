import { Typography } from '@mui/material'
import { AnimatePresence } from 'framer-motion'
import { FC, ReactNode, useCallback, useMemo } from 'react'
import DeviceCardPure from '../../components/device-card/device-card.pure'
import DeviceGrid from '../../components/device-grid'
import deviceDefinitions from '../../constants/device-definitions'
import musicDetailsFromShare from '../../helpers/music-details-from-share'
import useQueryParams from '../../hooks/use-query-params'
import { Title } from '../../pages/devices/styles'
import Device from '../../types/device'
import useDeviceDetails from '../device-details'
import useIoBrokerDevices from '../iobroker-devices'
import { useIoBrokerStates } from '../iobroker-states/iobroker-states'
import { PageContainer, SectionHeading, SectionSubHeading } from './styles'

const ShareTarget: FC<{
  children?: ReactNode
}> = ({ children }) => {
  const { queryParams, setQueryParams } = useQueryParams()
  const { updateState } = useIoBrokerStates()
  const { open } = useDeviceDetails()
  const { devices } = useIoBrokerDevices()

  const isShareTarget = useMemo(
    () => queryParams.text !== undefined || queryParams.url !== undefined,
    [queryParams]
  )

  const musicDetails = useMemo(
    () =>
      (queryParams.text || queryParams.url) && queryParams.title
        ? musicDetailsFromShare(
            queryParams.text ?? '',
            queryParams.url ?? '',
            queryParams.title
          )
        : null,
    [queryParams]
  )

  const canHandleShare = !!musicDetails

  const musicServers = useMemo(
    () => devices.filter((device) => device.type === 'music-server'),
    [devices]
  )

  const onMusicServerClick = useCallback(
    (musicServer: Device) => () => {
      if (!musicDetails) {
        return
      }

      updateState(`${musicServer.id}.play-url`, musicDetails.url)

      setQueryParams({})

      open(musicServer)
    },
    [musicDetails, setQueryParams]
  )

  return (
    <>
      <AnimatePresence>
        {isShareTarget && (
          <PageContainer
            key="share-target"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.2 }}
          >
            <Title variant="h1">Smart Share</Title>

            {musicDetails && (
              <>
                <SectionHeading variant="h2">
                  Listen on MusicServer
                </SectionHeading>

                <SectionSubHeading variant="subtitle1">
                  Stream "{musicDetails.title}" from {musicDetails.player}
                </SectionSubHeading>

                {musicServers.length ? (
                  <DeviceGrid>
                    {musicServers.map((musicServer) => (
                      <DeviceCardPure
                        key={musicServer.id}
                        accentColor={
                          deviceDefinitions['music-server'].accentColor
                        }
                        icon={deviceDefinitions['music-server'].icon}
                        name={
                          musicServer.name ||
                          deviceDefinitions['music-server'].name
                        }
                        texts={[
                          {
                            id: 'room',
                            text: musicServer.roomName || 'Unknown Room',
                          },
                        ]}
                        onToggleChange={onMusicServerClick(musicServer)}
                        readyState="ready"
                      />
                    ))}
                  </DeviceGrid>
                ) : (
                  <Typography variant="body1">
                    No music servers found in your home
                  </Typography>
                )}
              </>
            )}

            {!canHandleShare && (
              <>
                <SectionHeading variant="h2">
                  Unsupported information
                </SectionHeading>

                <SectionSubHeading variant="subtitle1">
                  Share e.g. a YouTube video or a Spotify song
                </SectionSubHeading>
              </>
            )}
          </PageContainer>
        )}
      </AnimatePresence>
      {children}
    </>
  )
}

export default ShareTarget
