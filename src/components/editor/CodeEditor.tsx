"use client";

import dynamic from "next/dynamic";
import { useCodeExecution } from "@/hooks/useCodeExecution";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Play, RotateCcw, Copy, Terminal } from "lucide-react";
import { useRef } from "react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type CodeEditorProps = {
  initialCode?: string;
  height?: number | string;
  className?: string;
  editorClassName?: string;
  outputClassName?: string;
  language?: string;
  theme?: "light" | "dark";
};

export function CodeEditor({
  initialCode = "",
  height = 400,
  className,
  editorClassName,
  outputClassName,
  language = "javascript",
  theme = "dark",
}: CodeEditorProps) {
  const {
    code,
    setCode,
    output,
    error,
    isRunning,
    executionTime,
    executeCode,
    reset,
  } = useCodeExecution(initialCode);

  const outputRef = useRef<HTMLPreElement>(null);

  const handleCopy = () => {
    if (outputRef.current) {
      navigator.clipboard.writeText(outputRef.current.textContent || "");
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className={cn("p-0", editorClassName)}>
        <MonacoEditor
          height={typeof height === "number" ? `${height}px` : height}
          language={language}
          theme={theme === "dark" ? "vs-dark" : "light"}
          value={code}
          onChange={v => setCode(v || "")}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            automaticLayout: true,
          }}
        />
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button onClick={() => executeCode(code)} disabled={isRunning} variant="default" size="sm">
            <Play className="w-4 h-4 mr-1" /> Run
          </Button>
          <Button onClick={reset} disabled={isRunning} variant="secondary" size="sm">
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
          <Button onClick={handleCopy} variant="ghost" size="sm">
            <Copy className="w-4 h-4 mr-1" /> Copy Output
          </Button>
        </div>
        <div className={cn("mt-2 w-full rounded bg-muted px-3 py-2 font-mono text-sm", outputClassName)}>
          <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
            <Terminal className="w-4 h-4" />
            Output
            {typeof executionTime === "number" && (
              <span className="ml-auto text-xs">Time: {executionTime}ms</span>
            )}
          </div>
          <pre ref={outputRef} className={cn("whitespace-pre-wrap break-words", error ? "text-red-500" : "")}>
            {error ? error : output}
          </pre>
        </div>
      </CardFooter>
    </Card>
  );
}