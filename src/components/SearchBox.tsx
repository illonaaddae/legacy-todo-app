import { memo } from 'react'
import { useTodoContext } from '../context/TodoContext'

// ============================================================
// REFACTORED: SearchBox
// • React.memo: won't re-render unless searchQuery changes
// • handleSearch from context has a stable ref (useCallback),
//   so memo actually prevents skipped renders correctly
// ============================================================
const SearchBox = memo(function SearchBox() {
  const { searchQuery, handleSearch } = useTodoContext()

  return (
    <div className="search-box">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search todos..."
        className="search-input"
      />
      {searchQuery && (
        <button className="search-clear" onClick={() => handleSearch('')}>
          ✕
        </button>
      )}
    </div>
  )
})

export default SearchBox
