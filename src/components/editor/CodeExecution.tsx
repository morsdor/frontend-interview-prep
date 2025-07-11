"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Copy, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";

type Props = {
  output: string;
  error: string | null;
  isRunning: boolean;
  executionTime: number | null;
  onRun: () => void;
  onReset: () => void;
  className?: string;
  outputClassName?: string;
};

export function CodeExecution({
  output,
  error,
  isRunning,
  executionTime,
  onRun,
  onReset,
  className,
  outputClassName,
}: Props) {
  const outputRef = useRef<HTMLPreElement>(null);

  const handleCopy = () => {
    if (outputRef.current) {
      navigator.clipboard.writeText(outputRef.current.textContent || "");
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardFooter className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button onClick={onRun} disabled={isRunning} variant="default" size="sm">
            <Play className="w-4 h-4 mr-1" /> Run
          </Button>
          <Button onClick={onReset} disabled={isRunning} variant="secondary" size="sm">
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