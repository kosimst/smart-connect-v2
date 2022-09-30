import { Component, ReactNode } from 'react'
import ApplicationError from './application-error'

type State = {
  errors: ApplicationError[]
}

const isDev = process.env.NODE_ENV === 'development'

// error boundary react component
class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { errors: [] }

  static getDerivedStateFromError(error: any): State {
    if (!isDev) {
      location.reload()
    }

    console.error(error)

    if (!ApplicationError.isApplicationError(error)) {
      if (error instanceof Error) {
        error = new ApplicationError(error.message, 'fatal', error)
      } else {
        error = new ApplicationError(
          'Unhandled promise rejection',
          'fatal',
          error
        )
      }
    }

    return {
      // TODO: Include old errors
      errors: [error],
    }
  }

  #promiseRejectionHandler = (e: PromiseRejectionEvent) => {
    e.preventDefault()

    if (!isDev) {
      location.reload()
    }

    let error = e.reason

    console.error(error)

    if (!ApplicationError.isApplicationError(error)) {
      if (error instanceof Error) {
        error = new ApplicationError(error.message, 'fatal', error)
      } else {
        error = new ApplicationError(
          'Unhandled promise rejection',
          'fatal',
          error
        )
      }
    }
    this.setState({
      errors: [...this.state.errors, error],
    })
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
    const { errors } = this.state

    if (errors.some(({ severity }) => severity === 'fatal')) {
      if (!isDev) {
        return null
      }

      return (
        <>
          <h1>Something went wrong.</h1>
          <ul>
            {errors.map((error) => (
              <li key={error.timestamp.getTime()}>
                <b>{error.severity}: </b>
                <span>{error.message}</span>
              </li>
            ))}
          </ul>
        </>
      )
    }

    return (
      <>
        <div>
          {errors.map(({ message, timestamp }) => (
            <div key={timestamp.getTime()}>{message}</div>
          ))}
        </div>
        {this.props.children}
      </>
    )
  }
}

export default ErrorBoundary
