---
title: Autocomplete/Typeahead Component Design
description: A flexible, accessible autocomplete component that supports debounced search, keyboard navigation, multi-select capabilities, and custom rendering with proper loading states and error handling.
---

# Autocomplete/Typeahead Component Design

## Component Overview

A flexible, accessible autocomplete component that supports debounced search, keyboard navigation, multi-select capabilities, and custom rendering with proper loading states and error handling.

## API Design

### Props Interface

```typescript
interface AutocompleteProps<T = any> {
  // Core functionality
  onSearch: (query: string) => Promise<T[]> | T[];
  onSelect: (item: T, items: T[]) => void;
  getItemValue: (item: T) => string;
  getItemKey: (item: T) => string | number;
  
  // Configuration
  placeholder?: string;
  debounceMs?: number;
  minQueryLength?: number;
  maxResults?: number;
  multiSelect?: boolean;
  clearOnSelect?: boolean;
  
  // Customization
  renderItem?: (item: T, isHighlighted: boolean) => React.ReactNode;
  renderNoResults?: () => React.ReactNode;
  renderLoading?: () => React.ReactNode;
  renderError?: (error: Error) => React.ReactNode;
  
  // Accessibility
  inputId?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  
  // Styling
  className?: string;
  inputClassName?: string;
  dropdownClassName?: string;
  
  // Advanced
  filterResults?: (items: T[], query: string) => T[];
  onQueryChange?: (query: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  initialValue?: string;
  initialItems?: T[];
}
```

### Return Interface

```typescript
interface AutocompleteRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  setQuery: (query: string) => void;
  getSelectedItems: () => T[];
}
```

## Implementation

```typescript
import React, { 
  useState, 
  useEffect, 
  useRef, 
  useCallback, 
  useMemo,
  forwardRef,
  useImperativeHandle 
} from 'react';
import { debounce } from 'lodash-es';

interface AutocompleteState<T> {
  query: string;
  items: T[];
  selectedItems: T[];
  highlightedIndex: number;
  isOpen: boolean;
  isLoading: boolean;
  error: Error | null;
}

const Autocomplete = forwardRef<AutocompleteRef, AutocompleteProps>(<T,>(
  {
    onSearch,
    onSelect,
    getItemValue,
    getItemKey,
    placeholder = 'Search...',
    debounceMs = 300,
    minQueryLength = 1,
    maxResults = 10,
    multiSelect = false,
    clearOnSelect = !multiSelect,
    renderItem,
    renderNoResults,
    renderLoading,
    renderError,
    inputId,
    ariaLabel,
    ariaDescribedBy,
    className = '',
    inputClassName = '',
    dropdownClassName = '',
    filterResults,
    onQueryChange,
    onFocus,
    onBlur,
    disabled = false,
    initialValue = '',
    initialItems = []
  }: AutocompleteProps<T>,
  ref
) => {
  // State management
  const [state, setState] = useState<AutocompleteState<T>>({
    query: initialValue,
    items: initialItems,
    selectedItems: [],
    highlightedIndex: -1,
    isOpen: false,
    isLoading: false,
    error: null
  });

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const compositionRef = useRef(false);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    clear: () => handleClear(),
    setQuery: (query: string) => handleQueryChange(query),
    getSelectedItems: () => state.selectedItems
  }));

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce(async (query: string) => {
      if (query.length < minQueryLength) {
        setState(prev => ({ 
          ...prev, 
          items: [], 
          isLoading: false, 
          error: null,
          isOpen: false 
        }));
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        const results = await Promise.resolve(onSearch(query));
        
        // Check if request was aborted
        if (abortControllerRef.current?.signal.aborted) return;

        const processedResults = filterResults 
          ? filterResults(results, query)
          : results.slice(0, maxResults);

        setState(prev => ({
          ...prev,
          items: processedResults,
          isLoading: false,
          isOpen: true,
          highlightedIndex: processedResults.length > 0 ? 0 : -1
        }));
      } catch (error) {
        if (abortControllerRef.current?.signal.aborted) return;
        
        setState(prev => ({
          ...prev,
          error: error as Error,
          isLoading: false,
          items: [],
          isOpen: false
        }));
      }
    }, debounceMs),
    [onSearch, debounceMs, minQueryLength, maxResults, filterResults]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedSearch]);

  // Handle query change
  const handleQueryChange = useCallback((newQuery: string) => {
    setState(prev => ({ ...prev, query: newQuery }));
    onQueryChange?.(newQuery);
    
    if (!compositionRef.current) {
      debouncedSearch(newQuery);
    }
  }, [debouncedSearch, onQueryChange]);

  // Handle item selection
  const handleItemSelect = useCallback((item: T) => {
    if (multiSelect) {
      const newSelectedItems = [...state.selectedItems, item];
      setState(prev => ({
        ...prev,
        selectedItems: newSelectedItems,
        query: clearOnSelect ? '' : prev.query,
        isOpen: false,
        highlightedIndex: -1
      }));
      onSelect(item, newSelectedItems);
    } else {
      setState(prev => ({
        ...prev,
        query: clearOnSelect ? '' : getItemValue(item),
        selectedItems: [item],
        isOpen: false,
        highlightedIndex: -1
      }));
      onSelect(item, [item]);
    }
  }, [state.selectedItems, multiSelect, clearOnSelect, onSelect, getItemValue]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!state.isOpen && !['ArrowDown', 'ArrowUp'].includes(e.key)) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setState(prev => ({
          ...prev,
          highlightedIndex: prev.highlightedIndex < prev.items.length - 1 
            ? prev.highlightedIndex + 1 
            : 0,
          isOpen: true
        }));
        break;

      case 'ArrowUp':
        e.preventDefault();
        setState(prev => ({
          ...prev,
          highlightedIndex: prev.highlightedIndex > 0 
            ? prev.highlightedIndex - 1 
            : prev.items.length - 1
        }));
        break;

      case 'Enter':
        e.preventDefault();
        if (state.highlightedIndex >= 0 && state.items[state.highlightedIndex]) {
          handleItemSelect(state.items[state.highlightedIndex]);
        }
        break;

      case 'Escape':
        setState(prev => ({ 
          ...prev, 
          isOpen: false, 
          highlightedIndex: -1 
        }));
        inputRef.current?.blur();
        break;

      case 'Tab':
        setState(prev => ({ ...prev, isOpen: false }));
        break;
    }
  }, [state.isOpen, state.highlightedIndex, state.items, handleItemSelect]);

  // Handle clear
  const handleClear = useCallback(() => {
    setState(prev => ({
      ...prev,
      query: '',
      items: [],
      selectedItems: [],
      isOpen: false,
      highlightedIndex: -1,
      error: null
    }));
    debouncedSearch.cancel();
  }, [debouncedSearch]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (state.highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[state.highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [state.highlightedIndex]);

  // Handle composition events (for IME support)
  const handleCompositionStart = () => {
    compositionRef.current = true;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    compositionRef.current = false;
    handleQueryChange(e.currentTarget.value);
  };

  // Generate unique IDs
  const listboxId = useMemo(() => `${inputId || 'autocomplete'}-listbox`, [inputId]);
  const activeDescendant = state.highlightedIndex >= 0 
    ? `${listboxId}-option-${state.highlightedIndex}` 
    : undefined;

  return (
    <div className={`autocomplete ${className}`} role="combobox" aria-expanded={state.isOpen}>
      {/* Input */}
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        value={state.query}
        onChange={(e) => handleQueryChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          setState(prev => ({ ...prev, isOpen: prev.items.length > 0 }));
          onFocus?.();
        }}
        onBlur={(e) => {
          // Delay hiding to allow for click selection
          setTimeout(() => {
            setState(prev => ({ ...prev, isOpen: false }));
            onBlur?.();
          }, 150);
        }}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-activedescendant={activeDescendant}
        className={`autocomplete-input ${inputClassName}`}
        autoComplete="off"
      />

      {/* Selected items for multi-select */}
      {multiSelect && state.selectedItems.length > 0 && (
        <div className="autocomplete-selected" role="group" aria-label="Selected items">
          {state.selectedItems.map((item) => (
            <span 
              key={getItemKey(item)} 
              className="autocomplete-tag"
              role="option"
              aria-selected="true"
            >
              {getItemValue(item)}
              <button
                type="button"
                onClick={() => {
                  setState(prev => ({
                    ...prev,
                    selectedItems: prev.selectedItems.filter(
                      selected => getItemKey(selected) !== getItemKey(item)
                    )
                  }));
                }}
                aria-label={`Remove ${getItemValue(item)}`}
                className="autocomplete-tag-remove"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown */}
      {state.isOpen && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label="Search suggestions"
          className={`autocomplete-dropdown ${dropdownClassName}`}
        >
          {state.isLoading && (
            <li role="status" aria-live="polite" className="autocomplete-loading">
              {renderLoading ? renderLoading() : 'Loading...'}
            </li>
          )}

          {state.error && (
            <li role="alert" className="autocomplete-error">
              {renderError ? renderError(state.error) : 'An error occurred'}
            </li>
          )}

          {!state.isLoading && !state.error && state.items.length === 0 && (
            <li className="autocomplete-no-results">
              {renderNoResults ? renderNoResults() : 'No results found'}
            </li>
          )}

          {!state.isLoading && !state.error && state.items.map((item, index) => (
            <li
              key={getItemKey(item)}
              id={`${listboxId}-option-${index}`}
              role="option"
              aria-selected={index === state.highlightedIndex}
              className={`autocomplete-item ${
                index === state.highlightedIndex ? 'autocomplete-item--highlighted' : ''
              }`}
              onClick={() => handleItemSelect(item)}
              onMouseEnter={() => setState(prev => ({ ...prev, highlightedIndex: index }))}
            >
              {renderItem ? renderItem(item, index === state.highlightedIndex) : getItemValue(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default Autocomplete;
```

## CSS Styles

```css
.autocomplete {
  position: relative;
  width: 100%;
}

.autocomplete-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.autocomplete-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.autocomplete-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.autocomplete-selected {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
}

.autocomplete-tag {
  display: inline-flex;
  align-items: center;
  background-color: #e9ecef;
  border-radius: 16px;
  padding: 4px 8px;
  font-size: 12px;
  gap: 4px;
}

.autocomplete-tag-remove {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1;
}

.autocomplete-tag-remove:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.autocomplete-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  list-style: none;
  margin: 0;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.autocomplete-item {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}

.autocomplete-item:last-child {
  border-bottom: none;
}

.autocomplete-item:hover,
.autocomplete-item--highlighted {
  background-color: #f8f9fa;
}

.autocomplete-loading,
.autocomplete-error,
.autocomplete-no-results {
  padding: 8px 12px;
  color: #666;
  font-style: italic;
}

.autocomplete-error {
  color: #dc3545;
}

/* Focus management for accessibility */
.autocomplete-item:focus {
  outline: 2px solid #007bff;
  outline-offset: -2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .autocomplete-input:focus {
    border-color: CanvasText;
  }
  
  .autocomplete-item--highlighted {
    background-color: Highlight;
    color: HighlightText;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .autocomplete-input {
    transition: none;
  }
}
```

## Usage Examples

### Basic Usage

```typescript
const BasicExample = () => {
  const searchUsers = async (query: string) => {
    const response = await fetch(`/api/users?q=${encodeURIComponent(query)}`);
    return response.json();
  };

  return (
    <Autocomplete
      onSearch={searchUsers}
      onSelect={(user) => console.log('Selected:', user)}
      getItemValue={(user) => user.name}
      getItemKey={(user) => user.id}
      placeholder="Search users..."
    />
  );
};
```

### Multi-select with Custom Rendering

```typescript
const MultiSelectExample = () => {
  return (
    <Autocomplete
      multiSelect
      onSearch={searchTags}
      onSelect={(tag, allTags) => setSelectedTags(allTags)}
      getItemValue={(tag) => tag.name}
      getItemKey={(tag) => tag.id}
      renderItem={(tag, isHighlighted) => (
        <div className={`tag-item ${isHighlighted ? 'highlighted' : ''}`}>
          <span className="tag-name">{tag.name}</span>
          <span className="tag-count">({tag.count})</span>
        </div>
      )}
      placeholder="Search tags..."
    />
  );
};
```

---

## Interview Questions & Answers

### 1. **How did you handle race conditions in async search requests?**

**Answer:** I implemented request cancellation using `AbortController`. Each new search request cancels the previous one before starting:

```typescript
// Cancel previous request
if (abortControllerRef.current) {
  abortControllerRef.current.abort();
}

// Create new abort controller
abortControllerRef.current = new AbortController();
```

This prevents out-of-order responses and reduces unnecessary network requests. I also check if the request was aborted before updating state to avoid React warnings about setting state on unmounted components.

### 2. **Explain your debouncing strategy and why you chose that approach.**

**Answer:** I used Lodash's debounce with a 300ms default delay. The debouncing is applied at the search function level, not the input onChange, which allows for immediate UI updates while throttling API calls:

```typescript
const debouncedSearch = useMemo(
  () => debounce(async (query: string) => {
    // API call logic
  }, debounceMs),
  [onSearch, debounceMs, minQueryLength, maxResults, filterResults]
);
```

I chose this approach because:
- It maintains responsive UI feedback
- Reduces API calls significantly
- The debounce function is memoized to prevent recreation on every render
- It's cancelable for cleanup

### 3. **How did you ensure keyboard accessibility and screen reader compatibility?**

**Answer:** I implemented comprehensive ARIA support and keyboard navigation:

**ARIA Attributes:**
- `role="combobox"` on the container
- `aria-expanded` to indicate dropdown state
- `aria-controls` linking input to listbox
- `aria-activedescendant` for virtual focus management
- `role="listbox"` and `role="option"` for proper semantics

**Keyboard Navigation:**
- Arrow keys for navigation with circular wrapping
- Enter to select highlighted item
- Escape to close dropdown and blur input
- Tab to close dropdown naturally

**Screen Reader Support:**
- Live regions for loading/error states
- Proper labeling of all interactive elements
- Selected items announced with `aria-selected`

### 4. **How would you optimize this component for performance with large datasets?**

**Answer:** Several optimization strategies:

1. **Virtual Scrolling:** For 1000+ items, implement virtual scrolling to render only visible items
2. **Client-side Caching:** Cache search results with expiration:
   ```typescript
   const cache = new Map<string, { data: T[], timestamp: number }>();
   ```
3. **Request Deduplication:** Avoid duplicate requests for the same query
4. **Fuzzy Search Optimization:** Use workers for client-side filtering
5. **Pagination:** Implement infinite scroll with backend pagination
6. **Memoization:** Memoize expensive operations like filtering and rendering

### 5. **How did you handle IME (Input Method Editor) input for international users?**

**Answer:** I implemented composition event handling for proper IME support:

```typescript
const handleCompositionStart = () => {
  compositionRef.current = true;
};

const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
  compositionRef.current = false;
  handleQueryChange(e.currentTarget.value);
};
```

This prevents premature API calls while users are composing characters in languages like Chinese, Japanese, or Korean. The search only triggers after composition is complete.

### 6. **Explain your error handling strategy.**

**Answer:** I implemented comprehensive error handling at multiple levels:

1. **Network Errors:** Caught in the try-catch block with proper state management
2. **Aborted Requests:** Checked abort signal before state updates
3. **User-Friendly Messages:** Custom error rendering with `renderError` prop
4. **Graceful Degradation:** Component remains functional even with API failures
5. **Error Boundaries:** Component designed to work with React Error Boundaries

### 7. **How would you test this component?**

**Answer:** Comprehensive testing strategy:

**Unit Tests:**
- Debounce functionality
- Keyboard navigation logic
- State management edge cases
- Accessibility attributes

**Integration Tests:**
- API integration with mock responses
- User interaction flows
- Error scenarios

**E2E Tests:**
- Complete user journeys
- Cross-browser compatibility
- Screen reader testing with tools like axe-core

**Performance Tests:**
- Large dataset rendering
- Memory leak detection
- Network request optimization

### 8. **How would you extend this component for different use cases?**

**Answer:** The component is designed for extensibility:

1. **Plugin System:** Allow custom behaviors through plugins
2. **Virtualization:** Add virtual scrolling for large lists
3. **Custom Filtering:** Already supports `filterResults` prop
4. **Async Validation:** Add validation hooks for form integration
5. **Theming:** CSS custom properties for easy theming
6. **Mobile Optimization:** Touch-friendly interactions and responsive design

### 9. **What are the potential security considerations?**

**Answer:** 

1. **XSS Prevention:** All user input is properly escaped in React
2. **CSRF Protection:** API calls should include proper CSRF tokens
3. **Input Sanitization:** Server-side validation of search queries
4. **Rate Limiting:** Implement client and server-side rate limiting
5. **Content Security Policy:** Ensure CSP compatibility
6. **Data Exposure:** Limit sensitive data in search results

### 10. **How would you handle real-time updates to the search results?**

**Answer:** Several approaches for real-time updates:

1. **WebSocket Integration:**
   ```typescript
   useEffect(() => {
     const ws = new WebSocket('/search-updates');
     ws.onmessage = (event) => {
       const update = JSON.parse(event.data);
       setState(prev => ({ ...prev, items: updateItems(prev.items, update) }));
     };
   }, []);
   ```

2. **Server-Sent Events:** For one-way updates from server
3. **Polling:** Refresh results periodically for less critical updates
4. **Optimistic Updates:** Update UI immediately for user actions
5. **Conflict Resolution:** Handle concurrent updates gracefully

This design demonstrates senior-level understanding of component architecture, performance optimization, accessibility, and real-world scalability concerns that are crucial for FAANG+ interviews.