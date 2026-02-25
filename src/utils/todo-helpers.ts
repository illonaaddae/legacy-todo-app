import type { Todo } from '../types/todo'

export interface TodoStats {
  total: number
  completed: number
  pending: number
  percentage: number
  high: number
  medium: number
  low: number
}

// Extracted for independent testability
export function calculateStats(todos: Todo[], searchQuery: string): TodoStats {
  const filtered = todos.filter((todo) =>
    todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  let completed = 0
  let high = 0
  let medium = 0
  let low = 0

  for (const todo of filtered) {
    if (todo.completed) completed++
    if (todo.priority === 'high') high++
    else if (todo.priority === 'medium') medium++
    else low++
  }

  const total = filtered.length
  const pending = total - completed
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return { total, completed, pending, percentage, high, medium, low }
}

export function generateTags(priority: 'low' | 'medium' | 'high'): string[] {
  switch (priority) {
    case 'high':
      return ['urgent']
    case 'medium':
      return ['normal']
    case 'low':
      return ['later']
  }
}
