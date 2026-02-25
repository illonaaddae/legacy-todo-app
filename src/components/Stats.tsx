import { memo, useMemo } from 'react'
import { useTodoContext } from '../context/TodoContext'
import { calculateStats } from '../utils/todo-helpers'

// ============================================================
// REFACTORED: Stats
// • React.memo: skips re-renders when context hasn't changed
// • Logic extracted to calculateStats utility for testability
// • Removed unused onToggle / onDelete props (prop design fix)
// ============================================================
const Stats = memo(function Stats() {
  const { todos, searchQuery } = useTodoContext()

  // FIXED: One useMemo caching all derived stats in a single array pass
  // Logic is now purely in /utils/todo-helpers.ts for independent unit testing
  const stats = useMemo(
    () => calculateStats(todos, searchQuery),
    [todos, searchQuery]
  )

  return (
    <div className="stats-card">
      <div className="stats-grid">
        <div className="stat-cell">
          <div className="stat-number stat-number--primary">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-cell">
          <div className="stat-number stat-number--green">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-cell">
          <div className="stat-number stat-number--orange">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-cell">
          <div className="stat-number stat-number--primary">{stats.percentage}%</div>
          <div className="stat-label">Progress</div>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">Overall Progress</span>
          <span className="progress-value">{stats.percentage}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${stats.percentage}%` }} />
        </div>
      </div>

      <div className="priority-grid">
        <div className="priority-cell">
          <div className="priority-count priority-count--high">{stats.high}</div>
          <div className="stat-label">High</div>
        </div>
        <div className="priority-cell">
          <div className="priority-count priority-count--medium">{stats.medium}</div>
          <div className="stat-label">Medium</div>
        </div>
        <div className="priority-cell">
          <div className="priority-count priority-count--low">{stats.low}</div>
          <div className="stat-label">Low</div>
        </div>
      </div>
    </div>
  )
})

export default Stats
