import { TextField, Typography } from '@mui/material'
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Button, Container, Input, Row, Subtitle, Title } from './styles'

export const IoBrokerUrlContext = createContext({
  url: '',
  cfClient: '',
  cfSecret: '',
})

export const IoBrokerUrlProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [url, setUrlState] = useState('')
  const [cfClient, setCfClient] = useState('')
  const [cfSecret, setCfSecret] = useState('')

  const setAccess = useCallback(
    (newUrl: string, newCfClient: string, newCfSecret: string) => {
      setUrlState(newUrl)
      setCfClient(newCfClient)
      setCfSecret(newCfSecret)
      localStorage.setItem('iobroker-url', newUrl)
      localStorage.setItem('iobroker-cf-client', newCfClient)
      localStorage.setItem('iobroker-cf-secret', newCfSecret)
    },
    []
  )

  useEffect(() => {
    const savedUrl = localStorage.getItem('iobroker-url')
    const savedCfClient = localStorage.getItem('iobroker-cf-client')
    const savedCfSecret = localStorage.getItem('iobroker-cf-secret')

    if (!savedUrl || !savedCfClient || !savedCfSecret) {
      return
    }

    setUrlState(savedUrl)
    setCfClient(savedCfClient)
    setCfSecret(savedCfSecret)
  }, [])

  const [urlInput, setUrlInput] = useState('iobroker-steindl.ml')
  const [cfIdInput, setCfIdInput] = useState(
    '7ea8d4b680d2a37bd00df5fc6063c009.access'
  )
  const [cfSecretInput, setCfSecretInput] = useState(
    'a3bdff4f95c7ee6ad93f085fc77d83b92b8a50f4b4832960bd5ea15532901289'
  )

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

    /*try {
      const response = await fetch(`https://${urlInput}/lib/js/socket.io.js`, {
        headers: {
          'CF-Access-Client-Id': cfIdInput,
          'CF-Access-Client-Secret': cfSecretInput,
        },
      })

      console.log(response.ok, await response.text())
    } catch (e: any) {
      setError('Failed to connect')

      console.error(e)

      setLoading(false)
    }*/

    setAccess(urlInput, cfIdInput, cfSecretInput)
  }, [urlInput])

  return url ? (
    <IoBrokerUrlContext.Provider
      value={{
        url,
        cfClient,
        cfSecret,
      }}
    >
      {children}
    </IoBrokerUrlContext.Provider>
  ) : (
    <Container>
      <Typography variant="h1">Hey there!</Typography>

      <Input
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
        placeholder="your-domain.xyz"
        label="ioBroker Domain"
        fullWidth
        error={!!error}
        disabled={loading}
        helperText={error}
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

const useIoBrokerUrl = () => useContext(IoBrokerUrlContext)

export default useIoBrokerUrl
