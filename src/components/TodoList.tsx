import { memo, useMemo } from 'react'
import { useTodoContext } from '../context/useTodoContext'
import TodoItem from './TodoItem'

// ============================================================
// VIRTUALIZED TodoList
// • react-window renders only the visible todo rows, keeping
//   DOM nodes minimal even with thousands of items.
// • Falls back to a plain list when item count is small (≤20)
//   so there's no unnecessary overhead for tiny datasets.
// ============================================================

import { List, useDynamicRowHeight, type RowComponentProps } from 'react-window'
import type { Todo } from '../types/todo'

function TodoRow({ ariaAttributes, index, style, todos }: RowComponentProps<{ todos: Todo[] }>) {
  return (
    <div {...ariaAttributes} style={style}>
      <TodoItem todo={todos[index]} />
    </div>
  )
}

const ITEM_HEIGHT = 72 // approximate px per row
const MAX_VISIBLE_ITEMS = 8 // show at most 8 rows before scrolling

function VirtualTodoList({ todos }: { todos: Todo[] }) {
  const orderKey = useMemo(() => todos.map((todo) => todo.id).join(','), [todos])
  const rowHeight = useDynamicRowHeight({ defaultRowHeight: ITEM_HEIGHT, key: orderKey })

  return (
    <List
      style={{ height: MAX_VISIBLE_ITEMS * ITEM_HEIGHT }}
      rowCount={todos.length}
      rowHeight={rowHeight}
      rowComponent={TodoRow}
      rowProps={{ todos }}
    />
  )
}

const TodoList = memo(function TodoList() {
  const { filteredTodos } = useTodoContext()

  const { incompleteTodos, completedTodos } = useMemo(
    () => ({
      incompleteTodos: filteredTodos.filter((todo) => !todo.completed),
      completedTodos: filteredTodos.filter((todo) => todo.completed),
    }),
    [filteredTodos]
  )

  if (filteredTodos.length === 0) {
    return (
      <div className="section-card">
        <div className="empty-state">
          <span>📋</span>
          <p>No todos yet. Add one to get started!</p>
        </div>
      </div>
    )
  }

  const useVirtualActive = incompleteTodos.length > 20
  const useVirtualCompleted = completedTodos.length > 20

  return (
    <div className="section-card">
      {/* Active Todos */}
      <div className="list-section">
        <h2 className="section-title">Active ({incompleteTodos.length})</h2>
        {incompleteTodos.length === 0 ? (
          <div className="empty-state">
            <span>🎉</span>
            <p>No active todos — well done!</p>
          </div>
        ) : useVirtualActive ? (
          <VirtualTodoList todos={incompleteTodos} />
        ) : (
          <div className="todo-list">
            {incompleteTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        )}
      </div>

      {/* Completed Todos */}
      {completedTodos.length > 0 && (
        <div className="list-section">
          <h2 className="section-title completed-title">
            Completed ({completedTodos.length})
          </h2>
          {useVirtualCompleted ? (
            <VirtualTodoList todos={completedTodos} />
          ) : (
            <div className="todo-list">
              {completedTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
})

export default TodoList
