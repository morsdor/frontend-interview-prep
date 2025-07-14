"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { debounce } from "lodash-es";

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

interface AutocompleteRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  setQuery: (query: string) => void;
  getSelectedItems: () => any[];
}

interface AutocompleteState<T> {
  query: string;
  items: T[];
  selectedItems: T[];
  highlightedIndex: number;
  isOpen: boolean;
  isLoading: boolean;
  error: Error | null;
}

const Autocomplete = forwardRef<AutocompleteRef, AutocompleteProps>(
  <T,>(
    {
      onSearch,
      onSelect,
      getItemValue,
      getItemKey,
      placeholder = "Search...",
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
      className = "",
      inputClassName = "",
      dropdownClassName = "",
      filterResults,
      onQueryChange,
      onFocus,
      onBlur,
      disabled = false,
      initialValue = "",
      initialItems = [],
    }: AutocompleteProps<T>,
    ref: React.Ref<unknown> | undefined
  ) => {
    // State management
    const [state, setState] = useState<AutocompleteState<T>>({
      query: initialValue,
      items: initialItems,
      selectedItems: [],
      highlightedIndex: -1,
      isOpen: false,
      isLoading: false,
      error: null,
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
      getSelectedItems: () => state.selectedItems,
    }));

    // Debounced search function
    const debouncedSearch = useMemo(
      () =>
        debounce(async (query: string) => {
          if (query.length < minQueryLength) {
            setState((prev) => ({
              ...prev,
              items: [],
              isLoading: false,
              error: null,
              isOpen: false,
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
            setState((prev) => ({ ...prev, isLoading: true, error: null }));

            const results = await Promise.resolve(onSearch(query));

            // Check if request was aborted
            if (abortControllerRef.current?.signal.aborted) return;

            const processedResults = filterResults
              ? filterResults(results, query)
              : results.slice(0, maxResults);

            setState((prev) => ({
              ...prev,
              items: processedResults,
              isLoading: false,
              isOpen: true,
              highlightedIndex: processedResults.length > 0 ? 0 : -1,
            }));
          } catch (error) {
            if (abortControllerRef.current?.signal.aborted) return;

            setState((prev) => ({
              ...prev,
              error: error as Error,
              isLoading: false,
              items: [],
              isOpen: false,
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
    const handleQueryChange = useCallback(
      (newQuery: string) => {
        setState((prev) => ({ ...prev, query: newQuery }));
        onQueryChange?.(newQuery);

        if (!compositionRef.current) {
          debouncedSearch(newQuery);
        }
      },
      [debouncedSearch, onQueryChange]
    );

    // Handle item selection
    const handleItemSelect = useCallback(
      (item: T) => {
        if (multiSelect) {
          const newSelectedItems = [...state.selectedItems, item];
          setState((prev) => ({
            ...prev,
            selectedItems: newSelectedItems,
            query: clearOnSelect ? "" : prev.query,
            isOpen: false,
            highlightedIndex: -1,
          }));
          onSelect(item, newSelectedItems);
        } else {
          setState((prev) => ({
            ...prev,
            query: clearOnSelect ? "" : getItemValue(item),
            selectedItems: [item],
            isOpen: false,
            highlightedIndex: -1,
          }));
          onSelect(item, [item]);
        }
      },
      [state.selectedItems, multiSelect, clearOnSelect, onSelect, getItemValue]
    );

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (!state.isOpen && !["ArrowDown", "ArrowUp"].includes(e.key)) return;

        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setState((prev) => ({
              ...prev,
              highlightedIndex:
                prev.highlightedIndex < prev.items.length - 1
                  ? prev.highlightedIndex + 1
                  : 0,
              isOpen: true,
            }));
            break;

          case "ArrowUp":
            e.preventDefault();
            setState((prev) => ({
              ...prev,
              highlightedIndex:
                prev.highlightedIndex > 0
                  ? prev.highlightedIndex - 1
                  : prev.items.length - 1,
            }));
            break;

          case "Enter":
            e.preventDefault();
            if (
              state.highlightedIndex >= 0 &&
              state.items[state.highlightedIndex]
            ) {
              handleItemSelect(state.items[state.highlightedIndex]);
            }
            break;

          case "Escape":
            setState((prev) => ({
              ...prev,
              isOpen: false,
              highlightedIndex: -1,
            }));
            inputRef.current?.blur();
            break;

          case "Tab":
            setState((prev) => ({ ...prev, isOpen: false }));
            break;
        }
      },
      [state.isOpen, state.highlightedIndex, state.items, handleItemSelect]
    );

    // Handle clear
    const handleClear = useCallback(() => {
      setState((prev) => ({
        ...prev,
        query: "",
        items: [],
        selectedItems: [],
        isOpen: false,
        highlightedIndex: -1,
        error: null,
      }));
      debouncedSearch.cancel();
    }, [debouncedSearch]);

    // Scroll highlighted item into view
    useEffect(() => {
      if (state.highlightedIndex >= 0 && listRef.current) {
        const highlightedElement = listRef.current.children[
          state.highlightedIndex
        ] as HTMLElement;
        if (highlightedElement) {
          highlightedElement.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
          });
        }
      }
    }, [state.highlightedIndex]);

    // Handle composition events (for IME support)
    const handleCompositionStart = () => {
      compositionRef.current = true;
    };

    const handleCompositionEnd = (
      e: React.CompositionEvent<HTMLInputElement>
    ) => {
      compositionRef.current = false;
      handleQueryChange(e.currentTarget.value);
    };

    // Generate unique IDs
    const listboxId = useMemo(
      () => `${inputId || "autocomplete"}-listbox`,
      [inputId]
    );
    const activeDescendant =
      state.highlightedIndex >= 0
        ? `${listboxId}-option-${state.highlightedIndex}`
        : undefined;

    return (
      <div
        className={`autocomplete ${className}`}
        role="combobox"
        aria-expanded={state.isOpen}
      >
        {/* Input */}
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={state.query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setState((prev) => ({ ...prev, isOpen: prev.items.length > 0 }));
            onFocus?.();
          }}
          onBlur={(e) => {
            // Delay hiding to allow for click selection
            setTimeout(() => {
              setState((prev) => ({ ...prev, isOpen: false }));
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
          <div
            className="autocomplete-selected"
            role="group"
            aria-label="Selected items"
          >
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
                    setState((prev) => ({
                      ...prev,
                      selectedItems: prev.selectedItems.filter(
                        (selected) => getItemKey(selected) !== getItemKey(item)
                      ),
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
              <li
                role="status"
                aria-live="polite"
                className="autocomplete-loading"
              >
                {renderLoading ? renderLoading() : "Loading..."}
              </li>
            )}

            {state.error && (
              <li role="alert" className="autocomplete-error">
                {renderError ? renderError(state.error) : "An error occurred"}
              </li>
            )}

            {!state.isLoading && !state.error && state.items.length === 0 && (
              <li className="autocomplete-no-results">
                {renderNoResults ? renderNoResults() : "No results found"}
              </li>
            )}

            {!state.isLoading &&
              !state.error &&
              state.items.map((item, index) => (
                <li
                  key={getItemKey(item)}
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={index === state.highlightedIndex}
                  className={`autocomplete-item ${
                    index === state.highlightedIndex
                      ? "autocomplete-item--highlighted"
                      : ""
                  }`}
                  onClick={() => handleItemSelect(item)}
                  onMouseEnter={() =>
                    setState((prev) => ({ ...prev, highlightedIndex: index }))
                  }
                >
                  {renderItem
                    ? renderItem(item, index === state.highlightedIndex)
                    : getItemValue(item)}
                </li>
              ))}
          </ul>
        )}
      </div>
    );
  }
);

const BasicExample = () => {
  const searchUsers = async (query: string) => {
    return Promise.resolve([
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" },
      { id: 3, name: "Alice Johnson" },
      { id: 4, name: "Bob Brown" },
      { id: 5, name: "Charlie Davis" },
      { id: 6, name: "David Wilson" },
      { id: 7, name: "Eve Johnson" },
      { id: 8, name: "Frank Brown" },
      { id: 9, name: "Grace Davis" },
      { id: 10, name: "Hannah Wilson" },
      { id: 11, name: "Isaac Davis" },
      { id: 12, name: "Jack Brown" },
      { id: 13, name: "Jill Davis" },
      { id: 14, name: "John Wilson" },
      { id: 15, name: "Jane Johnson" },
      { id: 16, name: "Alice Brown" },
      { id: 17, name: "Bob Davis" },
      { id: 18, name: "Charlie Wilson" },
      { id: 19, name: "David Johnson" },
      { id: 20, name: "Eve Brown" },
    ]);
  };

  return (
    <Autocomplete
      onSearch={searchUsers}
      onSelect={(user) => console.log("Selected:", user)}
      getItemValue={(user) => user.name}
      getItemKey={(user) => user.id}
      placeholder="Search users..."
    />
  );
};

export default BasicExample;
