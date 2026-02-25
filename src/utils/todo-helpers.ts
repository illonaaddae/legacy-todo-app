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

// ============================================================
// ANALYTICS UTILS - Extracted from Legacy TodoAnalytics.tsx
// Fixing the anti-pattern of heavy in-component reduce loops
// ============================================================

export function getTagDistribution(todos: Todo[]) {
  return todos.reduce((acc, todo) => {
    todo.tags.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)
}

export function getPriorityDistribution(todos: Todo[]) {
  return todos.reduce((acc, todo) => {
    acc[todo.priority] = (acc[todo.priority] || 0) + 1
    return acc
  }, { low: 0, medium: 0, high: 0 })
}

export function getCompletionRateByTag(todos: Todo[], allTags: string[]) {
  return allTags.reduce((acc, tag) => {
    const tagTodos = todos.filter((todo) => todo.tags.includes(tag))
    const completed = tagTodos.filter((t) => t.completed).length
    acc[tag] = tagTodos.length > 0 ? Math.round((completed / tagTodos.length) * 100) : 0
    return acc
  }, {} as Record<string, number>)
}

export function sortAndFilterTodos(
  todos: Todo[],
  searchQuery: string,
  filterTag: string | null,
  sortBy: 'date' | 'priority'
) {
  // 1. Filter by search query
  let result = todos.filter((todo) =>
    todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 2. Filter by tag
  if (filterTag) {
    result = result.filter((todo) => todo.tags.includes(filterTag))
  }

  // 3. Sort
  return result.sort((a, b) => {
    if (sortBy === 'date') {
      return b.createdAt - a.createdAt
    }
    const priorityWeight = { high: 3, medium: 2, low: 1 }
    return priorityWeight[b.priority] - priorityWeight[a.priority]
  })
}
