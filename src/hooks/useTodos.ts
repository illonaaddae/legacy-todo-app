import { useState, useCallback, useMemo } from 'react'
import type { Todo } from '../types/todo'
import { generateTags } from '../utils/todo-helpers'

// ============================================================
// REFACTORED: useTodos — custom hook
// Separates all state logic from the view layer, making each
// concern independently testable and reusable.
// ============================================================

const INITIAL_TODOS: Todo[] = [
  {
    id: 1,
    text: 'Review project requirements',
    completed: false,
    createdAt: Date.now() - 86400000,
    priority: 'high',
    tags: ['work', 'planning'],
  },
  {
    id: 2,
    text: 'Set up development environment',
    completed: true,
    createdAt: Date.now() - 43200000,
    priority: 'high',
    tags: ['setup', 'dev'],
  },
  {
    id: 3,
    text: 'Write unit tests',
    completed: false,
    createdAt: Date.now() - 21600000,
    priority: 'medium',
    tags: ['testing'],
  },
  {
    id: 4,
    text: 'Update documentation',
    completed: false,
    createdAt: Date.now() - 10800000,
    priority: 'low',
    tags: ['docs'],
  },
  {
    id: 5,
    text: 'Code review for PR #42',
    completed: false,
    createdAt: Date.now() - 3600000,
    priority: 'high',
    tags: ['work', 'review'],
  },
]

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(INITIAL_TODOS)
  const [searchQuery, setSearchQuery] = useState('')

  // FIXED: useCallback gives addTodo a stable reference.
  // Functional updater form (prev =>) avoids stale closure over `todos`.
  const addTodo = useCallback((text: string, priority: 'low' | 'medium' | 'high') => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: Date.now(),
      priority,
      tags: generateTags(priority),
    }
    setTodos((prev) => [...prev, newTodo])
  }, [])

  // FIXED: Stable reference via useCallback + functional updater
  const toggleTodo = useCallback((id: number) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    )
  }, [])

  // FIXED: Stable reference via useCallback + functional updater
  const deleteTodo = useCallback((id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }, [])

  // FIXED: Stable reference for the search handler
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  // FIXED: filteredTodos only recomputes when todos or searchQuery actually changes
  const filteredTodos = useMemo(
    () => todos.filter((todo) => todo.text.toLowerCase().includes(searchQuery.toLowerCase())),
    [todos, searchQuery]
  )

  // FIXED: completedCount only recomputes when todos changes
  const completedCount = useMemo(() => todos.filter((t) => t.completed).length, [todos])

  return {
    todos,
    searchQuery,
    filteredTodos,
    completedCount,
    addTodo,
    toggleTodo,
    deleteTodo,
    handleSearch,
  }
}
