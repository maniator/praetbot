import { describe, it, expect } from 'vitest';
import { executeSandboxedCode, validateCommandCode } from './sandbox.js';

describe('Sandbox Security', () => {
  describe('executeSandboxedCode', () => {
    it('should execute safe code', () => {
      const code = 'return "Hello, World!"';
      const result = executeSandboxedCode(code, {});
      expect(result).toBe('Hello, World!');
    });

    it('should block process.exit()', () => {
      const code = 'process.exit(0)';
      expect(() => executeSandboxedCode(code, {})).toThrow();
    });

    it('should block require()', () => {
      const code = 'require("fs")';
      expect(() => executeSandboxedCode(code, {})).toThrow(/forbidden pattern/);
    });

    it('should block import statements', () => {
      const code = 'import fs from "fs"';
      expect(() => executeSandboxedCode(code, {})).toThrow(/forbidden pattern/);
    });

    it('should block access to global', () => {
      const code = 'global.something = "bad"';
      expect(() => executeSandboxedCode(code, {})).toThrow(/forbidden pattern/);
    });

    it('should block eval()', () => {
      const code = 'eval("malicious code")';
      expect(() => executeSandboxedCode(code, {})).toThrow(/forbidden pattern/);
    });

    it('should block Function constructor', () => {
      const code = 'new Function("return process")()';
      expect(() => executeSandboxedCode(code, {})).toThrow(/forbidden pattern/);
    });

    it('should allow Math operations', () => {
      const code = 'return Math.floor(Math.random() * 100)';
      const result = executeSandboxedCode(code, {});
      const num = parseInt(result);
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThan(100);
    });

    it('should allow Date operations', () => {
      const code = 'return new Date().getFullYear()';
      const result = executeSandboxedCode(code, {});
      expect(parseInt(result)).toBeGreaterThan(2020);
    });

    it('should timeout long-running code', () => {
      const code = 'while(true) {}';
      expect(() => executeSandboxedCode(code, {}, { timeout: 100 })).toThrow(/timed out/);
    });

    it('should reject code that is too long', () => {
      const code = 'a'.repeat(20000);
      expect(() => executeSandboxedCode(code, {}, { maxCodeLength: 10000 })).toThrow(/exceeds maximum length/);
    });

    it('should allow accessing provided context', () => {
      const code = 'return user.name';
      const result = executeSandboxedCode(code, { user: { name: 'TestUser' } });
      expect(result).toBe('TestUser');
    });
  });

  describe('validateCommandCode', () => {
    it('should accept valid code', () => {
      const result = validateCommandCode('return "Hello"');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty code', () => {
      const result = validateCommandCode('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('empty');
    });

    it('should reject code with require()', () => {
      const result = validateCommandCode('const fs = require("fs")');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('require()');
    });

    it('should reject code with process', () => {
      const result = validateCommandCode('process.exit(0)');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('process');
    });

    it('should reject code with syntax errors', () => {
      const result = validateCommandCode('return {invalid syntax');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Syntax error');
    });

    it('should reject code that is too long', () => {
      const result = validateCommandCode('a'.repeat(20000));
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds maximum length');
    });
  });
});
