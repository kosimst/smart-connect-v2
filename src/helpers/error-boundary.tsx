import styled from '@emotion/styled'
import { Alert, AlertTitle, IconButton } from '@mui/material'
import { Component, ReactNode } from 'react'
import Icon from '../components/icon'
import ApplicationError from './application-error'

type State = {
  error: ApplicationError | null
}

const ErrorContainer = styled.div`
  background-color: ${({ theme }) => theme.palette.background.default};
  position: absolute;
  inset: 0;
  padding: 16px;

  & > * {
    margin: auto;
    max-width: 600px;
  }
`

class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: any): State {
    if (!ApplicationError.isApplicationError(error)) {
      if (error instanceof Error) {
        error = new ApplicationError(error.message, 'fatal', error)
      } else {
        error = new ApplicationError(
          error?.message ?? 'Unknown error',
          'fatal',
          error
        )
      }
    }

    return {
      error,
    }
  }

  #promiseRejectionHandler = (e: PromiseRejectionEvent) => {
    e.preventDefault()

    let error = e.reason

    if (typeof error === 'string') {
      error = new Error(error)
    }

    if (!ApplicationError.isApplicationError(error)) {
      if (error instanceof Error) {
        error = new ApplicationError(error.message, 'fatal', error)
      } else {
        error = new ApplicationError(
          error?.message ?? 'Unknown promise rejection',
          'fatal',
          error
        )
      }
    }
    this.setState({ error })
  }

  componentDidMount() {
    window.addEventListener('unhandledrejection', this.#promiseRejectionHandler)
  }

  componentWillUnmount() {
    window.removeEventListener(
      'unhandledrejection',
      this.#promiseRejectionHandler
    )
  }

  render() {
    const { error } = this.state

    if (!error) {
      return this.props.children
    }

    return (
      <ErrorContainer>
        <Alert
          severity="error"
          action={
            <IconButton>
              <Icon icon="refresh" onClick={() => window.location.reload()} />
            </IconButton>
          }
        >
          <AlertTitle>Fatal error</AlertTitle>
          {error.message}
        </Alert>
      </ErrorContainer>
    )
  }
}

export default ErrorBoundary
