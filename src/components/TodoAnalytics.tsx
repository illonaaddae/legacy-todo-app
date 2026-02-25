import { memo, useMemo } from 'react'
import { useTodoContext } from '../context/TodoContext'
import { getTagDistribution, getPriorityDistribution, getCompletionRateByTag } from '../utils/todo-helpers'

// ============================================================
// REFACTORED: TodoAnalytics
// • React.memo prevents re-rendering on unrelated app state changes
// • useMemo caches heavy array reductions (Tags, Priority, Completion)
// • Extracted complex logic to pure functions in todo-helpers.ts
// ============================================================

const TodoAnalytics = memo(function TodoAnalytics() {
  const { 
    todos, 
    handleSortBy, 
    handleFilterTag, 
    sortBy, 
    filterTag 
  } = useTodoContext()

  // FIXED: Memoize heavy dataset calculations so they don't block the main thread
  const allTags = useMemo(() => getTagDistribution(todos), [todos])
  const priorityDistribution = useMemo(() => getPriorityDistribution(todos), [todos])
  const completionByTag = useMemo(() => getCompletionRateByTag(todos, Object.keys(allTags)), [todos, allTags])

  // FIXED: Stable inline handlers using context
  return (
    <div className="analytics-card">
      <div className="analytics-section">
        <h3>Priority Distribution</h3>
        <div className="analytics-grid">
          {Object.entries(priorityDistribution).map(([priority, count]) => (
            <div key={priority} className="analytics-stat-box">
              <div className="stat-number">{count}</div>
              <div className="stat-label capitalize">{priority}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="analytics-section">
        <h3>Sort Options</h3>
        <div className="analytics-flex">
          <button
            onClick={() => handleSortBy("date")}
            className={`btn-filter ${sortBy === "date" ? "active" : ""}`}
          >
            Sort by Date
          </button>
          <button
            onClick={() => handleSortBy("priority")}
            className={`btn-filter ${sortBy === "priority" ? "active" : ""}`}
          >
            Sort by Priority
          </button>
        </div>
      </div>

      <div className="analytics-section">
        <h3>Filter by Tags</h3>
        <div className="analytics-flex">
          <button
            onClick={() => handleFilterTag(null)}
            className={`btn-tag ${filterTag === null ? "active" : ""}`}
          >
            All
          </button>
          {Object.entries(allTags).map(([tag, count]) => (
            <button
              key={tag}
              onClick={() => handleFilterTag(tag)}
              className={`btn-tag ${filterTag === tag ? "active" : ""}`}
            >
              {tag} ({count})
            </button>
          ))}
        </div>
      </div>

      <div className="analytics-section">
        <h3>Completion Rate by Tag</h3>
        <div className="analytics-progress-container">
          {Object.entries(completionByTag).map(([tag, percentage]) => (
            <div key={tag} className="progress-row">
              <span className="progress-label">{tag}</span>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="progress-value">{percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

export default TodoAnalytics
