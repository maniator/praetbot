import { VM } from 'vm2';

/**
 * Secure sandbox for executing custom commands
 * Prevents access to:
 * - process object
 * - require/import
 * - file system
 * - network
 * - internal application state
 */

interface SandboxOptions {
  timeout?: number;
  maxCodeLength?: number;
}

const DEFAULT_TIMEOUT = 5000; // 5 seconds
const MAX_CODE_LENGTH = 10000; // 10KB of code

/**
 * Execute code in a secure sandbox
 */
export function executeSandboxedCode(
  code: string,
  context: Record<string, unknown>,
  options: SandboxOptions = {}
): string {
  const timeout = options.timeout || DEFAULT_TIMEOUT;
  const maxLength = options.maxCodeLength || MAX_CODE_LENGTH;

  // Validate code length
  if (code.length > maxLength) {
    throw new Error(`Code exceeds maximum length of ${maxLength} characters`);
  }

  // Check for dangerous patterns
  const dangerousPatterns = [
    /require\s*\(/gi,
    /import\s+/gi,
    /process\s*\./gi,
    /process\s*\[/gi,
    /global\s*\./gi,
    /global\s*\[/gi,
    /__dirname/gi,
    /__filename/gi,
    /module\s*\./gi,
    /exports\s*\./gi,
    /child_process/gi,
    /eval\s*\(/gi,
    /Function\s*\(/g, // Case-sensitive - only blocks Function constructor, not function keyword
    /constructor\s*\(/gi,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(code)) {
      throw new Error(`Code contains forbidden pattern: ${pattern.source}`);
    }
  }

  try {
    // Create isolated VM
    const vm = new VM({
      timeout,
      sandbox: {
        ...context,
        // Provide safe alternatives
        console: {
          log: () => {}, // Disable console.log in custom commands
        },
        Math,
        Date,
        JSON,
        Array,
        Object: {
          keys: Object.keys,
          values: Object.values,
          entries: Object.entries,
        },
        String,
        Number,
        Boolean,
      },
      // Disable access to host objects
      eval: false,
      wasm: false,
      fixAsync: false,
    });

    // Wrap code in a function and execute
    const wrappedCode = `
      (function() {
        'use strict';
        ${code}
      })()
    `;

    const result = vm.run(wrappedCode);

    // Convert result to string safely
    if (result === null || result === undefined) {
      return '';
    }

    if (typeof result === 'object') {
      try {
        return JSON.stringify(result);
      } catch {
        return String(result);
      }
    }

    return String(result);
  } catch (error) {
    if (error instanceof Error) {
      // Don't expose internal error details
      if (error.message.includes('Script execution timed out')) {
        throw new Error('Command execution timed out');
      }
      throw new Error(`Command execution failed: ${error.message}`);
    }
    throw new Error('Command execution failed');
  }
}

/**
 * Validate command code before saving
 */
export function validateCommandCode(code: string): { valid: boolean; error?: string } {
  if (!code || code.trim().length === 0) {
    return { valid: false, error: 'Code cannot be empty' };
  }

  if (code.length > MAX_CODE_LENGTH) {
    return { valid: false, error: `Code exceeds maximum length of ${MAX_CODE_LENGTH} characters` };
  }

  // Check for dangerous patterns
  const dangerousPatterns = [
    { pattern: /require\s*\(/gi, name: 'require()' },
    { pattern: /import\s+/gi, name: 'import' },
    { pattern: /process\s*\./gi, name: 'process object' },
    { pattern: /process\s*\[/gi, name: 'process object' },
    { pattern: /global\s*\./gi, name: 'global object' },
    { pattern: /global\s*\[/gi, name: 'global object' },
    { pattern: /__dirname/gi, name: '__dirname' },
    { pattern: /__filename/gi, name: '__filename' },
    { pattern: /module\s*\./gi, name: 'module object' },
    { pattern: /exports\s*\./gi, name: 'exports object' },
    { pattern: /child_process/gi, name: 'child_process' },
    { pattern: /eval\s*\(/gi, name: 'eval()' },
    { pattern: /Function\s*\(/g, name: 'Function constructor' }, // Case-sensitive
  ];

  for (const { pattern, name } of dangerousPatterns) {
    if (pattern.test(code)) {
      return { valid: false, error: `Code contains forbidden pattern: ${name}` };
    }
  }

  // Try to parse as JavaScript to check syntax
  try {
    new Function(code);
  } catch (error) {
    if (error instanceof Error) {
      return { valid: false, error: `Syntax error: ${error.message}` };
    }
    return { valid: false, error: 'Syntax error in code' };
  }

  return { valid: true };
}
