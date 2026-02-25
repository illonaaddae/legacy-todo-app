import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red', background: '#fee2e2' }}>
          <h1>Oops! Something went wrong.</h1>
          <p><strong>{this.state.error && this.state.error.toString()}</strong></p>
          <pre style={{ overflowX: 'auto', background: '#fff', padding: '10px' }}>
            {this.state.errorInfo?.componentStack}
          </pre>
        </div>
      )
    }

    return this.props.children
  }
}
