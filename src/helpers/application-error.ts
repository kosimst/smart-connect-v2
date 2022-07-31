export type Severity = 'fatal' | 'error' | 'warning'

class ApplicationError extends Error {
  static isApplicationError(error: any): error is ApplicationError {
    return error instanceof ApplicationError
  }

  public readonly timestamp = new Date()

  constructor(
    public readonly message: string,
    public readonly severity: Severity,
    public readonly cause?: Error
  ) {
    super(message)
  }
}

export default ApplicationError
