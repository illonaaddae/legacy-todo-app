import './index.css'
import { TodoProvider } from './context/TodoContext'
import TodoApp from './components/TodoApp'
import ErrorBoundary from './components/ErrorBoundary'

// REFACTORED: TodoProvider wraps the app so all children can
// access context without prop drilling.
function App() {
  return (
    <ErrorBoundary>
      <TodoProvider>
        <TodoApp />
      </TodoProvider>
    </ErrorBoundary>
  )
}

export default App
