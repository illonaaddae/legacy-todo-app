import { useState, useCallback, useMemo } from 'react'
import type { Todo } from '../types/todo'
import { generateTags, sortAndFilterTodos } from '../utils/todo-helpers'
import { useToast } from '../context/ToastContext'

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
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date')
  const { toast } = useToast()

  // FIXED: useCallback gives addTodo a stable reference.
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
    toast({
      title: 'Task added',
      description: `"${text}" has been added to your list.`,
      variant: 'success'
    })
  }, [toast])

  const toggleTodo = useCallback((id: number) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    )
  }, [])

  const deleteTodo = useCallback((id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
    toast({
      title: 'Task deleted',
      description: 'The task has been permanently removed.',
      variant: 'destructive'
    })
  }, [toast])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleFilterTag = useCallback((tag: string | null) => {
    setFilterTag(tag)
  }, [])

  const handleSortBy = useCallback((sort: 'date' | 'priority') => {
    setSortBy(sort)
  }, [])

  // FIXED: filteredTodos now uses the extracted helper and applies search/tag/sort
  const filteredTodos = useMemo(
    () => sortAndFilterTodos(todos, searchQuery, filterTag, sortBy),
    [todos, searchQuery, filterTag, sortBy]
  )

  const completedCount = useMemo(() => todos.filter((t) => t.completed).length, [todos])

  return {
    todos,
    searchQuery,
    filterTag,
    sortBy,
    filteredTodos,
    completedCount,
    addTodo,
    toggleTodo,
    deleteTodo,
    handleSearch,
    handleFilterTag,
    handleSortBy
  }
}

