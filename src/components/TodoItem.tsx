import { memo, useCallback, useMemo } from 'react'
import DOMPurify from 'dompurify'
import { useTodoContext } from '../context/TodoContext'
import type { Todo } from '../types/todo'

interface TodoItemProps {
  todo: Todo
}

// ============================================================
// SECURED TodoItem
// • DOMPurify sanitizes user-supplied text before rendering,
//   preventing XSS attacks from malicious input.
// • useMemo caches the sanitized value so it only re-runs
//   when todo.text changes (not on every render).
// ============================================================
const TodoItem = memo(function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, deleteTodo } = useTodoContext()

  const handleToggle = useCallback(() => toggleTodo(todo.id), [toggleTodo, todo.id])
  const handleDelete = useCallback(() => deleteTodo(todo.id), [deleteTodo, todo.id])

  // SECURITY FIX: Sanitize user input to prevent XSS
  const sanitizedText = useMemo(() => DOMPurify.sanitize(todo.text), [todo.text])

  const priorityClass =
    todo.priority === 'high'
      ? 'priority-high'
      : todo.priority === 'medium'
      ? 'priority-medium'
      : 'priority-low'

  return (
    <div className={`todo-item ${todo.completed ? 'todo-item--completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        className="todo-checkbox"
      />

      <div className="todo-content">
        {/* Sanitized rendering — safe even if user enters <script> tags */}
        <span
          className={`todo-text ${todo.completed ? 'todo-text--done' : ''}`}
          dangerouslySetInnerHTML={{ __html: sanitizedText }}
        />

        <div className="todo-meta">
          <span className={`priority-badge ${priorityClass}`}>
            {todo.priority.toUpperCase()}
          </span>

          {todo.tags.map((tag) => (
            <span key={tag} className="tag-badge">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <button onClick={handleDelete} className="delete-btn">
        Delete
      </button>
    </div>
  )
})

export default TodoItem
