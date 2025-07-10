import { useState, useCallback } from 'react';
import { runCode, validateCodeSafety } from '@/lib/codeRunner';

type CodeExecutionState = {
  output: string;
  error: string | null;
  isRunning: boolean;
  executionTime: number | null;
};

type UseCodeExecutionProps = {
  initialCode?: string;
  onRunStart?: () => void;
  onRunComplete?: (result: {
    output: string;
    error: string | null;
    executionTime: number;
  }) => void;
};

export function useCodeExecution({
  initialCode = '',
  onRunStart,
  onRunComplete,
}: UseCodeExecutionProps = {}) {
  const [code, setCode] = useState(initialCode);
  const [state, setState] = useState<CodeExecutionState>({
    output: '',
    error: null,
    isRunning: false,
    executionTime: null,
  });

  const executeCode = useCallback(
    async (customCode?: string) => {
      const codeToRun = customCode !== undefined ? customCode : code;
      
      // Validate code safety first
      const safetyCheck = validateCodeSafety(codeToRun);
      if (!safetyCheck.isValid) {
        setState({
          output: '',
          error: safetyCheck.error || 'Code validation failed',
          isRunning: false,
          executionTime: null,
        });
        return;
      }

      setState((prev) => ({
        ...prev,
        isRunning: true,
        error: null,
      }));

      onRunStart?.();

      try {
        const result = await runCode(codeToRun);
        
        setState({
          output: result.output,
          error: result.error,
          isRunning: false,
          executionTime: result.executionTime,
        });

        onRunComplete?.({
          output: result.output,
          error: result.error,
          executionTime: result.executionTime,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        
        setState({
          output: '',
          error: errorMessage,
          isRunning: false,
          executionTime: null,
        });
      }
    },
    [code, onRunComplete, onRunStart]
  );

  const resetExecution = useCallback(() => {
    setState({
      output: '',
      error: null,
      isRunning: false,
      executionTime: null,
    });
  }, []);

  return {
    code,
    setCode,
    output: state.output,
    error: state.error,
    isRunning: state.isRunning,
    executionTime: state.executionTime,
    executeCode,
    resetExecution,
  };
}
