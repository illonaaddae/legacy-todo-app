import { createContext, useContext, type ReactNode } from 'react'
import { useTodos } from '../hooks/useTodos'
import type { Todo } from '../types/todo'

// ============================================================
// REFACTORED: TodoContext
// Eliminates prop drilling — components anywhere in the tree
// can access todo state and stable handlers without props.
// ============================================================

interface TodoContextValue {
  todos: Todo[]
  searchQuery: string
  filteredTodos: Todo[]
  completedCount: number
  addTodo: (text: string, priority: 'low' | 'medium' | 'high') => void
  toggleTodo: (id: number) => void
  deleteTodo: (id: number) => void
  handleSearch: (query: string) => void
}

const TodoContext = createContext<TodoContextValue | null>(null)

export function TodoProvider({ children }: { children: ReactNode }) {
  const value = useTodos()
  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
}

// Convenience hook — throws a clear error if used outside the provider
export function useTodoContext(): TodoContextValue {
  const ctx = useContext(TodoContext)
  if (!ctx) throw new Error('useTodoContext must be used inside <TodoProvider>')
  return ctx
}
