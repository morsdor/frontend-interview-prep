// src/hooks/useCodeExecution.ts
import { useState, useCallback } from "react";
import { runCode, RunResult } from "@/lib/codeRunner";

export function useCodeExecution(initialCode: string = "") {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const executeCode = useCallback(async (customCode?: string) => {
    setIsRunning(true);
    setError(null);
    setOutput("");
    const codeToRun = customCode !== undefined ? customCode : code;
    try {
      const result: RunResult = await runCode(codeToRun);
      setOutput(result.output);
      setError(result.error);
      setExecutionTime(result.executionTime);
    } catch (err: any) {
      setOutput("");
      setError(err?.message || "Unknown error");
      setExecutionTime(null);
    } finally {
      setIsRunning(false);
    }
  }, [code]);

  const reset = useCallback(() => {
    setCode(initialCode);
    setOutput("");
    setError(null);
    setExecutionTime(null);
  }, [initialCode]);

  return {
    code,
    setCode,
    output,
    error,
    isRunning,
    executionTime,
    executeCode,
    reset,
  };
}