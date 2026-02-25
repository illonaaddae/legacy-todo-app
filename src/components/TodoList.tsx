import { memo, useMemo, useCallback } from 'react'
import { useTodoContext } from '../context/TodoContext'
import TodoItem from './TodoItem'

// ============================================================
// VIRTUALIZED TodoList
// • react-window renders only the visible todo rows, keeping
//   DOM nodes minimal even with thousands of items.
// • Falls back to a plain list when item count is small (≤20)
//   so there's no unnecessary overhead for tiny datasets.
// ============================================================

// Lazily import react-window to support virtualization
// Vite pre-bundling sometimes fails to parse named exports from react-window
import * as ReactWindow from 'react-window'
// @ts-expect-error react-window types can conflict here
const FixedSizeList = ReactWindow.FixedSizeList || (ReactWindow as any).default?.FixedSizeList

const ITEM_HEIGHT = 72 // approximate px per row
const MAX_VISIBLE_ITEMS = 8 // show at most 8 rows before scrolling

const TodoList = memo(function TodoList() {
  const { filteredTodos } = useTodoContext()

  const { incompleteTodos, completedTodos } = useMemo(
    () => ({
      incompleteTodos: filteredTodos.filter((todo) => !todo.completed),
      completedTodos: filteredTodos.filter((todo) => todo.completed),
    }),
    [filteredTodos]
  )

  // react-window row renderer for active todos
  const ActiveRow = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => (
      <div style={style}>
        <TodoItem todo={incompleteTodos[index]} />
      </div>
    ),
    [incompleteTodos]
  )

  // react-window row renderer for completed todos
  const CompletedRow = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => (
      <div style={style}>
        <TodoItem todo={completedTodos[index]} />
      </div>
    ),
    [completedTodos]
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
          <FixedSizeList
            height={Math.min(incompleteTodos.length, MAX_VISIBLE_ITEMS) * ITEM_HEIGHT}
            itemCount={incompleteTodos.length}
            itemSize={ITEM_HEIGHT}
            width="100%"
          >
            {ActiveRow}
          </FixedSizeList>
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
            <FixedSizeList
              height={Math.min(completedTodos.length, MAX_VISIBLE_ITEMS) * ITEM_HEIGHT}
              itemCount={completedTodos.length}
              itemSize={ITEM_HEIGHT}
              width="100%"
            >
              {CompletedRow}
            </FixedSizeList>
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
