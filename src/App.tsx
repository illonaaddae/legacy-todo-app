import './index.css'
import { TodoProvider } from './context/TodoContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import TodoApp from './components/TodoApp'
import ErrorBoundary from './components/ErrorBoundary'

// REFACTORED: Global Providers wrap the app so all children can
// access context without prop drilling.
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <TodoProvider>
            <TodoApp />
          </TodoProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
