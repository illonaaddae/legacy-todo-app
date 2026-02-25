import { Suspense, lazy } from 'react'
import { useTodoContext } from '../context/TodoContext'
import TodoForm from './TodoForm'
import SearchBox from './SearchBox'

// ============================================================
// CODE-SPLITTING: React.lazy loads TodoList and Stats as
// separate chunks. They are only fetched when the component
// tree needs them, reducing the initial bundle size.
// ============================================================
const TodoList = lazy(() => import('./TodoList'))
const Stats = lazy(() => import('./Stats'))

// Loading fallback for Suspense boundaries
function SectionLoader() {
  return (
    <div className="section-card">
      <div className="empty-state">
        <div className="spinner" />
        <p>Loading…</p>
      </div>
    </div>
  )
}

export default function TodoApp() {
  const { completedCount, todos } = useTodoContext()

  return (
    <div className="app-wrapper">
      <div className="app-container">
        {/* Header */}
        <div className="app-header">
          <h1 className="app-title">📝 My Todo App</h1>
          <p className="app-subtitle">
            {completedCount} of {todos.length} tasks completed
          </p>
        </div>

        {/* Stats — lazy-loaded */}
        <Suspense fallback={<SectionLoader />}>
          <Stats />
        </Suspense>

        {/* Form */}
        <div className="section-card">
          <h2 className="section-title">Add New Task</h2>
          <TodoForm />
        </div>

        {/* Search */}
        <div className="section-card">
          <SearchBox />
        </div>

        {/* Todo List — lazy-loaded */}
        <Suspense fallback={<SectionLoader />}>
          <TodoList />
        </Suspense>
      </div>
    </div>
  )
}
