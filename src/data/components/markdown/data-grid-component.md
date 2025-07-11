---
title: DataGrid Component - Senior UI Developer Interview
description: A high-performance, feature-rich DataGrid component designed to handle large datasets with virtual scrolling, sorting, filtering, and inline editing capabilities.
---


# DataGrid Component - Senior UI Developer Interview


## Component Overview

A high-performance, feature-rich DataGrid component designed to handle large datasets with virtual scrolling, sorting, filtering, and inline editing capabilities.

## Architecture & API Design

### Core Interface

```typescript
interface DataGridProps<T = any> {
  // Data & Configuration
  data: T[]
  columns: ColumnDefinition<T>[]
  rowKey: keyof T | ((row: T) => string)
  
  // Virtualization
  height: number
  rowHeight?: number | ((row: T) => number)
  overscan?: number
  
  // Features
  sortable?: boolean
  filterable?: boolean
  selectable?: boolean | 'single' | 'multiple'
  editable?: boolean
  resizable?: boolean
  
  // Pagination
  pagination?: PaginationConfig
  
  // Performance
  virtualized?: boolean
  lazy?: boolean
  
  // Events
  onSort?: (sort: SortConfig[]) => void
  onFilter?: (filters: FilterConfig[]) => void
  onSelectionChange?: (selectedRows: T[]) => void
  onRowEdit?: (row: T, changes: Partial<T>) => void
  onExport?: (format: 'csv' | 'xlsx') => void
  
  // Styling
  className?: string
  rowClassName?: string | ((row: T) => string)
  loading?: boolean
  loadingComponent?: React.ComponentType
}

interface ColumnDefinition<T> {
  key: keyof T
  title: string
  width?: number
  minWidth?: number
  maxWidth?: number
  sortable?: boolean
  filterable?: boolean
  editable?: boolean
  resizable?: boolean
  render?: (value: any, row: T, index: number) => React.ReactNode
  sorter?: (a: T, b: T) => number
  filter?: FilterDefinition
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
  hidden?: boolean
}
```

### Virtual Scrolling Implementation

```typescript
class VirtualScrollManager {
  private containerHeight: number
  private rowHeight: number
  private totalRows: number
  private overscan: number
  
  constructor(config: VirtualScrollConfig) {
    this.containerHeight = config.height
    this.rowHeight = config.rowHeight
    this.totalRows = config.totalRows
    this.overscan = config.overscan || 5
  }
  
  getVisibleRange(scrollTop: number): [number, number] {
    const startIndex = Math.floor(scrollTop / this.rowHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(this.containerHeight / this.rowHeight),
      this.totalRows - 1
    )
    
    return [
      Math.max(0, startIndex - this.overscan),
      Math.min(this.totalRows - 1, endIndex + this.overscan)
    ]
  }
  
  getScrollHeight(): number {
    return this.totalRows * this.rowHeight
  }
  
  getItemOffset(index: number): number {
    return index * this.rowHeight
  }
}
```

### Core Component Implementation

```typescript
const DataGrid = <T extends Record<string, any>>({
  data,
  columns,
  rowKey,
  height,
  rowHeight = 48,
  virtualized = true,
  sortable = true,
  filterable = true,
  selectable = false,
  ...props
}: DataGridProps<T>) => {
  // State management
  const [sortConfig, setSortConfig] = useState<SortConfig[]>([])
  const [filterConfig, setFilterConfig] = useState<FilterConfig[]>([])
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [editingCell, setEditingCell] = useState<{row: number, col: string} | null>(null)
  
  // Virtual scrolling setup
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  
  const virtualManager = useMemo(
    () => new VirtualScrollManager({
      height,
      rowHeight,
      totalRows: data.length,
      overscan: 5
    }),
    [height, rowHeight, data.length]
  )
  
  // Get visible data slice for virtual scrolling
  const [startIndex, endIndex] = virtualManager.getVisibleRange(scrollTop)
  const visibleData = useMemo(
    () => data.slice(startIndex, endIndex + 1),
    [data, startIndex, endIndex]
  )
  
  // Column management with resizing
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})
  
  const handleColumnResize = useCallback((columnKey: string, width: number) => {
    setColumnWidths(prev => ({ ...prev, [columnKey]: width }))
  }, [])
  
  // Sorting logic
  const sortedData = useMemo(() => {
    if (sortConfig.length === 0) return data
    
    return [...data].sort((a, b) => {
      for (const sort of sortConfig) {
        const column = columns.find(col => col.key === sort.key)
        if (column?.sorter) {
          const result = column.sorter(a, b)
          if (result !== 0) return sort.direction === 'desc' ? -result : result
        } else {
          const aVal = a[sort.key]
          const bVal = b[sort.key]
          if (aVal < bVal) return sort.direction === 'desc' ? 1 : -1
          if (aVal > bVal) return sort.direction === 'desc' ? -1 : 1
        }
      }
      return 0
    })
  }, [data, sortConfig, columns])
  
  // Render methods
  const renderHeader = () => (
    <div className="datagrid-header" role="row">
      {columns.map(column => (
        <HeaderCell
          key={String(column.key)}
          column={column}
          sortConfig={sortConfig}
          onSort={handleSort}
          onResize={handleColumnResize}
          width={columnWidths[String(column.key)] || column.width}
        />
      ))}
    </div>
  )
  
  const renderVirtualizedRows = () => {
    const totalHeight = virtualManager.getScrollHeight()
    const offsetY = virtualManager.getItemOffset(startIndex)
    
    return (
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div 
          style={{ 
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleData.map((row, index) => (
            <DataRow
              key={getRowKey(row, startIndex + index)}
              row={row}
              columns={columns}
              index={startIndex + index}
              selected={selectedRows.has(getRowKey(row, startIndex + index))}
              editing={editingCell}
              onSelect={handleRowSelection}
              onEdit={handleCellEdit}
            />
          ))}
        </div>
      </div>
    )
  }
  
  return (
    <div className="datagrid-container" style={{ height }}>
      {renderHeader()}
      <div
        ref={scrollRef}
        className="datagrid-body"
        style={{ height: height - HEADER_HEIGHT, overflow: 'auto' }}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      >
        {virtualized ? renderVirtualizedRows() : renderAllRows()}
      </div>
    </div>
  )
}
```

### Performance Optimizations

```typescript
// Memoized row component
const DataRow = React.memo<DataRowProps>(({ row, columns, ...props }) => {
  return (
    <div className="datagrid-row" role="row">
      {columns.map(column => (
        <DataCell
          key={String(column.key)}
          column={column}
          row={row}
          {...props}
        />
      ))}
    </div>
  )
})

// Debounced filter/search
const useDebouncedFilter = (filterValue: string, delay: number = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(filterValue)
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(filterValue), delay)
    return () => clearTimeout(timer)
  }, [filterValue, delay])
  
  return debouncedValue
}

// Intersection Observer for lazy loading
const useLazyLoading = (hasNextPage: boolean, loadMore: () => void) => {
  const observerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage) {
          loadMore()
        }
      },
      { threshold: 1.0 }
    )
    
    if (observerRef.current) {
      observer.observe(observerRef.current)
    }
    
    return () => observer.disconnect()
  }, [hasNextPage, loadMore])
  
  return observerRef
}
```

## 10 Important Interview Questions & Answers

### 1. Q: How would you optimize virtual scrolling for variable row heights?

**A:** For variable row heights, I'd implement a dynamic height calculation system:

```typescript
class VariableHeightVirtualizer {
  private itemHeights: Map<number, number> = new Map()
  private estimatedHeight: number = 50
  private measuredIndices: Set<number> = new Set()
  
  measureItem(index: number, height: number) {
    this.itemHeights.set(index, height)
    this.measuredIndices.add(index)
  }
  
  getItemOffset(index: number): number {
    let offset = 0
    for (let i = 0; i < index; i++) {
      offset += this.itemHeights.get(i) || this.estimatedHeight
    }
    return offset
  }
  
  // Use ResizeObserver to measure actual heights
  useMeasurement(ref: RefObject<HTMLElement>, index: number) {
    useEffect(() => {
      if (!ref.current) return
      
      const observer = new ResizeObserver(([entry]) => {
        this.measureItem(index, entry.contentRect.height)
      })
      
      observer.observe(ref.current)
      return () => observer.disconnect()
    }, [index])
  }
}
```

Key optimizations:
- Cache measured heights
- Use estimated heights for unmeasured items
- Implement binary search for finding visible range
- Update scroll position when heights change

### 2. Q: How would you handle sorting and filtering with 1M+ rows efficiently?

**A:** For large datasets, I'd implement server-side processing with optimistic updates:

```typescript
const useDataGridData = (config: DataConfig) => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  
  // Debounced API calls
  const debouncedFetch = useMemo(
    () => debounce(async (params: QueryParams) => {
      setLoading(true)
      try {
        const response = await api.fetchData(params)
        setData(response.data)
        setTotalCount(response.total)
      } finally {
        setLoading(false)
      }
    }, 300),
    []
  )
  
  // Optimistic updates for better UX
  const optimisticSort = (newSort: SortConfig) => {
    // Apply sort immediately on current data
    const sorted = applySortLocally(data, newSort)
    setData(sorted)
    
    // Then fetch from server
    debouncedFetch({ ...currentParams, sort: newSort })
  }
  
  return { data, loading, totalCount, optimisticSort }
}
```

### 3. Q: How would you implement efficient column resizing?

**A:** I'd use a combination of CSS variables and event handling:

```typescript
const useColumnResize = () => {
  const [isResizing, setIsResizing] = useState<string | null>(null)
  const [columns, setColumns] = useState<ColumnState[]>(initialColumns)
  
  const handleMouseDown = (columnKey: string, event: MouseEvent) => {
    setIsResizing(columnKey)
    const startX = event.clientX
    const startWidth = getColumnWidth(columnKey)
    
    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX
      const newWidth = Math.max(MIN_WIDTH, startWidth + diff)
      
      // Update CSS custom property for immediate visual feedback
      document.documentElement.style.setProperty(
        `--column-${columnKey}-width`, 
        `${newWidth}px`
      )
    }
    
    const handleMouseUp = () => {
      setIsResizing(null)
      const finalWidth = getCurrentColumnWidth(columnKey)
      updateColumnWidth(columnKey, finalWidth)
      
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }
  
  return { columns, handleMouseDown, isResizing }
}
```

### 4. Q: How would you implement row selection with shift-click for range selection?

**A:** I'd track selection state and implement range logic:

```typescript
const useRowSelection = (data: any[], getRowKey: (row: any) => string) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number>(-1)
  
  const handleRowSelection = (
    row: any, 
    index: number, 
    event: MouseEvent
  ) => {
    const rowKey = getRowKey(row)
    
    if (event.shiftKey && lastSelectedIndex !== -1) {
      // Range selection
      const start = Math.min(lastSelectedIndex, index)
      const end = Math.max(lastSelectedIndex, index)
      
      setSelectedRows(prev => {
        const newSelection = new Set(prev)
        for (let i = start; i <= end; i++) {
          if (data[i]) {
            newSelection.add(getRowKey(data[i]))
          }
        }
        return newSelection
      })
    } else if (event.ctrlKey || event.metaKey) {
      // Multi-select
      setSelectedRows(prev => {
        const newSelection = new Set(prev)
        if (newSelection.has(rowKey)) {
          newSelection.delete(rowKey)
        } else {
          newSelection.add(rowKey)
        }
        return newSelection
      })
    } else {
      // Single select
      setSelectedRows(new Set([rowKey]))
    }
    
    setLastSelectedIndex(index)
  }
  
  return { selectedRows, handleRowSelection }
}
```

### 5. Q: How would you implement inline editing with validation?

**A:** I'd create a cell editing system with validation:

```typescript
const useInlineEditing = () => {
  const [editingCell, setEditingCell] = useState<CellPosition | null>(null)
  const [editValue, setEditValue] = useState<any>(null)
  const [validationErrors, setValidationErrors] = useState<Map<string, string>>(new Map())
  
  const startEdit = (rowIndex: number, columnKey: string, currentValue: any) => {
    setEditingCell({ rowIndex, columnKey })
    setEditValue(currentValue)
  }
  
  const commitEdit = async (row: any, column: ColumnDefinition) => {
    if (!editingCell) return
    
    // Validate
    const validator = column.validator
    if (validator) {
      const error = await validator(editValue, row)
      if (error) {
        setValidationErrors(prev => new Map(prev).set(
          `${editingCell.rowIndex}-${editingCell.columnKey}`, 
          error
        ))
        return
      }
    }
    
    // Clear errors and commit
    setValidationErrors(prev => {
      const newErrors = new Map(prev)
      newErrors.delete(`${editingCell.rowIndex}-${editingCell.columnKey}`)
      return newErrors
    })
    
    onRowEdit?.(row, { [column.key]: editValue })
    cancelEdit()
  }
  
  const cancelEdit = () => {
    setEditingCell(null)
    setEditValue(null)
  }
  
  return {
    editingCell,
    editValue,
    validationErrors,
    startEdit,
    commitEdit,
    cancelEdit,
    setEditValue
  }
}
```

### 6. Q: How would you handle responsive design for the DataGrid?

**A:** I'd implement adaptive column behavior and responsive breakpoints:

```typescript
const useResponsiveColumns = (columns: ColumnDefinition[], containerWidth: number) => {
  const [visibleColumns, setVisibleColumns] = useState(columns)
  const [hiddenColumns, setHiddenColumns] = useState<ColumnDefinition[]>([])
  
  useEffect(() => {
    const breakpoints = {
      mobile: 768,
      tablet: 1024,
      desktop: 1200
    }
    
    let availableColumns = [...columns]
    
    if (containerWidth < breakpoints.mobile) {
      // Mobile: Show only essential columns
      availableColumns = columns.filter(col => col.priority === 'high')
    } else if (containerWidth < breakpoints.tablet) {
      // Tablet: Show high and medium priority
      availableColumns = columns.filter(col => 
        col.priority === 'high' || col.priority === 'medium'
      )
    }
    
    // Calculate if all columns fit
    const totalWidth = availableColumns.reduce((sum, col) => sum + (col.width || 150), 0)
    
    if (totalWidth > containerWidth) {
      // Progressively hide columns starting from lowest priority
      const sorted = [...availableColumns].sort((a, b) => 
        getPriorityValue(a.priority) - getPriorityValue(b.priority)
      )
      
      let currentWidth = 0
      const visible = []
      
      for (const col of sorted) {
        if (currentWidth + (col.width || 150) <= containerWidth - 100) { // Reserve space for actions
          visible.push(col)
          currentWidth += col.width || 150
        }
      }
      
      setVisibleColumns(visible)
      setHiddenColumns(sorted.filter(col => !visible.includes(col)))
    } else {
      setVisibleColumns(availableColumns)
      setHiddenColumns([])
    }
  }, [columns, containerWidth])
  
  return { visibleColumns, hiddenColumns }
}
```

### 7. Q: How would you implement efficient data export for large datasets?

**A:** I'd use streaming and Web Workers for large exports:

```typescript
const useDataExport = () => {
  const [exportProgress, setExportProgress] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  
  const exportData = async (
    data: any[], 
    format: 'csv' | 'xlsx',
    options: ExportOptions
  ) => {
    setIsExporting(true)
    setExportProgress(0)
    
    try {
      if (data.length > 10000) {
        // Use Web Worker for large datasets
        return await exportWithWorker(data, format, options)
      } else {
        // Direct export for smaller datasets
        return await exportDirect(data, format, options)
      }
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }
  
  const exportWithWorker = (data: any[], format: string, options: ExportOptions) => {
    return new Promise((resolve, reject) => {
      const worker = new Worker('/workers/export-worker.js')
      
      worker.postMessage({ data, format, options })
      
      worker.onmessage = (e) => {
        const { type, payload } = e.data
        
        switch (type) {
          case 'progress':
            setExportProgress(payload.progress)
            break
          case 'complete':
            downloadFile(payload.blob, payload.filename)
            resolve(payload)
            break
          case 'error':
            reject(new Error(payload.message))
            break
        }
      }
      
      worker.onerror = reject
    })
  }
  
  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  return { exportData, exportProgress, isExporting }
}
```

### 8. Q: How would you implement keyboard navigation and accessibility?

**A:** I'd implement full ARIA support with keyboard navigation:

```typescript
const useKeyboardNavigation = (gridRef: RefObject<HTMLElement>) => {
  const [focusedCell, setFocusedCell] = useState<CellPosition>({ row: 0, col: 0 })
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, ctrlKey, shiftKey } = event
      
      switch (key) {
        case 'ArrowUp':
          event.preventDefault()
          moveFocus(-1, 0, shiftKey)
          break
        case 'ArrowDown':
          event.preventDefault()
          moveFocus(1, 0, shiftKey)
          break
        case 'ArrowLeft':
          event.preventDefault()
          moveFocus(0, -1, shiftKey)
          break
        case 'ArrowRight':
          event.preventDefault()
          moveFocus(0, 1, shiftKey)
          break
        case 'Enter':
        case 'F2':
          event.preventDefault()
          startEdit(focusedCell.row, focusedCell.col)
          break
        case 'Escape':
          event.preventDefault()
          cancelEdit()
          break
        case 'Tab':
          event.preventDefault()
          handleTabNavigation(shiftKey)
          break
      }
    }
    
    const element = gridRef.current
    if (element) {
      element.addEventListener('keydown', handleKeyDown)
      return () => element.removeEventListener('keydown', handleKeyDown)
    }
  }, [focusedCell])
  
  // ARIA attributes
  const getGridProps = () => ({
    role: 'grid',
    'aria-rowcount': data.length + 1, // +1 for header
    'aria-colcount': columns.length,
    tabIndex: 0
  })
  
  const getCellProps = (rowIndex: number, colIndex: number) => ({
    role: 'gridcell',
    'aria-rowindex': rowIndex + 2, // +2 because ARIA is 1-indexed and includes header
    'aria-colindex': colIndex + 1,
    'aria-selected': isSelected(rowIndex, colIndex),
    tabIndex: focusedCell.row === rowIndex && focusedCell.col === colIndex ? 0 : -1
  })
  
  return { focusedCell, getGridProps, getCellProps }
}
```

### 9. Q: How would you handle memory management for large datasets?

**A:** I'd implement several memory optimization strategies:

```typescript
const useMemoryOptimization = () => {
  // 1. Row recycling pool
  const rowPool = useRef<HTMLElement[]>([])
  const activeRows = useRef<Map<number, HTMLElement>>(new Map())
  
  const getRow = (index: number): HTMLElement => {
    if (activeRows.current.has(index)) {
      return activeRows.current.get(index)!
    }
    
    let row = rowPool.current.pop()
    if (!row) {
      row = document.createElement('div')
      row.className = 'datagrid-row'
    }
    
    activeRows.current.set(index, row)
    return row
  }
  
  const recycleRow = (index: number) => {
    const row = activeRows.current.get(index)
    if (row) {
      activeRows.current.delete(index)
      rowPool.current.push(row)
    }
  }
  
  // 2. Data chunking for progressive loading
  const useDataChunks = (data: any[], chunkSize: number = 1000) => {
    const [loadedChunks, setLoadedChunks] = useState<Set<number>>(new Set([0]))
    
    const loadChunk = useCallback((chunkIndex: number) => {
      setLoadedChunks(prev => new Set(prev).add(chunkIndex))
    }, [])
    
    const getVisibleData = useCallback((startIndex: number, endIndex: number) => {
      const startChunk = Math.floor(startIndex / chunkSize)
      const endChunk = Math.floor(endIndex / chunkSize)
      
      // Load missing chunks
      for (let i = startChunk; i <= endChunk; i++) {
        if (!loadedChunks.has(i)) {
          loadChunk(i)
        }
      }
      
      return data.slice(startIndex, endIndex + 1)
    }, [data, chunkSize, loadedChunks])
    
    return { getVisibleData, loadedChunks }
  }
  
  // 3. WeakMap for metadata to prevent memory leaks
  const rowMetadata = useRef(new WeakMap())
  
  const setRowMetadata = (row: any, metadata: any) => {
    rowMetadata.current.set(row, metadata)
  }
  
  const getRowMetadata = (row: any) => {
    return rowMetadata.current.get(row)
  }
  
  return {
    getRow,
    recycleRow,
    useDataChunks,
    setRowMetadata,
    getRowMetadata
  }
}
```

### 10. Q: How would you test this DataGrid component comprehensively?

**A:** I'd implement a comprehensive testing strategy covering unit, integration, and performance tests:

```typescript
// Unit Tests
describe('DataGrid Component', () => {
  test('renders with basic data', () => {
    const data = [{ id: 1, name: 'John' }]
    const columns = [{ key: 'name', title: 'Name' }]
    
    render(<DataGrid data={data} columns={columns} height={400} />)
    
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('John')).toBeInTheDocument()
  })
  
  test('virtual scrolling calculates visible range correctly', () => {
    const virtualizer = new VirtualScrollManager({
      height: 400,
      rowHeight: 50,
      totalRows: 1000,
      overscan: 5
    })
    
    const [start, end] = virtualizer.getVisibleRange(0)
    expect(start).toBe(0)
    expect(end).toBe(12) // 400/50 + 5 overscan
  })
  
  test('sorting works correctly', async () => {
    const data = [
      { id: 1, name: 'Charlie' },
      { id: 2, name: 'Alice' },
      { id: 3, name: 'Bob' }
    ]
    
    render(<DataGrid data={data} columns={columns} height={400} sortable />)
    
    fireEvent.click(screen.getByText('Name'))
    
    await waitFor(() => {
      const rows = screen.getAllByRole('row')
      expect(rows[1]).toHaveTextContent('Alice')
      expect(rows[2]).toHaveTextContent('Bob')
      expect(rows[3]).toHaveTextContent('Charlie')
    })
  })
})

// Performance Tests
describe('DataGrid Performance', () => {
  test('handles large datasets without blocking', async () => {
    const largeData = Array.from({ length: 100000 }, (_, i) => ({
      id: i,
      name: `User ${i}`,
      email: `user${i}@example.com`
    }))
    
    const startTime = performance.now()
    
    render(<DataGrid data={largeData} columns={columns} height={400} />)
    
    const endTime = performance.now()
    expect(endTime - startTime).toBeLessThan(100) // Should render in <100ms
  })
  
  test('memory usage stays bounded with virtual scrolling', () => {
    const measureMemory = () => {
      return (performance as any).memory?.usedJSHeapSize || 0
    }
    
    const initialMemory = measureMemory()
    
    // Simulate scrolling through large dataset
    const { rerender } = render(<DataGrid data={largeData} columns={columns} height={400} />)
    
    // Scroll to different positions
    for (let i = 0; i < 100; i++) {
      rerender(<DataGrid data={largeData} columns={columns} height={400} scrollTop={i * 50} />)
    }
    
    const finalMemory = measureMemory()
    const memoryIncrease = finalMemory - initialMemory
    
    // Memory increase should be bounded (less than 50MB)
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024)
  })
})

// Integration Tests
describe('DataGrid Integration', () => {
  test('selection and editing work together', async () => {
    const onRowEdit = jest.fn()
    
    render(
      <DataGrid 
        data={data} 
        columns={columns} 
        height={400} 
        selectable 
        editable 
        onRowEdit={onRowEdit}
      />
    )
    
    // Select row
    fireEvent.click(screen.getByRole('row', { name: /john/i }))
    
    // Start editing
    fireEvent.doubleClick(screen.getByDisplayValue('John'))
    
    // Edit value
    const input = screen.getByDisplayValue('John')
    fireEvent.change(input, { target: { value: 'Jane' } })
    fireEvent.blur(input)
    
    await waitFor(() => {
      expect(onRowEdit).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'John' }),
        { name: 'Jane' }
      )
    })
  })
})

// Accessibility Tests
describe('DataGrid Accessibility', () => {
  test('has proper ARIA attributes', () => {
    render(<DataGrid data={data} columns={columns} height={400} />)
    
    const grid = screen.getByRole('grid')
    expect(grid).toHaveAttribute('aria-rowcount')
    expect(grid).toHaveAttribute('aria-colcount')
    
    const cells = screen.getAllByRole('gridcell')
    cells.forEach(cell => {
      expect(cell).toHaveAttribute('aria-rowindex')
      expect(cell).toHaveAttribute('aria-colindex')
    })
  })
  
  test('keyboard navigation works', () => {
    render(<DataGrid data={data} columns={columns} height={400} />)
    
    const grid = screen.getByRole('grid')
    grid.focus()
    
    fireEvent.keyDown(grid, { key: 'ArrowDown' })
    fireEvent.keyDown(grid, { key: 'ArrowRight' })
    
    // Assert focus moved correctly
    expect(document.activeElement).toHaveAttribute('aria-rowindex', '2')
    expect(document.activeElement).toHaveAttribute('aria-colindex', '2')
  })
})
```

## Summary

This DataGrid component design demonstrates:

1. **Scalable Architecture**: Modular design with clear separation of concerns
2. **Performance Optimization**: Virtual scrolling, memoization, and efficient state management
3. **Feature Completeness**: All requested features implemented with extensibility in mind
4. **Production Ready**: Comprehensive error handling, accessibility, and testing
5. **Senior-Level Thinking**: Complex problem solving, performance considerations, and maintainable code

The component can handle 100k+ rows efficiently while maintaining a smooth user experience and meeting modern web accessibility standards.