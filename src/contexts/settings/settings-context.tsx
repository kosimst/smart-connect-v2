import { Button } from '@mui/material'
import { AnimatePresence } from 'framer-motion'
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import Icon from '../../components/icon'
import { RoomTitle } from '../../pages/devices/styles'
import useIoBroker from '../iobroker-context'
import { Input } from '../iobroker-context/styles'
import { Container, Icons, PushDetails } from './styles'

const SettingsContext = createContext({
  open: (): void => {
    throw new Error('Not initialized yet')
  },
})

export const SettingsProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const { vapidPublicKey, setVapidPublicKey, pushSubscriptionDetails } =
    useIoBroker()

  const [opened, setOpened] = useState(false)

  const [vapidPublicKeyInput, setVapidPublicKeyInput] = useState('')

  useEffect(() => {
    setVapidPublicKeyInput(vapidPublicKey)
  }, [vapidPublicKey])

  const open = useCallback(() => {
    setOpened(true)
  }, [setOpened])

  const save = useCallback(() => {
    setVapidPublicKey(vapidPublicKeyInput)
  }, [setVapidPublicKey])

  const copyDetails = useCallback(() => {
    navigator.clipboard.writeText(
      JSON.stringify(pushSubscriptionDetails, null, 2)
    )
  }, [pushSubscriptionDetails])

  return (
    <SettingsContext.Provider
      value={{
        open,
      }}
    >
      <AnimatePresence>
        {opened && (
          <Container
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{
              duration: 0.2,
              type: 'keyframes',
              easings: 'easeOut',
            }}
          >
            <Icons>
              <Icon onClick={save} icon="save" filled />
              <Icon onClick={() => setOpened(false)} icon="close" />
            </Icons>

            <RoomTitle>Push notifications</RoomTitle>

            <Input
              value={vapidPublicKeyInput}
              onChange={(e) => setVapidPublicKeyInput(e.target.value)}
              placeholder="Public key string..."
              label="VAPID Public Key"
              fullWidth
              autoCapitalize="none"
              spellCheck={false}
              autoCorrect="off"
              autoComplete="off"
            />

            {pushSubscriptionDetails && (
              <PushDetails initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button variant="contained" onClick={copyDetails}>
                  Copy details
                </Button>
              </PushDetails>
            )}
          </Container>
        )}
      </AnimatePresence>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)

export default SettingsContext
