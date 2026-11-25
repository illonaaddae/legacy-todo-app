import { type ReactNode } from 'react'
import { useTodos } from '../hooks/useTodos'
import { TodoContext } from './useTodoContext'

export function TodoProvider({ children }: { children: ReactNode }) {
  const value = useTodos()
  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
}
