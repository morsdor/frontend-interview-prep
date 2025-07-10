// A simple and safe way to run user code in the browser
// This is NOT a secure sandbox - for production use, consider using a Web Worker or a service

type RunResult = {
  output: string;
  error: string | null;
  executionTime: number;
};

export async function runCode(
  code: string,
  input: string = ''
): Promise<RunResult> {
  const startTime = performance.now();
  const logs: string[] = [];
  let result: any;
  let error: string | null = null;
  
  // Save original console methods
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info,
  };
  
  // Helper function to safely stringify values
  const safeStringify = (value: any): string => {
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (typeof value === 'function') return '[Function]';
    if (value instanceof Error) return value.stack || value.message;
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2);
      } catch (e) {
        return String(value);
      }
    }
    return String(value);
  };

  try {
    // Override console methods to capture output
    const consoleMethods = ['log', 'error', 'warn', 'info'] as const;
    for (const method of consoleMethods) {
      // @ts-ignore
      console[method] = (...args: any[]) => {
        const messages = args.map(arg => safeStringify(arg));
        const message = messages.join(' ');
        logs.push(`[${method.toUpperCase()}] ${message}`);
        // @ts-ignore
        originalConsole[method](...args);
      };
    }

    // Execute the code in a function to avoid polluting global scope
    const wrappedCode = `
      (function() {
        ${code}
        // If the code doesn't return anything, try to call a main function if it exists
        if (typeof main === 'function') {
          return main(${JSON.stringify(input)});
        }
        // Otherwise, try to get the last expression result
        return typeof result !== 'undefined' ? result : undefined;
      })();
    `;

    // Execute the code
    result = new Function(wrappedCode)();
    
    // If it's a promise, wait for it to resolve
    if (result && typeof result.then === 'function') {
      result = await result;
    }
  } catch (err) {
    console.error('Error executing code:', err);
    error = err instanceof Error ? 
      `${err.name}: ${err.message}\n${err.stack || ''}` : 
      String(err);
  } finally {
    // Restore original console methods
    Object.assign(console, originalConsole);
  }

  const endTime = performance.now();
  const executionTime = Math.round((endTime - startTime) * 100) / 100; // in ms

  // Format the output
  let output = '';
  
  // Add any console output
  if (logs.length > 0) {
    output = logs.join('\n');
  }
  
  // Add the result (if any)
  if (result !== undefined) {
    const formattedResult = (() => {
      if (result === undefined) return 'undefined';
      if (result === null) return 'null';
      if (typeof result === 'object') {
        try {
          return JSON.stringify(result, null, 2);
        } catch (e) {
          return String(result);
        }
      }
      return String(result);
    })();
    
    if (output) output += '\n\n';
    output += `Result: ${formattedResult}`;
  }
  
  // If there was an error, add it to the output
  if (error) {
    if (output) output += '\n\n';
    output += `Error: ${error}`;
  }
  
  // If there's no output at all, indicate that
  if (!output) {
    output = 'Code executed successfully (no output)';
  }

  return {
    output,
    error,
    executionTime
  };
}

// Helper function to create a safe eval environment
export function createSafeEvalContext() {
  const safeGlobals = {
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    Array,
    Boolean,
    Date,
    Error,
    JSON,
    Math,
    Number,
    Object,
    Promise,
    RegExp,
    String,
    Map,
    Set,
    WeakMap,
    WeakSet,
    ArrayBuffer,
    Uint8Array,
    Uint16Array,
    Uint32Array,
    Int8Array,
    Int16Array,
    Int32Array,
    Float32Array,
    Float64Array,
    DataView,
    isFinite,
    isNaN,
    parseFloat,
    parseInt,
    encodeURI,
    encodeURIComponent,
    decodeURI,
    decodeURIComponent,
  };

  return {
    ...safeGlobals,
    // Add any additional safe globals here
  };
}

// Validate code for potentially dangerous operations
export function validateCodeSafety(code: string): { isValid: boolean; error?: string } {
  // Temporarily disable all security checks for debugging
  // console.log('Code validation skipped for debugging');
  // return { isValid: true };
  
  
  // Original security checks (commented out for debugging)
  const dangerousPatterns = [
    {
      pattern: /\b(?:import|require|eval|Function\s*\()/,
      error: 'Dynamic imports and eval-like functions are not allowed',
    },
    {
      pattern: /\b(?:document|window|process|globalThis|global)\./,
      error: 'Access to DOM and global objects is restricted',
    },
    {
      pattern: /\bfetch\s*\(/,
      error: 'Network requests are not allowed',
    },
  ];

  for (const { pattern, error } of dangerousPatterns) {
    if (pattern.test(code)) {
      console.log('Code validation failed:', { pattern: pattern.toString(), error });
      return { isValid: false, error };
    }
  }
  

  return { isValid: true };
}
