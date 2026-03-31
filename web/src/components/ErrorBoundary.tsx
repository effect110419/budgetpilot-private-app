import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }

type State = { error: Error | null }

/**
 * Ловит ошибки рендера дочернего дерева; не заменяет обработку ошибок сети/API.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div
          className="error-boundary"
          style={{
            padding: 'var(--space-6, 24px)',
            maxWidth: '36rem',
            margin: '0 auto',
            fontFamily: 'var(--font, system-ui, sans-serif)',
          }}
        >
          <h1 style={{ fontSize: '1.25rem', marginBottom: 12 }}>Something went wrong</h1>
          <p style={{ color: 'var(--text-secondary, #64748b)', marginBottom: 16 }}>
            {this.state.error.message}
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => this.setState({ error: null })}
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
