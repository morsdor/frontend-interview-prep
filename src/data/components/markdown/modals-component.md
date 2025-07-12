# Modal/Dialog System - Senior UI Developer Interview

## 1. Component Architecture & API Design

### Core Components Structure
```
ModalSystem/
├── Modal.tsx              # Main modal component
├── ModalProvider.tsx      # Context provider for modal management
├── ModalStack.tsx         # Stack management for multiple modals
├── FocusTrap.tsx         # Focus management utility
├── Portal.tsx            # Portal rendering utility
├── useModal.ts           # Hook for modal operations
├── useKeyboardHandler.ts  # Keyboard event management
└── types.ts              # TypeScript definitions
```

### API Design

#### Modal Component Props
```typescript
interface ModalProps {
  // Core props
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  
  // Behavioral props
  closeOnBackdropClick?: boolean;
  closeOnEscapeKey?: boolean;
  preventScroll?: boolean;
  
  // Styling props
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'alert' | 'confirmation';
  className?: string;
  backdropClassName?: string;
  
  // Animation props
  animation?: 'fade' | 'slide' | 'scale' | 'none';
  animationDuration?: number;
  
  // Accessibility props
  ariaLabel?: string;
  ariaDescribedBy?: string;
  role?: 'dialog' | 'alertdialog';
  
  // Advanced props
  zIndex?: number;
  portalTarget?: Element;
  onAnimationComplete?: () => void;
  
  // Stacking props
  stackBehavior?: 'replace' | 'stack' | 'queue';
  modalId?: string;
}
```

#### useModal Hook API
```typescript
interface UseModalReturn {
  // State
  isOpen: boolean;
  
  // Actions
  openModal: (config?: ModalConfig) => void;
  closeModal: () => void;
  toggleModal: () => void;
  
  // Stack management
  openStackedModal: (config: ModalConfig) => string;
  closeStackedModal: (modalId: string) => void;
  closeAllModals: () => void;
  
  // State queries
  getStackCount: () => number;
  isTopModal: (modalId: string) => boolean;
}
```

## 2. Core Implementation

### Modal Component
```typescript
import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FocusTrap } from './FocusTrap';
import { useKeyboardHandler } from './useKeyboardHandler';
import { ModalProps } from './types';

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  closeOnBackdropClick = true,
  closeOnEscapeKey = true,
  preventScroll = true,
  size = 'md',
  variant = 'default',
  className,
  backdropClassName,
  animation = 'fade',
  animationDuration = 300,
  ariaLabel,
  ariaDescribedBy,
  role = 'dialog',
  zIndex = 1000,
  portalTarget,
  onAnimationComplete,
  stackBehavior = 'replace',
  modalId,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);

  // Handle escape key
  useKeyboardHandler({
    key: 'Escape',
    handler: closeOnEscapeKey ? onClose : undefined,
    enabled: isOpen,
  });

  // Handle body scroll lock
  useEffect(() => {
    if (!preventScroll) return;

    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, preventScroll]);

  // Handle animation lifecycle
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsAnimating(true);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onAnimationComplete?.();
      }, animationDuration);
      
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsAnimating(false);
        onAnimationComplete?.();
      }, animationDuration);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, animationDuration, onAnimationComplete]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === backdropRef.current) {
      onClose();
    }
  }, [closeOnBackdropClick, onClose]);

  if (!shouldRender) return null;

  const modalContent = (
    <div
      ref={backdropRef}
      className={`modal-backdrop ${backdropClassName || ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        opacity: isOpen && !isAnimating ? 1 : 0,
        transition: `opacity ${animationDuration}ms ease`,
      }}
      onClick={handleBackdropClick}
    >
      <div
        className={`modal-container modal-container--${size} ${className || ''}`}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) ${getAnimationTransform(animation, isOpen, isAnimating)}`,
          transition: `transform ${animationDuration}ms ease, opacity ${animationDuration}ms ease`,
          opacity: isOpen && !isAnimating ? 1 : 0,
        }}
      >
        <FocusTrap enabled={isOpen}>
          <div
            ref={modalRef}
            role={role}
            aria-modal="true"
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            className={`modal-content modal-content--${variant}`}
            tabIndex={-1}
          >
            {children}
          </div>
        </FocusTrap>
      </div>
    </div>
  );

  return createPortal(
    modalContent,
    portalTarget || document.body
  );
};

// Animation helper
const getAnimationTransform = (animation: string, isOpen: boolean, isAnimating: boolean) => {
  if (!isAnimating) return '';
  
  switch (animation) {
    case 'scale':
      return isOpen ? 'scale(0.8)' : 'scale(1.1)';
    case 'slide':
      return isOpen ? 'translateY(-20px)' : 'translateY(20px)';
    default:
      return '';
  }
};
```

### Focus Trap Implementation
```typescript
import React, { useRef, useEffect } from 'react';

interface FocusTrapProps {
  enabled: boolean;
  children: React.ReactNode;
  autoFocus?: boolean;
  restoreFocus?: boolean;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({
  enabled,
  children,
  autoFocus = true,
  restoreFocus = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Store the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    if (!container) return;

    // Get all focusable elements
    const getFocusableElements = (): HTMLElement[] => {
      const selectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]',
      ];
      
      return Array.from(container.querySelectorAll(selectors.join(', '))) as HTMLElement[];
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Auto focus first element
    if (autoFocus) {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Restore focus to previously focused element
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [enabled, autoFocus, restoreFocus]);

  return <div ref={containerRef}>{children}</div>;
};
```

### Modal Provider & Stack Management
```typescript
import React, { createContext, useContext, useReducer, useCallback } from 'react';

interface ModalState {
  modals: Array<{
    id: string;
    config: ModalConfig;
    isOpen: boolean;
  }>;
  activeModalId: string | null;
}

interface ModalConfig {
  component: React.ComponentType<any>;
  props: any;
  options: {
    closeOnBackdropClick?: boolean;
    closeOnEscapeKey?: boolean;
    stackBehavior?: 'replace' | 'stack' | 'queue';
  };
}

type ModalAction = 
  | { type: 'OPEN_MODAL'; payload: { id: string; config: ModalConfig } }
  | { type: 'CLOSE_MODAL'; payload: { id: string } }
  | { type: 'CLOSE_ALL_MODALS' }
  | { type: 'SET_ACTIVE_MODAL'; payload: { id: string } };

const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
  switch (action.type) {
    case 'OPEN_MODAL':
      const { id, config } = action.payload;
      
      if (config.options.stackBehavior === 'replace') {
        return {
          modals: [{ id, config, isOpen: true }],
          activeModalId: id,
        };
      }
      
      return {
        modals: [...state.modals, { id, config, isOpen: true }],
        activeModalId: id,
      };
      
    case 'CLOSE_MODAL':
      const modalsCopy = state.modals.filter(modal => modal.id !== action.payload.id);
      return {
        modals: modalsCopy,
        activeModalId: modalsCopy[modalsCopy.length - 1]?.id || null,
      };
      
    case 'CLOSE_ALL_MODALS':
      return {
        modals: [],
        activeModalId: null,
      };
      
    default:
      return state;
  }
};

const ModalContext = createContext<{
  state: ModalState;
  openModal: (config: ModalConfig) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
} | null>(null);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(modalReducer, {
    modals: [],
    activeModalId: null,
  });

  const openModal = useCallback((config: ModalConfig): string => {
    const id = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    dispatch({ type: 'OPEN_MODAL', payload: { id, config } });
    return id;
  }, []);

  const closeModal = useCallback((id: string) => {
    dispatch({ type: 'CLOSE_MODAL', payload: { id } });
  }, []);

  const closeAllModals = useCallback(() => {
    dispatch({ type: 'CLOSE_ALL_MODALS' });
  }, []);

  return (
    <ModalContext.Provider value={{ state, openModal, closeModal, closeAllModals }}>
      {children}
      <ModalStack modals={state.modals} activeModalId={state.activeModalId} />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
```

## 3. Interview Questions & Answers

### Q1: How would you handle multiple modals stacked on top of each other?

**Answer:** I'd implement a modal stack system with these key features:

1. **Z-index Management**: Each modal gets an incremental z-index (1000, 1001, 1002, etc.)
2. **Focus Management**: Only the top modal receives focus, others are inert
3. **Escape Key Handling**: ESC only closes the top modal
4. **Backdrop Behavior**: Only the top modal's backdrop is interactive
5. **State Management**: Use a reducer to track the modal stack with proper lifecycle

```typescript
// Z-index calculation
const getZIndex = (stackIndex: number) => 1000 + stackIndex * 10;

// Focus management for stacked modals
const isTopModal = (modalId: string, stack: Modal[]) => {
  return stack[stack.length - 1]?.id === modalId;
};
```

### Q2: How do you ensure accessibility compliance for screen readers?

**Answer:** Accessibility is critical for modals:

1. **ARIA Attributes**: 
   - `role="dialog"` or `role="alertdialog"`
   - `aria-modal="true"`
   - `aria-labelledby` and `aria-describedby`

2. **Focus Management**:
   - Trap focus within modal
   - Return focus to trigger element on close
   - Auto-focus first interactive element

3. **Keyboard Navigation**:
   - Tab cycling within modal
   - Escape key to close
   - Support for screen reader navigation

4. **Semantic Structure**:
   - Proper heading hierarchy
   - Descriptive button labels
   - Clear modal purpose

```typescript
// ARIA implementation
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Confirmation</h2>
  <p id="modal-description">Are you sure you want to delete this item?</p>
</div>
```

### Q3: How would you optimize performance for modals with heavy content?

**Answer:** Several optimization strategies:

1. **Lazy Loading**: Only render modal content when opened
2. **Portal Optimization**: Reuse portal containers
3. **Animation Performance**: Use CSS transforms instead of changing layout properties
4. **Memory Management**: Clean up event listeners and timers
5. **Conditional Rendering**: Don't render closed modals in DOM

```typescript
// Lazy loading implementation
const LazyModal = ({ isOpen, children }) => {
  const [hasOpened, setHasOpened] = useState(false);
  
  useEffect(() => {
    if (isOpen && !hasOpened) {
      setHasOpened(true);
    }
  }, [isOpen, hasOpened]);
  
  if (!hasOpened) return null;
  
  return <Modal isOpen={isOpen}>{children}</Modal>;
};
```

### Q4: How do you handle modal animations and transitions?

**Answer:** Animation system with these considerations:

1. **CSS Transitions**: Use CSS for smooth performance
2. **Animation States**: Track entering, entered, exiting, exited states
3. **Cleanup**: Prevent memory leaks with proper cleanup
4. **Accessibility**: Respect `prefers-reduced-motion`

```typescript
// Animation state management
const useModalAnimation = (isOpen: boolean, duration: number) => {
  const [animationState, setAnimationState] = useState<'entering' | 'entered' | 'exiting' | 'exited'>('exited');
  
  useEffect(() => {
    if (isOpen) {
      setAnimationState('entering');
      const timer = setTimeout(() => setAnimationState('entered'), duration);
      return () => clearTimeout(timer);
    } else {
      setAnimationState('exiting');
      const timer = setTimeout(() => setAnimationState('exited'), duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration]);
  
  return animationState;
};
```

### Q5: How would you handle mobile-specific modal behavior?

**Answer:** Mobile requires special considerations:

1. **Responsive Design**: Full-screen on mobile, centered on desktop
2. **Touch Interactions**: Swipe gestures, pull-to-dismiss
3. **Viewport Units**: Use `vh` units carefully, account for mobile browsers
4. **Scroll Behavior**: Prevent background scroll, handle modal content scroll
5. **Safe Areas**: Respect notch areas on modern devices

```typescript
// Mobile-specific styles
const getMobileStyles = (isMobile: boolean) => ({
  position: 'fixed',
  top: isMobile ? 0 : '50%',
  left: isMobile ? 0 : '50%',
  right: isMobile ? 0 : 'auto',
  bottom: isMobile ? 0 : 'auto',
  transform: isMobile ? 'none' : 'translate(-50%, -50%)',
  width: isMobile ? '100vw' : 'auto',
  height: isMobile ? '100vh' : 'auto',
  paddingTop: isMobile ? 'env(safe-area-inset-top)' : 0,
  paddingBottom: isMobile ? 'env(safe-area-inset-bottom)' : 0,
});
```

### Q6: How do you prevent scroll-jacking and maintain scroll position?

**Answer:** Scroll management is crucial for UX:

1. **Body Scroll Lock**: Prevent background scroll when modal is open
2. **Scroll Position**: Save and restore scroll position
3. **Nested Scrolling**: Handle scrollable content within modal
4. **iOS Safari**: Handle iOS-specific scroll issues

```typescript
// Scroll lock implementation
const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (!isLocked) return;
    
    const scrollY = window.scrollY;
    const body = document.body;
    
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    
    return () => {
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, [isLocked]);
};
```

### Q7: How would you implement a confirmation modal pattern?

**Answer:** Confirmation modals need specific UX patterns:

1. **Promise-based API**: Return promises for async handling
2. **Default Actions**: Sensible defaults for common actions
3. **Customization**: Allow custom content and actions
4. **Keyboard Shortcuts**: Enter for confirm, Escape for cancel

```typescript
// Promise-based confirmation
const useConfirmation = () => {
  const { openModal, closeModal } = useModal();
  
  const confirm = useCallback((options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      const modalId = openModal({
        component: ConfirmationModal,
        props: {
          ...options,
          onConfirm: () => {
            closeModal(modalId);
            resolve(true);
          },
          onCancel: () => {
            closeModal(modalId);
            resolve(false);
          },
        },
      });
    });
  }, [openModal, closeModal]);
  
  return { confirm };
};
```

### Q8: How do you test modal components effectively?

**Answer:** Testing strategy for modals:

1. **Integration Tests**: Test modal with real DOM interactions
2. **Accessibility Tests**: Verify ARIA attributes and keyboard navigation
3. **Animation Tests**: Mock timers for animation testing
4. **Focus Testing**: Verify focus management
5. **Portal Testing**: Test rendering in portal

```typescript
// Example test structure
describe('Modal Component', () => {
  it('should trap focus within modal', () => {
    render(<Modal isOpen><button>Test</button></Modal>);
    
    // Tab through and verify focus stays within modal
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(screen.getByRole('button')).toHaveFocus();
  });
  
  it('should close on escape key', () => {
    const onClose = jest.fn();
    render(<Modal isOpen onClose={onClose} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
```

### Q9: How would you handle modal state management in a large application?

**Answer:** Enterprise-level state management:

1. **Global State**: Use Context API or Redux for modal state
2. **Imperative API**: Provide imperative methods for programmatic control
3. **Event System**: Modal events for analytics and logging
4. **Persistence**: Optionally persist modal state across sessions
5. **DevTools**: Development tools for modal debugging

```typescript
// Global modal management
const ModalManager = {
  open: (config: ModalConfig) => store.dispatch(openModal(config)),
  close: (id: string) => store.dispatch(closeModal(id)),
  closeAll: () => store.dispatch(closeAllModals()),
  
  // Event system
  on: (event: string, callback: Function) => eventBus.on(event, callback),
  emit: (event: string, data: any) => eventBus.emit(event, data),
  
  // State queries
  getState: () => store.getState().modals,
  isOpen: (id: string) => store.getState().modals.some(m => m.id === id),
};
```

### Q10: How do you handle modal cleanup and memory leaks?

**Answer:** Proper cleanup is essential:

1. **Effect Cleanup**: Clean up all useEffect hooks
2. **Event Listeners**: Remove all event listeners
3. **Timers**: Clear all setTimeout/setInterval
4. **Refs**: Clear ref values
5. **Subscriptions**: Unsubscribe from external subscriptions

```typescript
// Comprehensive cleanup
const useModalCleanup = (isOpen: boolean) => {
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const listenersRef = useRef<Array<() => void>>([]);
  
  const addTimer = useCallback((timer: NodeJS.Timeout) => {
    timersRef.current.push(timer);
  }, []);
  
  const addListener = useCallback((cleanup: () => void) => {
    listenersRef.current.push(cleanup);
  }, []);
  
  useEffect(() => {
    if (!isOpen) {
      // Clean up all timers
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      
      // Clean up all listeners
      listenersRef.current.forEach(cleanup => cleanup());
      listenersRef.current = [];
    }
  }, [isOpen]);
  
  return { addTimer, addListener };
};
```

## 4. CSS Architecture

```css
/* Base modal styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  position: relative;
}

.modal-container--sm { width: 320px; }
.modal-container--md { width: 480px; }
.modal-container--lg { width: 640px; }
.modal-container--xl { width: 800px; }
.modal-container--full { width: 100vw; height: 100vh; }

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  outline: none;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .modal-container:not(.modal-container--full) {
    width: 100vw;
    height: 100vh;
    max-width: none;
    max-height: none;
  }
  
  .modal-content {
    border-radius: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

/* Animation classes */
.modal-enter {
  opacity: 0;
  transform: scale(0.95);
}

.modal-enter-active {
  opacity: 1;
  transform: scale(1);
  transition: opacity 300ms ease, transform 300ms ease;
}

.modal-exit {
  opacity: 1;
  transform: scale(1);
}

.modal-exit-active {
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 300ms ease, transform 300ms ease;
}
```

## 5. Key Technical Decisions

1. **Portal Rendering**: Using React portals for proper DOM hierarchy
2. **Context API**: For global modal state management
3. **Compound Components**: Flexible API with Modal.Header, Modal.Body, Modal.Footer
4. **TypeScript**: Full type safety with generic props
5. **CSS-in-JS**: Runtime styling for dynamic behavior
6. **Animation Library**: CSS transitions for performance
7. **Testing Strategy**: Integration tests over unit tests
8. **Bundle Size**: Tree-shaking friendly exports

This design provides a production-ready modal system that handles all the complex edge cases while maintaining excellent performance and accessibility standards.