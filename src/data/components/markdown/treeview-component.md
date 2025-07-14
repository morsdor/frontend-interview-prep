# TreeView Component Design - Senior UI Developer Interview

## Component Overview

A highly performant, accessible TreeView component with lazy loading, drag-and-drop, multi-select, and virtual scrolling capabilities for handling large hierarchical datasets.

## API Design

### Core Types

```typescript
interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  isLeaf?: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
  isLoading?: boolean;
  metadata?: Record<string, any>;
  parentId?: string;
  level?: number;
}

interface TreeViewProps {
  // Data
  data: TreeNode[];
  
  // Lazy loading
  loadChildren?: (node: TreeNode) => Promise<TreeNode[]>;
  
  // Selection
  selectionMode?: 'single' | 'multiple' | 'none';
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  
  // Expansion
  expandedIds?: string[];
  onExpansionChange?: (expandedIds: string[]) => void;
  
  // Drag & Drop
  draggable?: boolean;
  onDragStart?: (node: TreeNode) => void;
  onDrop?: (draggedNode: TreeNode, targetNode: TreeNode, position: 'before' | 'after' | 'inside') => void;
  canDrop?: (draggedNode: TreeNode, targetNode: TreeNode, position: string) => boolean;
  
  // Filtering/Search
  searchTerm?: string;
  filter?: (node: TreeNode, searchTerm: string) => boolean;
  
  // Rendering
  renderNode?: (node: TreeNode, context: NodeRenderContext) => React.ReactNode;
  renderIcon?: (node: TreeNode, isExpanded: boolean) => React.ReactNode;
  
  // Performance
  virtualScrolling?: boolean;
  itemHeight?: number;
  
  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
  
  // Styling
  className?: string;
  nodeClassName?: string;
  
  // Callbacks
  onNodeClick?: (node: TreeNode) => void;
  onNodeDoubleClick?: (node: TreeNode) => void;
  onNodeRightClick?: (node: TreeNode, event: React.MouseEvent) => void;
}

interface NodeRenderContext {
  node: TreeNode;
  isExpanded: boolean;
  isSelected: boolean;
  isLoading: boolean;
  level: number;
  hasChildren: boolean;
  isLast: boolean;
  path: string[];
}
```

### Hook API

```typescript
// Custom hook for tree state management
const useTreeState = (initialData: TreeNode[], options?: TreeStateOptions) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  
  // Tree manipulation methods
  const expandNode = (id: string) => { /* implementation */ };
  const collapseNode = (id: string) => { /* implementation */ };
  const toggleExpansion = (id: string) => { /* implementation */ };
  const selectNode = (id: string, multiSelect?: boolean) => { /* implementation */ };
  const getNodePath = (id: string) => { /* implementation */ };
  const getFilteredNodes = () => { /* implementation */ };
  
  return {
    expandedIds,
    selectedIds,
    searchTerm,
    setSearchTerm,
    expandNode,
    collapseNode,
    toggleExpansion,
    selectNode,
    getNodePath,
    getFilteredNodes,
    // ... other methods
  };
};
```

## Architecture & Implementation Strategy

### 1. Component Structure

```
TreeView/
├── TreeView.tsx           # Main component
├── TreeNode.tsx           # Individual node component
├── VirtualizedTree.tsx    # Virtual scrolling wrapper
├── DragDropProvider.tsx   # Drag & drop context
├── hooks/
│   ├── useTreeState.ts    # State management
│   ├── useVirtualization.ts
│   ├── useDragDrop.ts
│   └── useKeyboardNav.ts
├── utils/
│   ├── treeUtils.ts       # Tree manipulation utilities
│   ├── searchUtils.ts     # Search/filter logic
│   └── accessibility.ts  # A11y helpers
└── types/
    └── index.ts           # Type definitions
```

### 2. State Management Strategy

```typescript
// Centralized state management using useReducer
interface TreeState {
  flattenedNodes: TreeNode[];
  expandedIds: Set<string>;
  selectedIds: Set<string>;
  loadingIds: Set<string>;
  dragState: DragState | null;
  searchTerm: string;
  filteredNodeIds: Set<string>;
}

type TreeAction = 
  | { type: 'EXPAND_NODE'; id: string }
  | { type: 'COLLAPSE_NODE'; id: string }
  | { type: 'SELECT_NODE'; id: string; multiSelect: boolean }
  | { type: 'LOAD_CHILDREN_START'; id: string }
  | { type: 'LOAD_CHILDREN_SUCCESS'; parentId: string; children: TreeNode[] }
  | { type: 'SET_SEARCH_TERM'; term: string }
  | { type: 'DRAG_START'; node: TreeNode }
  | { type: 'DRAG_END' };
```

### 3. Performance Optimizations

```typescript
// Memoization strategies
const TreeNode = React.memo(({ node, ...props }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison logic
  return (
    prevProps.node.id === nextProps.node.id &&
    prevProps.isExpanded === nextProps.isExpanded &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.level === nextProps.level
  );
});

// Virtual scrolling for large datasets
const VirtualizedTree = ({ nodes, itemHeight = 32 }) => {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  
  const containerHeight = containerRef?.clientHeight || 0;
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    nodes.length
  );
  
  const visibleNodes = nodes.slice(startIndex, endIndex);
  
  return (
    <div
      ref={setContainerRef}
      style={{ height: '100%', overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: nodes.length * itemHeight }}>
        <div style={{ transform: `translateY(${startIndex * itemHeight}px)` }}>
          {visibleNodes.map((node, index) => (
            <TreeNode
              key={node.id}
              node={node}
              style={{ height: itemHeight }}
              virtualIndex={startIndex + index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
```

### 4. Accessibility Implementation

```typescript
// ARIA attributes and keyboard navigation
const TreeNode = ({ node, level, isExpanded, isSelected, hasChildren }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        // Focus next visible node
        break;
      case 'ArrowUp':
        // Focus previous visible node
        break;
      case 'ArrowRight':
        // Expand node or focus first child
        break;
      case 'ArrowLeft':
        // Collapse node or focus parent
        break;
      case 'Enter':
      case ' ':
        // Toggle selection
        break;
      case 'Home':
        // Focus first node
        break;
      case 'End':
        // Focus last visible node
        break;
    }
  };
  
  return (
    <div
      ref={nodeRef}
      role="treeitem"
      aria-level={level}
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
      onKeyDown={handleKeyDown}
      style={{ paddingLeft: `${level * 20}px` }}
    >
      {/* Node content */}
    </div>
  );
};
```

---

## Interview Questions & Answers

### 1. **Q: How would you handle lazy loading of tree nodes efficiently?**

**A:** I'd implement a multi-layered approach:

```typescript
const useLazyLoading = (loadChildren: (node: TreeNode) => Promise<TreeNode[]>) => {
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [loadedIds, setLoadedIds] = useState<Set<string>>(new Set());
  
  const loadNodeChildren = async (node: TreeNode) => {
    if (loadedIds.has(node.id) || loadingIds.has(node.id)) return;
    
    setLoadingIds(prev => new Set([...prev, node.id]));
    
    try {
      const children = await loadChildren(node);
      // Update tree state with new children
      dispatch({ type: 'LOAD_CHILDREN_SUCCESS', parentId: node.id, children });
      setLoadedIds(prev => new Set([...prev, node.id]));
    } catch (error) {
      // Handle error state
    } finally {
      setLoadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(node.id);
        return newSet;
      });
    }
  };
  
  return { loadNodeChildren, loadingIds };
};
```

**Key optimizations:**
- Cache loaded nodes to prevent redundant API calls
- Show loading states with skeleton UI
- Implement request cancellation for component unmounting
- Use intersection observer for preloading nodes near viewport

### 2. **Q: How would you implement drag-and-drop with proper visual feedback?**

**A:** I'd create a comprehensive drag-and-drop system:

```typescript
const useDragDrop = (onDrop: (draggedNode: TreeNode, targetNode: TreeNode, position: string) => void) => {
  const [dragState, setDragState] = useState<DragState | null>(null);
  
  const handleDragStart = (node: TreeNode) => {
    setDragState({
      draggedNode: node,
      draggedElements: [node.id], // For multi-select
      allowedDropZones: calculateAllowedDropZones(node)
    });
  };
  
  const handleDragOver = (targetNode: TreeNode, position: 'before' | 'after' | 'inside') => {
    // Prevent invalid drops (like dropping parent onto child)
    if (isAncestor(dragState?.draggedNode, targetNode)) {
      return false;
    }
    
    // Update visual indicators
    setDragState(prev => ({
      ...prev,
      dropTarget: { node: targetNode, position }
    }));
    
    return true;
  };
  
  const handleDrop = () => {
    if (dragState?.dropTarget) {
      onDrop(
        dragState.draggedNode,
        dragState.dropTarget.node,
        dragState.dropTarget.position
      );
    }
    setDragState(null);
  };
  
  return { dragState, handleDragStart, handleDragOver, handleDrop };
};
```

**Visual feedback includes:**
- Ghost image during drag
- Drop zones with different colors (valid/invalid)
- Insertion indicators (lines showing where item will be placed)
- Auto-scroll when dragging near edges

### 3. **Q: How would you optimize rendering performance for 10,000+ nodes?**

**A:** Multi-pronged optimization strategy:

```typescript
// 1. Virtualization
const useVirtualization = (nodes: TreeNode[], itemHeight: number) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });
  
  // Calculate visible nodes based on scroll position
  const getVisibleNodes = (scrollTop: number, containerHeight: number) => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(start + Math.ceil(containerHeight / itemHeight) + 5, nodes.length);
    return { start, end, nodes: nodes.slice(start, end) };
  };
  
  return { visibleRange, getVisibleNodes };
};

// 2. Memoization
const TreeNode = React.memo(({ node, ...props }) => {
  // Only re-render if essential props change
}, shallowEqual);

// 3. Flattening for performance
const flattenTree = (nodes: TreeNode[], expandedIds: Set<string>): FlatNode[] => {
  const result: FlatNode[] = [];
  
  const traverse = (nodes: TreeNode[], level: number = 0) => {
    nodes.forEach(node => {
      result.push({ ...node, level });
      if (node.children && expandedIds.has(node.id)) {
        traverse(node.children, level + 1);
      }
    });
  };
  
  traverse(nodes);
  return result;
};
```

**Additional optimizations:**
- Use `useMemo` for expensive calculations
- Implement windowing with `react-window`
- Debounce search/filter operations
- Use `useCallback` for event handlers

### 4. **Q: How would you implement search with highlighting across the tree?**

**A:** Comprehensive search implementation:

```typescript
const useTreeSearch = (nodes: TreeNode[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  
  const searchTree = useMemo(() => {
    if (!searchTerm) return { matches: [], expandedForSearch: new Set() };
    
    const matches: SearchResult[] = [];
    const expandedForSearch = new Set<string>();
    
    const searchNode = (node: TreeNode, path: string[] = []) => {
      const currentPath = [...path, node.id];
      const isMatch = node.label.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (isMatch) {
        matches.push({
          node,
          path: currentPath,
          matchText: highlightMatch(node.label, searchTerm)
        });
        
        // Expand all parents to show this match
        path.forEach(parentId => expandedForSearch.add(parentId));
      }
      
      // Search children
      if (node.children) {
        node.children.forEach(child => searchNode(child, currentPath));
      }
    };
    
    nodes.forEach(node => searchNode(node));
    
    return { matches, expandedForSearch };
  }, [nodes, searchTerm]);
  
  const highlightMatch = (text: string, term: string) => {
    if (!term) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };
  
  return { searchTerm, setSearchTerm, searchResults: searchTree.matches };
};
```

**Features:**
- Real-time search with debouncing
- Highlight matching text
- Auto-expand parent nodes of matches
- Search in metadata/custom fields
- Fuzzy search support

### 5. **Q: How would you handle multi-select with parent-child relationships?**

**A:** Intelligent selection system:

```typescript
const useMultiSelect = (nodes: TreeNode[]) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const selectNode = (nodeId: string, mode: 'single' | 'multi' | 'range') => {
    setSelectedIds(prev => {
      const newSelection = new Set(prev);
      
      if (mode === 'single') {
        return new Set([nodeId]);
      }
      
      if (mode === 'multi') {
        if (newSelection.has(nodeId)) {
          newSelection.delete(nodeId);
          // Remove children if parent is deselected
          removeChildrenFromSelection(nodeId, newSelection);
        } else {
          newSelection.add(nodeId);
          // Auto-select children if parent is selected
          addChildrenToSelection(nodeId, newSelection);
        }
      }
      
      return newSelection;
    });
  };
  
  const addChildrenToSelection = (parentId: string, selection: Set<string>) => {
    const parent = findNodeById(parentId);
    if (parent?.children) {
      parent.children.forEach(child => {
        selection.add(child.id);
        addChildrenToSelection(child.id, selection);
      });
    }
  };
  
  const getSelectionState = (nodeId: string) => {
    const node = findNodeById(nodeId);
    if (!node?.children) return selectedIds.has(nodeId) ? 'selected' : 'unselected';
    
    const childrenSelected = node.children.every(child => 
      getSelectionState(child.id) === 'selected'
    );
    const someChildrenSelected = node.children.some(child => 
      getSelectionState(child.id) !== 'unselected'
    );
    
    if (childrenSelected) return 'selected';
    if (someChildrenSelected) return 'indeterminate';
    return 'unselected';
  };
  
  return { selectedIds, selectNode, getSelectionState };
};
```

**Selection behaviors:**
- Tri-state checkboxes (checked/unchecked/indeterminate)
- Cascade selection to children
- Keyboard multi-select (Ctrl+click, Shift+click)
- Range selection support

### 6. **Q: How would you ensure accessibility compliance?**

**A:** Comprehensive accessibility implementation:

```typescript
const useAccessibility = (nodes: TreeNode[]) => {
  const [focusedId, setFocusedId] = useState<string | null>(null);
  
  const getAriaAttributes = (node: TreeNode) => ({
    role: 'treeitem',
    'aria-level': node.level,
    'aria-expanded': node.children ? node.isExpanded : undefined,
    'aria-selected': node.isSelected,
    'aria-setsize': getSiblingsCount(node),
    'aria-posinset': getPositionInSet(node),
    'aria-describedby': node.metadata?.description ? `${node.id}-desc` : undefined,
    tabIndex: focusedId === node.id ? 0 : -1
  });
  
  const handleKeyboardNavigation = (event: KeyboardEvent, nodeId: string) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusNextNode(nodeId);
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusPreviousNode(nodeId);
        break;
      case 'ArrowRight':
        event.preventDefault();
        expandOrFocusFirstChild(nodeId);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        collapseOrFocusParent(nodeId);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        toggleSelection(nodeId);
        break;
      case 'Home':
        event.preventDefault();
        focusFirstNode();
        break;
      case 'End':
        event.preventDefault();
        focusLastVisibleNode();
        break;
    }
  };
  
  return { getAriaAttributes, handleKeyboardNavigation, focusedId };
};
```

**Accessibility features:**
- Full ARIA tree implementation
- Keyboard navigation (all arrow keys, Home/End)
- Screen reader announcements
- Focus management
- High contrast mode support
- Reduced motion preferences

### 7. **Q: How would you implement undo/redo functionality?**

**A:** Command pattern with state snapshots:

```typescript
interface TreeCommand {
  type: string;
  execute: () => void;
  undo: () => void;
  data: any;
}

const useUndoRedo = (maxHistorySize = 50) => {
  const [history, setHistory] = useState<TreeCommand[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  
  const executeCommand = (command: TreeCommand) => {
    command.execute();
    
    // Remove any commands after current index (when branching)
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(command);
    
    // Limit history size
    if (newHistory.length > maxHistorySize) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };
  
  const undo = () => {
    if (currentIndex >= 0) {
      history[currentIndex].undo();
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const redo = () => {
    if (currentIndex < history.length - 1) {
      const nextIndex = currentIndex + 1;
      history[nextIndex].execute();
      setCurrentIndex(nextIndex);
    }
  };
  
  const canUndo = currentIndex >= 0;
  const canRedo = currentIndex < history.length - 1;
  
  return { executeCommand, undo, redo, canUndo, canRedo };
};

// Example commands
const createMoveCommand = (nodeId: string, oldParent: string, newParent: string): TreeCommand => ({
  type: 'MOVE_NODE',
  execute: () => moveNode(nodeId, newParent),
  undo: () => moveNode(nodeId, oldParent),
  data: { nodeId, oldParent, newParent }
});
```

### 8. **Q: How would you handle real-time updates to tree data?**

**A:** WebSocket integration with optimistic updates:

```typescript
const useRealtimeTree = (wsUrl: string) => {
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [pendingUpdates, setPendingUpdates] = useState<Map<string, TreeNode>>(new Map());
  
  const ws = useWebSocket(wsUrl, {
    onMessage: (event) => {
      const update = JSON.parse(event.data);
      handleRealtimeUpdate(update);
    }
  });
  
  const handleRealtimeUpdate = (update: TreeUpdate) => {
    switch (update.type) {
      case 'NODE_ADDED':
        setNodes(prev => addNodeToTree(prev, update.node, update.parentId));
        break;
      case 'NODE_UPDATED':
        setNodes(prev => updateNodeInTree(prev, update.node));
        break;
      case 'NODE_DELETED':
        setNodes(prev => removeNodeFromTree(prev, update.nodeId));
        break;
      case 'NODES_REORDERED':
        setNodes(prev => reorderNodes(prev, update.newOrder));
        break;
    }
  };
  
  const optimisticUpdate = (nodeId: string, changes: Partial<TreeNode>) => {
    // Apply change immediately
    setNodes(prev => updateNodeInTree(prev, { id: nodeId, ...changes }));
    
    // Track pending update
    setPendingUpdates(prev => new Map(prev).set(nodeId, changes));
    
    // Send to server
    ws.send(JSON.stringify({
      type: 'UPDATE_NODE',
      nodeId,
      changes
    }));
  };
  
  return { nodes, optimisticUpdate };
};
```

**Real-time features:**
- Optimistic updates for immediate feedback
- Conflict resolution for concurrent edits
- Connection state management
- Automatic reconnection with exponential backoff
- Batch updates for performance

### 9. **Q: How would you implement tree validation and error handling?**

**A:** Comprehensive validation system:

```typescript
interface ValidationRule {
  name: string;
  validate: (node: TreeNode, context: ValidationContext) => ValidationResult;
  severity: 'error' | 'warning' | 'info';
}

const useTreeValidation = (rules: ValidationRule[]) => {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  const validateTree = (nodes: TreeNode[]) => {
    const errors: ValidationError[] = [];
    
    const validateNode = (node: TreeNode, context: ValidationContext) => {
      rules.forEach(rule => {
        const result = rule.validate(node, context);
        if (!result.isValid) {
          errors.push({
            nodeId: node.id,
            rule: rule.name,
            message: result.message,
            severity: rule.severity,
            path: context.path
          });
        }
      });
      
      // Validate children
      if (node.children) {
        node.children.forEach(child => 
          validateNode(child, { 
            ...context, 
            path: [...context.path, node.id],
            parent: node 
          })
        );
      }
    };
    
    nodes.forEach(node => validateNode(node, { path: [], parent: null }));
    setValidationErrors(errors);
    return errors;
  };
  
  const commonValidationRules: ValidationRule[] = [
    {
      name: 'unique-ids',
      validate: (node, context) => {
        const isDuplicate = context.allNodes.filter(n => n.id === node.id).length > 1;
        return {
          isValid: !isDuplicate,
          message: `Duplicate node ID: ${node.id}`
        };
      },
      severity: 'error'
    },
    {
      name: 'max-depth',
      validate: (node, context) => {
        const isValid = context.path.length <= 10;
        return {
          isValid,
          message: `Tree depth exceeds maximum (10 levels)`
        };
      },
      severity: 'warning'
    }
  ];
  
  return { validateTree, validationErrors };
};
```

### 10. **Q: How would you test this component comprehensively?**

**A:** Multi-layered testing strategy:

```typescript
// Unit tests
describe('TreeView Component', () => {
  describe('Node Expansion', () => {
    it('should expand node when clicked', () => {
      const { getByRole } = render(<TreeView data={mockData} />);
      const expandButton = getByRole('button', { name: /expand/i });
      fireEvent.click(expandButton);
      expect(getByRole('treeitem', { expanded: true })).toBeInTheDocument();
    });
  });
  
  describe('Keyboard Navigation', () => {
    it('should navigate with arrow keys', () => {
      const { getByRole } = render(<TreeView data={mockData} />);
      const firstNode = getByRole('treeitem');
      firstNode.focus();
      
      fireEvent.keyDown(firstNode, { key: 'ArrowDown' });
      expect(document.activeElement).toBe(getByRole('treeitem', { name: /second/i }));
    });
  });
  
  describe('Drag and Drop', () => {
    it('should handle drag and drop operations', async () => {
      const onDrop = jest.fn();
      const { getByText } = render(<TreeView data={mockData} onDrop={onDrop} draggable />);
      
      const sourceNode = getByText('Source Node');
      const targetNode = getByText('Target Node');
      
      fireEvent.dragStart(sourceNode);
      fireEvent.dragOver(targetNode);
      fireEvent.drop(targetNode);
      
      expect(onDrop).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'source' }),
        expect.objectContaining({ id: 'target' }),
        'inside'
      );
    });
  });
});

// Integration tests
describe('TreeView Integration', () => {
  it('should handle large datasets efficiently', async () => {
    const largeDataset = generateMockData(10000);
    const { container } = render(<TreeView data={largeDataset} virtualScrolling />);
    
    // Should only render visible nodes
    expect(container.querySelectorAll('[role="treeitem"]')).toHaveLength(50);
  });
});

// Performance tests
describe('TreeView Performance', () => {
  it('should not exceed render time thresholds', () => {
    const start = performance.now();
    render(<TreeView data={largeMockData} />);
    const renderTime = performance.now() - start;
    
    expect(renderTime).toBeLessThan(100); // 100ms threshold
  });
});

// Accessibility tests
describe('TreeView Accessibility', () => {
  it('should meet WCAG guidelines', async () => {
    const { container } = render(<TreeView data={mockData} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

**Testing coverage includes:**
- Unit tests for individual functions
- Integration tests for component interactions
- Performance benchmarks
- Accessibility compliance
- Visual regression tests
- End-to-end user workflows

---

## Summary

This TreeView component design demonstrates:

1. **Advanced React Patterns**: Custom hooks, context, memoization, and performance optimization
2. **Comprehensive API Design**: Flexible, extensible, and type-safe interfaces
3. **Performance Optimization**: Virtual scrolling, lazy loading, and efficient re-rendering
4. **Accessibility**: Full ARIA support and keyboard navigation
5. **Real-world Features**: Drag-and-drop, search, multi-select, and undo/redo
6. **Testing Strategy**: Comprehensive testing approach covering all aspects
7. **Scalability**: Architecture that handles large datasets efficiently

The component is enterprise-ready with proper error handling, validation, and real-time update capabilities.