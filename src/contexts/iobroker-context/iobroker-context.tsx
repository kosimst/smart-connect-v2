import { Typography } from '@mui/material'
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Button, Container, Input, Title } from './styles'
import ioBrokerDb from '../../db/iobroker-db'
import { useLiveQuery } from 'dexie-react-hooks'

const ALIVE_STATE = 'system.adapter.admin.0.alive'

export const IoBrokerContext = createContext({
  fetchIoBroker: (path: string): Promise<any> =>
    Promise.reject(new Error('ioBroker not connected yet')),
  connected: false,
})

export const IoBrokerProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [
    { cfClientId, cfClientSecret, url } = {
      cfClientId: '',
      cfClientSecret: '',
      url: '',
    },
  ] = useLiveQuery(() => ioBrokerDb.credentials.limit(1).toArray(), [], [])

  const [connected, setConnected] = useState(false)
  const [ready, setReady] = useState(false)

  const heartbeat = useCallback(
    async (url: string, cfClientId: string, cfClientSecret: string) => {
      try {
        const response = await fetch(`https://${url}/get/${ALIVE_STATE}`, {
          headers: {
            'CF-Access-Client-Id': cfClientId,
            'CF-Access-Client-Secret': cfClientSecret,
          },
        })

        if (!response.ok) {
          throw new Error(response.statusText)
        }

        const data = await response.json()

        if (!data.val) {
          throw new Error('Not alive')
        }

        setConnected(true)
        setReady(true)
        return true
      } catch {
        setConnected(false)
        return false
      }
    },
    []
  )

  useEffect(() => {
    if (!url) {
      setConnected(false)
      return
    }

    heartbeat(url, cfClientId, cfClientSecret)

    const interval = setInterval(() => {
      heartbeat(url, cfClientId, cfClientSecret)
    }, 1000)

    return () => clearInterval(interval)
  }, [url, cfClientId, cfClientSecret])

  const fetchIoBroker = useCallback(
    async (path: string) => {
      if (!connected) {
        throw new Error('ioBroker not connected')
      }

      const response = await fetch(`https://${url}${path}`, {
        headers: {
          'CF-Access-Client-Id': cfClientId,
          'CF-Access-Client-Secret': cfClientSecret,
        },
      })

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`)
      }

      try {
        const data = await response.json()

        return data
      } catch (e: Error | any) {
        throw new Error(`Invalid JSON: ${e?.message || e}`)
      }
    },
    [connected, url]
  )

  const deleteAccess = useCallback(async () => {
    await ioBrokerDb.credentials.clear()
    setConnected(false)
  }, [])

  const setAccess = useCallback(
    async (newUrl: string, newCfClient: string, newCfSecret: string) => {
      await ioBrokerDb.credentials.clear()
      await ioBrokerDb.credentials.add({
        url: newUrl,
        cfClientId: newCfClient,
        cfClientSecret: newCfSecret,
      })
    },
    []
  )

  const [urlInput, setUrlInput] = useState('')
  const [cfIdInput, setCfIdInput] = useState('')
  const [cfSecretInput, setCfSecretInput] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(true)

  useEffect(() => {
    if (
      urlInput.length === 0 ||
      cfIdInput.length === 0 ||
      cfSecretInput.length === 0
    ) {
      setButtonDisabled(true)
    } else {
      setButtonDisabled(false)
    }
  }, [urlInput, cfIdInput, cfSecretInput])

  const submit = useCallback(async () => {
    setLoading(true)
    setError('')

    await setAccess(urlInput, cfIdInput, cfSecretInput)

    if (await heartbeat(urlInput, cfIdInput, cfSecretInput)) {
      setLoading(false)
      setError('')
    } else {
      await deleteAccess()
      setLoading(false)
      setError('Failed to connect')
    }
  }, [urlInput, cfIdInput, cfSecretInput])

  return url && !loading ? (
    ready ? (
      connected ? (
        <IoBrokerContext.Provider
          value={{
            fetchIoBroker,
            connected,
          }}
        >
          {children}
        </IoBrokerContext.Provider>
      ) : (
        <span>not connected</span>
      )
    ) : (
      <></>
    )
  ) : (
    <Container>
      <Title variant="h1">Hey there!</Title>

      <Input
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
        placeholder="your-domain.xyz"
        label="ioBroker Domain"
        fullWidth
        error={!!error}
        disabled={loading}
        helperText={error}
        InputProps={{
          startAdornment: 'https://',
        }}
      />

      <hr />

      <Input
        value={cfIdInput}
        onChange={(e) => setCfIdInput(e.target.value)}
        placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.access"
        label="CF-Access-Client-Id"
        fullWidth
        error={!!error}
        disabled={loading}
      />

      <Input
        value={cfSecretInput}
        onChange={(e) => setCfSecretInput(e.target.value)}
        placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        label="CF-Access-Client-Secret"
        fullWidth
        error={!!error}
        disabled={loading}
      />

      <Button
        variant="contained"
        fullWidth
        disabled={loading || buttonDisabled}
        disableElevation
        onClick={submit}
      >
        {loading ? 'Loading...' : 'Connect'}
      </Button>
    </Container>
  )
}

const useIoBroker = () => useContext(IoBrokerContext)

export default useIoBroker
