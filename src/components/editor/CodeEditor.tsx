'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { CodeExecution } from './CodeExecution';
import { cn } from '@/lib/utils';

// Dynamically import Monaco Editor with no SSR
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false }
);

type CodeEditorProps = {
  initialCode?: string;
  className?: string;
  onCodeChange?: (code: string) => void;
  onRun?: (code: string) => void;
  onReset?: () => void;
  height?: number | string;
  readOnly?: boolean;
  showRunButton?: boolean;
  showResetButton?: boolean;
  showCopyButton?: boolean;
  showConsole?: boolean;
  showExecutionTime?: boolean;
  showLineNumbers?: boolean;
  language?: string;
  theme?: 'light' | 'dark';
  editorOptions?: any;
  onEditorDidMount?: (editor: any, monaco: any) => void;
  onEditorWillMount?: (monaco: any) => void;
  loading?: React.ReactNode;
  editorClassName?: string;
  outputClassName?: string;
  buttonClassName?: string;
};

export function CodeEditor({
  initialCode = '',
  editorOptions,
  onEditorDidMount,
  onEditorWillMount,
  onCodeChange,
  loading = <div>Loading editor...</div>,
  height = '400px',
  language = 'javascript',
  theme = 'dark',
  readOnly = false,
  showRunButton = true,
  showResetButton = true,
  showCopyButton = true,
  showConsole = true,
  showExecutionTime = true,
  className,
  editorClassName,
  outputClassName,
  buttonClassName,
  onRun,
  onReset,
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [code, setCode] = useState(initialCode);

  // Handle editor mount
  const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    // Configure editor options
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.lineHighlightBackground': '#2a2d2e',
      },
    });

    monaco.editor.setTheme('custom-dark');
    
    // Focus the editor
    editor.focus();
    
    // Call the provided callback if any
    onEditorDidMount?.(editor, monaco);
  }, [onEditorDidMount]);

  // Handle editor will mount
  const handleEditorWillMount = useCallback((monaco: any) => {
    monacoRef.current = monaco;
    
    // Configure TypeScript/JavaScript defaults
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    });
    
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      typeRoots: ['node_modules/@types'],
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      checkJs: true,
    });
    
    // Call the provided callback if any
    onEditorWillMount?.(monaco);
  }, [onEditorWillMount]);

  // Handle code changes
  const handleCodeChange = useCallback((value: string = '') => {
    setCode(value);
    onCodeChange?.(value);
  }, [onCodeChange]);

  // Set mounted state after initial render
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Default editor options
  const options = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly,
    cursorStyle: 'line',
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    lineNumbersMinChars: 3,
    folding: true,
    lineNumbers: 'on',
    ...editorOptions,
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="relative h-full">
        {isMounted ? (
          <MonacoEditor
            height={typeof height === 'number' ? `${height}px` : height}
            language={language}
            theme={theme === 'dark' ? 'custom-dark' : 'light'}
            value={code}
            onChange={handleCodeChange}
            onMount={handleEditorDidMount}
            beforeMount={handleEditorWillMount}
            options={{
              ...options,
              readOnly,
            }}
            loading={loading}
          />
        ) : (
          <div 
            className="bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
            style={{ 
              height: typeof height === 'number' ? `${height}px` : height,
            }}
          >
            {loading}
          </div>
        )}
      </div>
      
      {showConsole && (
        <div className={cn('mt-2', outputClassName)}>
          <CodeExecution
            initialCode={code}
            onCodeChange={handleCodeChange}
            onRun={onRun ? () => onRun(code) : undefined}
            onReset={onReset}
            showRunButton={showRunButton}
            showResetButton={showResetButton}
            showCopyButton={showCopyButton}
            showConsole={showConsole}
            showExecutionTime={showExecutionTime}
            height="200px"
            readOnly={readOnly}
            language={language}
            theme={theme}
            className={outputClassName}
            buttonClassName={buttonClassName}
          />
        </div>
      )}
    </div>
  );
}
