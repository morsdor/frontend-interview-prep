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
  const logs: any[] = [];
  let result: any;
  let error: string | null = null;

  // Save original console methods
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info,
  };

  try {
    // Override console methods to capture output
    ['log', 'error', 'warn', 'info'].forEach((method) => {
      // @ts-ignore
      console[method] = (...args: any[]) => {
        logs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
        // @ts-ignore
        originalConsole[method](...args);
      };
    });

    // Wrap the code in an async function to handle both sync and async code
    const wrappedCode = `
      (async () => {
        ${code}
      })()
        .then(result => ({
          type: 'success',
          value: result
        }))
        .catch(error => ({
          type: 'error',
          value: error instanceof Error ? error.message : String(error)
        }));
    `;

    // Execute the code
    // Using Function constructor instead of eval for better error handling
    const asyncFn = new Function(`return ${wrappedCode}`);
    const promise = asyncFn();
    
    // Wait for the promise to resolve
    const executionResult = await Promise.race([
      promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Execution timed out')), 5000)
      )
    ]);

    if (executionResult.type === 'error') {
      throw new Error(executionResult.value);
    }

    // If there's a return value and no logs, use it as output
    if (logs.length === 0 && executionResult.value !== undefined) {
      result = executionResult.value;
    }
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
  } finally {
    // Restore original console methods
    Object.assign(console, originalConsole);
  }

  const endTime = performance.now();
  const executionTime = Math.round((endTime - startTime) * 100) / 100; // in ms

  // Format the output
  let output = '';
  if (logs.length > 0) {
    output = logs.join('\n');
  } else if (result !== undefined) {
    output = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
  }

  return {
    output,
    error,
    executionTime,
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
    {
      pattern: /`/g,
      error: 'Template literals are not allowed',
    },
  ];

  for (const { pattern, error } of dangerousPatterns) {
    if (pattern.test(code)) {
      return { isValid: false, error };
    }
  }

  return { isValid: true };
}
