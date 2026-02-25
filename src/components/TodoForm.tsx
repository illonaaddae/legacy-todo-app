import { memo, useState } from 'react'
import { useTodoContext } from '../context/TodoContext'

// ============================================================
// REFACTORED: TodoForm
// • Converted from class component → functional component
// • React.memo prevents re-renders unless addTodo ref changes
//   (it won't — it's wrapped in useCallback in useTodos)
// • Local state via useState (clean, hooks-based)
// ============================================================
const TodoForm = memo(function TodoForm() {
  const { addTodo } = useTodoContext()

  // FIXED: Local controlled state using hooks instead of class state
  const [inputValue, setInputValue] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputValue.trim()) {
      addTodo(inputValue.trim(), priority)
      setInputValue('')
      setPriority('medium')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
        className="form-select"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add a new todo..."
        className="form-input"
      />

      <button type="submit" className="add-btn">
        Add
      </button>
    </form>
  )
})

export default TodoForm
