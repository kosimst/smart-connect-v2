import { Button, Card, CardContent, TextField, Typography } from '@mui/material'
import { FC, useCallback, useState } from 'react'
import useIoBrokerConnection from '../../contexts/iobroker-connection'
import withProps from '../../helpers/with-props'
import { Container, FormContainer, Title } from './styles'

const CustomTextField = withProps(TextField, {
  variant: 'outlined',
  fullWidth: true,
})

const ConnectPage: FC = () => {
  const { error, connect, connecting, credentials } = useIoBrokerConnection()

  console.log({ connecting, error })

  const [host, setHost] = useState(credentials?.host ?? '')
  const [cfAccessClientId, setCfAccessClientId] = useState(
    credentials?.cfAccessClientId ?? ''
  )
  const [cfAccessClientSecret, setCfAccessClientSecret] = useState(
    credentials?.cfAccessClientSecret ?? ''
  )

  const onSubmit = useCallback(() => {
    connect({
      host,
      cfAccessClientId,
      cfAccessClientSecret,
    })
  }, [connect, host, cfAccessClientId, cfAccessClientSecret])

  const onChangeCb = useCallback(
    (setter: (value: string) => void) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setter(event.target.value)
      },
    []
  )

  const canSubmit =
    host && cfAccessClientId && cfAccessClientSecret && !connecting

  return (
    <Container>
      <Title variant="h1">Hey there!</Title>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h2">Connect to ioBroker</Typography>

          <FormContainer>
            <CustomTextField
              label="Host"
              placeholder="example.com"
              value={host}
              onChange={onChangeCb(setHost)}
              error={!!error}
              helperText={error?.message}
            />
            <CustomTextField
              label="Cloudflare Access Client ID"
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.access"
              value={cfAccessClientId}
              onChange={onChangeCb(setCfAccessClientId)}
            />
            <CustomTextField
              label="Cloudflare Access Client Secret"
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={cfAccessClientSecret}
              onChange={onChangeCb(setCfAccessClientSecret)}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={onSubmit}
              disabled={!canSubmit}
            >
              {connecting ? 'Connecting...' : 'Connect'}
            </Button>
          </FormContainer>
        </CardContent>
      </Card>
    </Container>
  )
}

export default ConnectPage
