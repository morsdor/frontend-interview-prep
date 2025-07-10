'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Play, RotateCcw, Copy, Check, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCodeExecution } from '@/hooks/useCodeExecution';

interface CodeExecutionProps {
  initialCode?: string;
  height?: number | string;
  className?: string;
  onCodeChange?: (code: string) => void;
  onRun?: (code: string) => void;
  onReset?: () => void;
  showLineNumbers?: boolean;
  readOnly?: boolean;
  showRunButton?: boolean;
  showResetButton?: boolean;
  showCopyButton?: boolean;
  showConsole?: boolean;
  showExecutionTime?: boolean;
  autoRun?: boolean;
  autoRunDelay?: number;
  language?: string;
  theme?: 'light' | 'dark';
  editorClassName?: string;
  outputClassName?: string;
  buttonClassName?: string;
  children?: (props: {
    code: string;
    onCodeChange: (code: string) => void;
    height: string | number;
    editorRef: React.RefObject<any>;
  }) => React.ReactNode;
}

export function CodeExecution({
  initialCode = '',
  height = 300,
  className,
  onCodeChange,
  onRun,
  showLineNumbers = true,
  readOnly = false,
  showRunButton = true,
  showResetButton = true,
  showCopyButton = true,
  showConsole = true,
  showExecutionTime = true,
  autoRun = false,
  autoRunDelay = 1000,
  language = 'javascript',
  theme = 'dark',
  editorClassName,
  outputClassName,
  buttonClassName,
}: CodeExecutionProps) {
  const [code, setCode] = useState(initialCode);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const editorRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const {
    output,
    error,
    isRunning,
    executionTime,
    executeCode,
    resetExecution,
  } = useCodeExecution({
    initialCode,
    onRunStart: () => setActiveTab('output'),
  });

  // Handle auto-run
  useEffect(() => {
    if (autoRun && code) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        handleRunCode();
      }, autoRunDelay);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [code, autoRun, autoRunDelay]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCodeChange = (value: string = '') => {
    setCode(value);
    onCodeChange?.(value);
  };

  const handleRunCode = () => {
    executeCode(code);
    onRun?.(code);
  };

  const handleResetCode = () => {
    setCode(initialCode);
    resetExecution();
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const formattedExecutionTime = executionTime 
    ? `Executed in ${executionTime}ms` 
    : '';

  return (
    <Card className={cn('w-full overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Code Editor</CardTitle>
          <div className="flex items-center gap-2">
            {showRunButton && (
              <Button
                size="sm"
                onClick={handleRunCode}
                disabled={isRunning}
                className={buttonClassName}
              >
                <Play className="mr-2 h-4 w-4" />
                {isRunning ? 'Running...' : 'Run'}
              </Button>
            )}
            {showResetButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetCode}
                disabled={isRunning}
                className={buttonClassName}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            )}
            {showCopyButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyCode}
                className={buttonClassName}
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full justify-start px-4 pb-0 rounded-none border-b bg-transparent">
          <TabsTrigger value="editor" className="relative">
            Editor
          </TabsTrigger>
          {showConsole && (
            <TabsTrigger value="output" className="relative">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                Console
                {error && (
                  <span className="absolute -top-1 -right-4 h-2 w-2 rounded-full bg-red-500" />
                )}
              </div>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="editor" className="m-0">
          <div className={cn('relative', editorClassName)}>
            <div className="absolute inset-0">
              {/* Monaco Editor will be rendered here */}
              <div 
                ref={editorRef}
                style={{ height: typeof height === 'number' ? `${height}px` : height }}
                className="w-full"
              />
            </div>
          </div>
        </TabsContent>

        {showConsole && (
          <TabsContent value="output" className="m-0">
            <div 
              className={cn(
                'p-4 font-mono text-sm overflow-auto',
                'bg-gray-900 text-gray-100',
                outputClassName
              )}
              style={{ 
                minHeight: typeof height === 'number' ? `${Math.min(200, height)}px` : '200px',
                maxHeight: typeof height === 'number' ? `${height}px` : 'none',
              }}
            >
              {isRunning ? (
                <div className="text-gray-400">Running code...</div>
              ) : error ? (
                <div className="text-red-400">Error: {error}</div>
              ) : output ? (
                <pre className="whitespace-pre-wrap break-words">{output}</pre>
              ) : (
                <div className="text-gray-400">No output. Run the code to see results.</div>
              )}
              
              {showExecutionTime && executionTime !== null && (
                <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-400">
                  {formattedExecutionTime}
                </div>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </Card>
  );
}
