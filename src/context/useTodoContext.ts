import { createContext, useContext } from 'react'
import type { Todo } from '../types/todo'

interface TodoContextValue {
  todos: Todo[]
  searchQuery: string
  filterTag: string | null
  sortBy: 'date' | 'priority'
  filteredTodos: Todo[]
  completedCount: number
  addTodo: (text: string, priority: 'low' | 'medium' | 'high') => void
  toggleTodo: (id: number) => void
  deleteTodo: (id: number) => void
  handleSearch: (query: string) => void
  handleFilterTag: (tag: string | null) => void
  handleSortBy: (sort: 'date' | 'priority') => void
}

export const TodoContext = createContext<TodoContextValue | null>(null)

export function useTodoContext(): TodoContextValue {
  const ctx = useContext(TodoContext)
  if (!ctx) throw new Error('useTodoContext must be used inside <TodoProvider>')
  return ctx
}
