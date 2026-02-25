import { Suspense, lazy } from 'react'
import { useTheme } from '../context/ThemeContext'
import TodoForm from './TodoForm'
import SearchBox from './SearchBox'

// ============================================================
// CODE-SPLITTING: React.lazy loads TodoList, Stats, and Analytics
// as separate chunks. They are only fetched when the component
// tree needs them, reducing the initial bundle size.
// ============================================================
const TodoList = lazy(() => import('./TodoList'))
const Stats = lazy(() => import('./Stats'))
const TodoAnalytics = lazy(() => import('./TodoAnalytics'))

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
  const { theme, setTheme } = useTheme()

  return (
    <div className="app-wrapper">
      <div className="app-container">
        {/* Header */}
        <div className="app-header">
          <div className="header-top flex justify-between align-center">
            <h1 className="app-title">My Todo App</h1>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="theme-toggle"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
          <p className="app-subtitle">
            A legacy app built for refactoring practice
          </p>
        </div>

        {/* Form */}
        <TodoForm />

        {/* Search */}
        <SearchBox />

        {/* Stats & Analytics — lazy-loaded */}
        <Suspense fallback={<SectionLoader />}>
          <Stats />
          <TodoAnalytics />
        </Suspense>

        {/* Todo List — lazy-loaded */}
        <Suspense fallback={<SectionLoader />}>
          <TodoList />
        </Suspense>
      </div>
    </div>
  )
}
