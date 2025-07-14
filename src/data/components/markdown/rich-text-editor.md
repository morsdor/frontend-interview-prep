# Rich Text Editor Component Design

## Component Overview

A production-ready Rich Text Editor (RTE) component with plugin architecture, real-time collaboration support, and comprehensive accessibility features.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    RichTextEditor                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │   Toolbar       │  │   PluginSystem  │  │  History    │  │
│  │   Manager       │  │   Manager       │  │  Manager    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │   Selection     │  │   Document      │  │  Renderer   │  │
│  │   Manager       │  │   Model         │  │  Manager    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │   Collaboration │  │   Serialization │  │  A11y       │  │
│  │   Manager       │  │   Manager       │  │  Manager    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Core API Design

### Main Component Interface

```typescript
interface RichTextEditorProps {
  // Core props
  value?: DocumentModel;
  onChange?: (value: DocumentModel) => void;
  onSelectionChange?: (selection: Selection) => void;
  
  // Configuration
  config?: EditorConfig;
  plugins?: Plugin[];
  theme?: Theme;
  
  // Collaboration
  collaborationProvider?: CollaborationProvider;
  
  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
  
  // Performance
  virtualScrolling?: boolean;
  debounceMs?: number;
  
  // Callbacks
  onMount?: (editor: EditorInstance) => void;
  onError?: (error: EditorError) => void;
}

interface EditorConfig {
  toolbar?: ToolbarConfig;
  shortcuts?: ShortcutConfig;
  validation?: ValidationConfig;
  serialization?: SerializationConfig;
  collaboration?: CollaborationConfig;
  accessibility?: AccessibilityConfig;
}
```

### Document Model

```typescript
interface DocumentModel {
  id: string;
  version: number;
  nodes: DocumentNode[];
  metadata?: Record<string, any>;
}

interface DocumentNode {
  id: string;
  type: NodeType;
  attributes?: Record<string, any>;
  children?: DocumentNode[];
  text?: string;
}

type NodeType = 
  | 'paragraph'
  | 'heading'
  | 'list'
  | 'listItem'
  | 'blockquote'
  | 'codeBlock'
  | 'image'
  | 'table'
  | 'link'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'code';
```

### Plugin System

```typescript
interface Plugin {
  name: string;
  version: string;
  dependencies?: string[];
  
  // Lifecycle hooks
  onMount?: (editor: EditorInstance) => void;
  onUnmount?: (editor: EditorInstance) => void;
  
  // Document transformation
  transformDocument?: (doc: DocumentModel) => DocumentModel;
  
  // Commands
  commands?: Record<string, CommandHandler>;
  
  // UI components
  toolbarButtons?: ToolbarButton[];
  contextMenuItems?: ContextMenuItem[];
  
  // Serialization
  serializers?: Record<string, Serializer>;
  deserializers?: Record<string, Deserializer>;
}

interface CommandHandler {
  execute: (editor: EditorInstance, args?: any) => void;
  canExecute?: (editor: EditorInstance) => boolean;
  shortcut?: string;
}
```

## Low-Level Implementation

### Core Editor Class

```typescript
class RichTextEditor {
  private container: HTMLElement;
  private document: DocumentModel;
  private selection: SelectionManager;
  private history: HistoryManager;
  private plugins: PluginManager;
  private collaboration: CollaborationManager;
  private renderer: RendererManager;
  private eventBus: EventBus;
  
  constructor(container: HTMLElement, props: RichTextEditorProps) {
    this.container = container;
    this.initializeManagers(props);
    this.setupEventListeners();
    this.render();
  }
  
  // Core methods
  public insertText(text: string): void {
    const operation = this.createInsertTextOperation(text);
    this.executeOperation(operation);
  }
  
  public formatText(format: TextFormat): void {
    const operation = this.createFormatOperation(format);
    this.executeOperation(operation);
  }
  
  public insertNode(node: DocumentNode): void {
    const operation = this.createInsertNodeOperation(node);
    this.executeOperation(operation);
  }
  
  private executeOperation(operation: Operation): void {
    // Apply operation
    this.document = this.applyOperation(this.document, operation);
    
    // Update history
    this.history.push(operation);
    
    // Broadcast to collaboration
    this.collaboration.broadcast(operation);
    
    // Re-render
    this.renderer.render(this.document);
    
    // Emit change event
    this.eventBus.emit('change', this.document);
  }
}
```

### Selection Management

```typescript
class SelectionManager {
  private currentSelection: EditorSelection | null = null;
  private selectionObserver: MutationObserver;
  
  constructor(private editor: RichTextEditor) {
    this.setupSelectionTracking();
  }
  
  private setupSelectionTracking(): void {
    // Track DOM selection changes
    document.addEventListener('selectionchange', this.handleSelectionChange);
    
    // Track programmatic changes
    this.selectionObserver = new MutationObserver(this.handleMutation);
  }
  
  public setSelection(selection: EditorSelection): void {
    this.currentSelection = selection;
    this.syncDOMSelection();
    this.editor.emit('selectionChange', selection);
  }
  
  private syncDOMSelection(): void {
    if (!this.currentSelection) return;
    
    const range = this.selectionToRange(this.currentSelection);
    const domSelection = window.getSelection();
    domSelection?.removeAllRanges();
    domSelection?.addRange(range);
  }
  
  private handleSelectionChange = (): void => {
    const domSelection = window.getSelection();
    if (!domSelection || domSelection.rangeCount === 0) return;
    
    const range = domSelection.getRangeAt(0);
    const editorSelection = this.rangeToSelection(range);
    
    if (!this.isSelectionEqual(editorSelection, this.currentSelection)) {
      this.currentSelection = editorSelection;
      this.editor.emit('selectionChange', editorSelection);
    }
  };
}
```

### History Management (Undo/Redo)

```typescript
class HistoryManager {
  private undoStack: Operation[] = [];
  private redoStack: Operation[] = [];
  private maxHistorySize: number = 100;
  private batchingTimeout: number | null = null;
  private currentBatch: Operation[] = [];
  
  public push(operation: Operation): void {
    // Batch rapid operations
    if (this.shouldBatch(operation)) {
      this.currentBatch.push(operation);
      this.scheduleBatchCommit();
      return;
    }
    
    this.commitCurrentBatch();
    this.addToUndoStack(operation);
  }
  
  public undo(): Operation | null {
    this.commitCurrentBatch();
    
    const operation = this.undoStack.pop();
    if (operation) {
      this.redoStack.push(operation);
      return this.invertOperation(operation);
    }
    return null;
  }
  
  public redo(): Operation | null {
    const operation = this.redoStack.pop();
    if (operation) {
      this.undoStack.push(operation);
      return operation;
    }
    return null;
  }
  
  private shouldBatch(operation: Operation): boolean {
    // Batch text insertions and deletions
    return operation.type === 'insert-text' || operation.type === 'delete-text';
  }
  
  private scheduleBatchCommit(): void {
    if (this.batchingTimeout) {
      clearTimeout(this.batchingTimeout);
    }
    
    this.batchingTimeout = setTimeout(() => {
      this.commitCurrentBatch();
    }, 500);
  }
  
  private commitCurrentBatch(): void {
    if (this.currentBatch.length > 0) {
      const batchOperation = this.createBatchOperation(this.currentBatch);
      this.addToUndoStack(batchOperation);
      this.currentBatch = [];
    }
    
    if (this.batchingTimeout) {
      clearTimeout(this.batchingTimeout);
      this.batchingTimeout = null;
    }
  }
}
```

### Collaboration System

```typescript
class CollaborationManager {
  private provider: CollaborationProvider;
  private operationalTransform: OperationalTransform;
  private clientId: string;
  private documentVersion: number = 0;
  
  constructor(provider: CollaborationProvider, editor: RichTextEditor) {
    this.provider = provider;
    this.operationalTransform = new OperationalTransform();
    this.clientId = this.generateClientId();
    this.setupProviderListeners();
  }
  
  public broadcast(operation: Operation): void {
    const collaborativeOperation: CollaborativeOperation = {
      ...operation,
      clientId: this.clientId,
      version: this.documentVersion,
      timestamp: Date.now()
    };
    
    this.provider.broadcast(collaborativeOperation);
  }
  
  private handleRemoteOperation = (operation: CollaborativeOperation): void => {
    if (operation.clientId === this.clientId) return;
    
    // Transform operation against local operations
    const transformedOperation = this.operationalTransform.transform(
      operation,
      this.getLocalOperationsSince(operation.version)
    );
    
    // Apply transformed operation
    this.editor.applyOperation(transformedOperation, { remote: true });
    
    // Update document version
    this.documentVersion = Math.max(this.documentVersion, operation.version) + 1;
  };
  
  private setupProviderListeners(): void {
    this.provider.on('operation', this.handleRemoteOperation);
    this.provider.on('userJoin', this.handleUserJoin);
    this.provider.on('userLeave', this.handleUserLeave);
    this.provider.on('disconnect', this.handleDisconnect);
  }
}
```

### Accessibility Implementation

```typescript
class AccessibilityManager {
  private editor: RichTextEditor;
  private announcer: HTMLElement;
  private shortcuts: Map<string, () => void>;
  
  constructor(editor: RichTextEditor) {
    this.editor = editor;
    this.setupAnnouncer();
    this.setupKeyboardShortcuts();
    this.setupAriaAttributes();
  }
  
  private setupAnnouncer(): void {
    this.announcer = document.createElement('div');
    this.announcer.setAttribute('aria-live', 'polite');
    this.announcer.setAttribute('aria-atomic', 'true');
    this.announcer.style.position = 'absolute';
    this.announcer.style.left = '-10000px';
    this.announcer.style.width = '1px';
    this.announcer.style.height = '1px';
    this.announcer.style.overflow = 'hidden';
    document.body.appendChild(this.announcer);
  }
  
  public announce(message: string): void {
    this.announcer.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      this.announcer.textContent = '';
    }, 1000);
  }
  
  private setupKeyboardShortcuts(): void {
    this.shortcuts = new Map([
      ['Alt+F10', () => this.focusToolbar()],
      ['Escape', () => this.exitToolbar()],
      ['Ctrl+/', () => this.showShortcutHelp()],
      ['Ctrl+Alt+H', () => this.announceHeadingLevel()],
      ['Ctrl+Alt+L', () => this.announceListInfo()],
      ['Ctrl+Alt+T', () => this.announceTableInfo()],
    ]);
  }
  
  private focusToolbar(): void {
    const toolbar = this.editor.getToolbar();
    const firstButton = toolbar.querySelector('[role="button"]');
    if (firstButton) {
      (firstButton as HTMLElement).focus();
      this.announce('Toolbar focused. Use arrow keys to navigate.');
    }
  }
  
  private announceHeadingLevel(): void {
    const selection = this.editor.getSelection();
    const headingLevel = this.getHeadingLevel(selection);
    
    if (headingLevel) {
      this.announce(`Heading level ${headingLevel}`);
    } else {
      this.announce('Not in heading');
    }
  }
}
```

## Key Technical Decisions

### 1. Document Model Design
- **Immutable document structure** for predictable state management
- **Operational Transform** for real-time collaboration
- **Plugin-based node types** for extensibility

### 2. Performance Optimizations
- **Virtual scrolling** for large documents
- **Debounced operations** to prevent excessive re-renders
- **Incremental parsing** for large paste operations
- **Web Workers** for heavy computations

### 3. Browser Compatibility
- **contentEditable** abstraction layer
- **Selection API** normalization
- **Clipboard API** with fallbacks
- **Input Method Editor (IME)** support

## Interview Questions & Answers

### Q1: How do you handle the complexity of contentEditable and its cross-browser inconsistencies?

**Answer:**
I implement an abstraction layer that isolates the contentEditable complexity:

1. **Virtual Document Model**: Instead of directly manipulating the DOM, I maintain a virtual document model that represents the editor's state. This provides a consistent API regardless of browser differences.

2. **Operation-Based Architecture**: All changes go through a standardized operation system (insert, delete, format, etc.) that gets translated to DOM manipulations. This ensures consistent behavior across browsers.

3. **Selection Normalization**: I normalize selection handling by converting between DOM ranges and logical document positions, accounting for browser-specific selection behaviors.

4. **Event Abstraction**: Raw DOM events are processed through normalization layers that handle browser-specific quirks like different key codes, composition events, and paste behaviors.

**Example implementation:**
```typescript
class ContentEditableManager {
  private normalizeSelection(domRange: Range): LogicalSelection {
    // Convert DOM range to logical position
    const startPos = this.domPositionToLogical(domRange.startContainer, domRange.startOffset);
    const endPos = this.domPositionToLogical(domRange.endContainer, domRange.endOffset);
    return { start: startPos, end: endPos };
  }
  
  private applyOperation(operation: Operation): void {
    // Apply operation to virtual model first
    this.document = this.operationApplier.apply(this.document, operation);
    
    // Then sync DOM efficiently
    this.syncDOMWithModel();
  }
}
```

### Q2: How do you implement efficient undo/redo functionality?

**Answer:**
I implement a sophisticated history system with operation batching and memory management:

1. **Operation Batching**: Rapid text insertions are batched together to create meaningful undo units. For example, typing "hello" creates one undo operation, not five separate character insertions.

2. **Invertible Operations**: Each operation can be inverted to create its undo counterpart. Complex operations are decomposed into atomic, invertible operations.

3. **Memory Management**: The history stack has a configurable size limit and automatically garbage collects old operations to prevent memory leaks.

4. **Branching History**: When users undo and then make new changes, I maintain a branching history that allows them to navigate between different timeline branches.

**Technical implementation:**
```typescript
class HistoryManager {
  private createInverseOperation(operation: Operation): Operation {
    switch (operation.type) {
      case 'insert-text':
        return {
          type: 'delete-text',
          position: operation.position,
          length: operation.text.length
        };
      case 'format-text':
        return {
          type: 'format-text',
          selection: operation.selection,
          format: this.invertFormat(operation.format)
        };
    }
  }
  
  private shouldBatch(op1: Operation, op2: Operation): boolean {
    return op1.type === 'insert-text' && 
           op2.type === 'insert-text' && 
           op1.position + op1.text.length === op2.position &&
           Date.now() - op1.timestamp < 500; // 500ms batching window
  }
}
```

### Q3: How do you ensure the editor is accessible to users with disabilities?

**Answer:**
Accessibility is built into the core architecture through multiple layers:

1. **Semantic HTML Structure**: The editor uses proper ARIA roles and maintains a logical heading hierarchy. Rich text elements are announced correctly by screen readers.

2. **Keyboard Navigation**: Complete keyboard accessibility with standard shortcuts (Ctrl+B for bold, Alt+F10 for toolbar) and custom navigation commands for complex structures like tables.

3. **Screen Reader Integration**: Live announcements for formatting changes, document structure navigation, and collaborative user actions.

4. **Focus Management**: Clear focus indicators and logical tab order, with the ability to navigate between editor, toolbar, and other UI elements.

**Key implementation details:**
```typescript
class AccessibilityManager {
  private setupStructuralNavigation(): void {
    // Allow navigation by headings
    this.addShortcut('Ctrl+Alt+H', () => this.navigateToNextHeading());
    
    // Table navigation
    this.addShortcut('Ctrl+Alt+→', () => this.navigateTableCell('right'));
    this.addShortcut('Ctrl+Alt+↓', () => this.navigateTableCell('down'));
    
    // Announce formatting changes
    this.editor.on('formatChange', (format) => {
      this.announce(`Applied ${format.name} formatting`);
    });
  }
  
  private updateAriaAttributes(): void {
    const selection = this.editor.getSelection();
    const formats = this.getActiveFormats(selection);
    
    this.editorElement.setAttribute('aria-label', 
      `Rich text editor. Current formatting: ${formats.join(', ')}`);
  }
}
```

### Q4: How do you handle real-time collaboration with multiple users?

**Answer:**
Real-time collaboration is implemented using Operational Transformation (OT) with conflict resolution:

1. **Operational Transform**: Each user's operations are transformed against concurrent operations from other users to maintain document consistency.

2. **Vector Clocks**: Each client maintains a vector clock to track the causal relationship between operations and ensure proper ordering.

3. **Conflict Resolution**: When conflicts occur, I use a deterministic resolution strategy based on operation timestamps and client IDs.

4. **Presence Indicators**: Real-time cursor positions and user selections are shared to provide visual feedback about other users' activities.

**Technical architecture:**
```typescript
class CollaborationManager {
  private transformOperation(localOp: Operation, remoteOp: Operation): Operation {
    // Transform local operation against remote operation
    if (localOp.type === 'insert-text' && remoteOp.type === 'insert-text') {
      if (localOp.position <= remoteOp.position) {
        return localOp; // No change needed
      } else {
        return {
          ...localOp,
          position: localOp.position + remoteOp.text.length
        };
      }
    }
    
    if (localOp.type === 'delete-text' && remoteOp.type === 'insert-text') {
      if (localOp.position <= remoteOp.position) {
        return localOp;
      } else {
        return {
          ...localOp,
          position: localOp.position + remoteOp.text.length
        };
      }
    }
    
    // Handle all operation type combinations...
  }
  
  private handleRemoteOperation(operation: CollaborativeOperation): void {
    // Transform against all pending local operations
    const transformedOp = this.transformAgainstLocalOperations(operation);
    
    // Apply to document
    this.editor.applyOperation(transformedOp, { fromRemote: true });
    
    // Update presence information
    this.updateUserPresence(operation.clientId, operation.selection);
  }
}
```

### Q5: How do you optimize performance for large documents?

**Answer:**
Performance optimization involves several strategies working together:

1. **Virtual Scrolling**: Only render visible portions of large documents, dynamically loading content as users scroll.

2. **Incremental Parsing**: Large paste operations are parsed incrementally using requestIdleCallback to avoid blocking the main thread.

3. **Debounced Operations**: Rapid operations are debounced to prevent excessive re-renders while maintaining responsiveness.

4. **Web Workers**: Heavy computations like spell checking, formatting, and large document processing are offloaded to Web Workers.

**Implementation example:**
```typescript
class PerformanceManager {
  private setupVirtualScrolling(): void {
    this.virtualScroller = new VirtualScroller({
      container: this.editorContainer,
      itemHeight: this.estimateLineHeight(),
      renderItem: this.renderDocumentLine,
      totalItems: this.document.getLineCount()
    });
  }
  
  private async handleLargePaste(content: string): Promise<void> {
    const CHUNK_SIZE = 10000; // Process 10k characters at a time
    
    for (let i = 0; i < content.length; i += CHUNK_SIZE) {
      const chunk = content.slice(i, i + CHUNK_SIZE);
      
      // Process chunk in next idle period
      await this.processInIdle(() => {
        this.parseAndInsertChunk(chunk);
      });
      
      // Update progress indicator
      this.updateProgress((i + CHUNK_SIZE) / content.length);
    }
  }
  
  private processInIdle(callback: () => void): Promise<void> {
    return new Promise(resolve => {
      requestIdleCallback(() => {
        callback();
        resolve();
      });
    });
  }
}
```

### Q6: How do you handle complex formatting and nested structures?

**Answer:**
Complex formatting is managed through a hierarchical document model with smart formatting rules:

1. **Tree-Based Document Model**: The document is represented as a tree where each node can have formatting attributes and child nodes.

2. **Format Inheritance**: Child nodes inherit formatting from parents unless explicitly overridden, similar to CSS inheritance.

3. **Smart Formatting Resolution**: When applying conflicting formats, the system uses precedence rules to resolve conflicts intelligently.

4. **Nested Structure Validation**: The system validates that nested structures (like lists within blockquotes) follow proper HTML semantics.

**Technical implementation:**
```typescript
class FormattingManager {
  private applyFormat(selection: Selection, format: Format): void {
    const affectedNodes = this.getNodesInSelection(selection);
    
    for (const node of affectedNodes) {
      if (this.canApplyFormat(node, format)) {
        this.applyFormatToNode(node, format);
      } else {
        // Split node if partial selection
        this.splitNodeAndApplyFormat(node, selection, format);
      }
    }
    
    // Cleanup redundant formatting
    this.cleanupRedundantFormatting(selection);
  }
  
  private resolveFormatConflicts(existing: Format[], newFormat: Format): Format[] {
    const conflictResolver = this.formatConflictResolvers.get(newFormat.type);
    return conflictResolver ? conflictResolver(existing, newFormat) : [...existing, newFormat];
  }
  
  private validateNestedStructure(node: DocumentNode): boolean {
    // Validate that nested structures follow HTML semantics
    const allowedChildren = this.getAllowedChildTypes(node.type);
    return node.children?.every(child => allowedChildren.includes(child.type)) ?? true;
  }
}
```

### Q7: How do you implement the plugin system architecture?

**Answer:**
The plugin system is designed for maximum flexibility and isolation:

1. **Plugin Lifecycle Management**: Plugins have well-defined lifecycle hooks (mount, unmount, update) and can register cleanup functions.

2. **Command System**: Plugins register commands that can be invoked programmatically or through UI actions, with proper permission checking.

3. **Event System**: A comprehensive event system allows plugins to communicate without tight coupling.

4. **API Surface**: Plugins access editor functionality through a controlled API that maintains backwards compatibility.

**Architecture implementation:**
```typescript
class PluginManager {
  private plugins: Map<string, PluginInstance> = new Map();
  private commandRegistry: Map<string, CommandHandler> = new Map();
  private eventBus: EventBus = new EventBus();
  
  public registerPlugin(plugin: Plugin): void {
    // Validate plugin dependencies
    this.validateDependencies(plugin);
    
    // Create plugin instance with sandboxed API
    const instance = new PluginInstance(plugin, this.createPluginAPI());
    
    // Register plugin commands
    plugin.commands?.forEach((command, name) => {
      this.commandRegistry.set(`${plugin.name}:${name}`, command);
    });
    
    // Mount plugin
    instance.mount();
    
    this.plugins.set(plugin.name, instance);
  }
  
  private createPluginAPI(): PluginAPI {
    return {
      // Safe document access
      getDocument: () => this.editor.getDocument(),
      getSelection: () => this.editor.getSelection(),
      
      // Command execution
      executeCommand: (name: string, args?: any) => {
        const command = this.commandRegistry.get(name);
        if (command && command.canExecute?.(this.editor) !== false) {
          return command.execute(this.editor, args);
        }
        throw new Error(`Cannot execute command: ${name}`);
      },
      
      // Event handling
      on: (event: string, handler: Function) => this.eventBus.on(event, handler),
      emit: (event: string, data?: any) => this.eventBus.emit(event, data),
      
      // UI registration
      addToolbarButton: (button: ToolbarButton) => this.toolbar.addButton(button),
      addContextMenuItem: (item: ContextMenuItem) => this.contextMenu.addItem(item)
    };
  }
}
```

### Q8: How do you handle mobile-specific challenges?

**Answer:**
Mobile editing presents unique challenges that require specialized solutions:

1. **Touch Selection**: Implement custom touch handles for text selection since mobile browsers have inconsistent selection APIs.

2. **Virtual Keyboard**: Handle virtual keyboard appearance/disappearance and adjust the editor viewport accordingly.

3. **Input Method Editors (IME)**: Support for complex input methods used in Asian languages with proper composition event handling.

4. **Performance**: Optimize for mobile performance with reduced DOM manipulation and efficient touch event handling.

**Mobile-specific implementation:**
```typescript
class MobileManager {
  private setupTouchSelection(): void {
    let touchStartPos: Position | null = null;
    
    this.editor.on('touchstart', (e: TouchEvent) => {
      touchStartPos = this.getPositionFromTouch(e.touches[0]);
    });
    
    this.editor.on('touchmove', (e: TouchEvent) => {
      if (touchStartPos) {
        const currentPos = this.getPositionFromTouch(e.touches[0]);
        const selection = this.createSelection(touchStartPos, currentPos);
        this.editor.setSelection(selection);
        
        // Show custom selection handles
        this.showSelectionHandles(selection);
      }
    });
  }
  
  private handleVirtualKeyboard(): void {
    const initialViewportHeight = window.innerHeight;
    
    window.addEventListener('resize', () => {
      const currentHeight = window.innerHeight;
      const keyboardHeight = initialViewportHeight - currentHeight;
      
      if (keyboardHeight > 100) { // Keyboard appeared
        this.adjustEditorForKeyboard(keyboardHeight);
      } else { // Keyboard disappeared
        this.resetEditorViewport();
      }
    });
  }
  
  private setupIMESupport(): void {
    this.editor.on('compositionstart', () => {
      this.isComposing = true;
      this.compositionStart = this.editor.getSelection();
    });
    
    this.editor.on('compositionend', (e: CompositionEvent) => {
      this.isComposing = false;
      this.handleCompositionText(e.data);
    });
  }
}
```

### Q9: How do you implement efficient copy/paste functionality?

**Answer:**
Copy/paste handling requires careful attention to data formats and cross-application compatibility:

1. **Multi-Format Support**: Support multiple clipboard formats (HTML, plain text, RTF) to maintain formatting when pasting between applications.

2. **Smart Paste**: Analyze pasted content and apply appropriate formatting based on context and user preferences.

3. **Large Content Handling**: Stream large paste operations to avoid blocking the UI.

4. **Security**: Sanitize pasted HTML to prevent XSS attacks while preserving legitimate formatting.

**Implementation details:**
```typescript
class ClipboardManager {
  public async handleCopy(selection: Selection): Promise<void> {
    const selectedContent = this.getSelectedContent(selection);
    
    // Prepare multiple formats
    const formats = {
      'text/plain': this.serializeToText(selectedContent),
      'text/html': this.serializeToHTML(selectedContent),
      'text/rtf': this.serializeToRTF(selectedContent),
      'application/json': JSON.stringify(selectedContent) // Custom format
    };
    
    // Use modern Clipboard API if available
    if (navigator.clipboard && navigator.clipboard.write) {
      const clipboardItems = Object.entries(formats).map(([type, data]) => 
        new ClipboardItem({ [type]: new Blob([data], { type }) })
      );
      
      await navigator.clipboard.write(clipboardItems);
    } else {
      // Fallback to legacy clipboard
      this.legacyCopyToClipboard(formats['text/html']);
    }
  }
  
  public async handlePaste(e: ClipboardEvent): Promise<void> {
    e.preventDefault();
    
    const clipboardData = e.clipboardData || (window as any).clipboardData;
    
    // Try
    
