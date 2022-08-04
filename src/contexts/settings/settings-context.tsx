import { Button, IconButton } from '@mui/material'
import { AnimatePresence } from 'framer-motion'
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import Icon from '../../components/icon'
import { RoomTitle } from '../../pages/devices/styles'
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
  const [opened, setOpened] = useState(false)

  const [vapidPublicKeyInput, setVapidPublicKeyInput] = useState('')
  const [vapidPublicKey, setVapidPublicKey] = useState('')
  const [pushSubscriptionDetails, setPushSubscriptionDetails] =
    useState<PushSubscriptionJSON | null>(null)

  const setVapidPublicKeyPersistently = useCallback(
    (vapidPublicKey: string) => {
      localStorage.setItem('vapidPublicKey', vapidPublicKey)
      setVapidPublicKey(vapidPublicKey)
    },
    [setVapidPublicKey]
  )

  useEffect(() => {
    const vapidPublicKey = localStorage.getItem('vapidPublicKey')
    if (vapidPublicKey) {
      setVapidPublicKey(vapidPublicKey)
    }
  }, [])

  useEffect(() => {
    setVapidPublicKeyInput(vapidPublicKey)
  }, [vapidPublicKey])

  const open = useCallback(() => {
    setOpened(true)
  }, [setOpened])

  const save = useCallback(() => {
    setVapidPublicKeyPersistently(vapidPublicKeyInput)
  }, [setVapidPublicKey])

  const copyDetails = useCallback(() => {
    navigator.clipboard.writeText(
      JSON.stringify(pushSubscriptionDetails, null, 2)
    )
  }, [pushSubscriptionDetails])

  useEffect(() => {
    if (!vapidPublicKey) {
      return
    }

    navigator.serviceWorker.getRegistration().then((registration) => {
      if (!registration) {
        return
      }

      registration.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidPublicKey,
        })
        .then((subscription) => {
          setPushSubscriptionDetails(subscription.toJSON())
        })
    })
  }, [vapidPublicKey])

  const hasChanged = useMemo(
    () => vapidPublicKey !== vapidPublicKeyInput,
    [vapidPublicKey, vapidPublicKeyInput]
  )

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
              <IconButton onClick={save} disabled={!hasChanged}>
                <Icon icon="save" filled />
              </IconButton>

              <IconButton onClick={() => setOpened(false)}>
                <Icon icon="close" />
              </IconButton>
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
