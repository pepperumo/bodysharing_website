/**
 * Logger utility for consistent logging across the application
 * Supports environment-based configuration and emoji logging
 */
class Logger {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = process.env.REACT_APP_ENABLE_LOGGING === 'true';
  }

  private getColoredText(color: string): string {
    const colors: Record<string, string> = {
      blue: '#2196F3',
      green: '#4CAF50',
      yellow: '#FFC107',
      red: '#F44336',
      gray: '#9E9E9E'
    };
    
    return `color: ${colors[color]}; font-weight: bold`;
  }

  private formatArgs(args: unknown[]): unknown[] {
    return args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
    );
  }

  /**
   * Log informational message
   * @param message - The message to log
   * @param args - Additional arguments to log
   */
  info(message: string, ...args: unknown[]): void {
    if (!this.isEnabled) return;
    console.log(
      '%c ℹ️ INFO: ' + message,
      this.getColoredText('blue'),
      ...this.formatArgs(args)
    );
  }

  /**
   * Log success message
   * @param message - The success message to log
   * @param args - Additional arguments to log
   */
  success(message: string, ...args: unknown[]): void {
    if (!this.isEnabled) return;
    console.log(
      '%c ✅ SUCCESS: ' + message,
      this.getColoredText('green'),
      ...this.formatArgs(args)
    );
  }

  /**
   * Log warning message
   * @param message - The warning message to log
   * @param args - Additional arguments to log
   */
  warn(message: string, ...args: unknown[]): void {
    if (!this.isEnabled) return;
    console.warn(
      '%c ⚠️ WARNING: ' + message,
      this.getColoredText('yellow'),
      ...this.formatArgs(args)
    );
  }

  /**
   * Log error message
   * @param message - The error message to log
   * @param args - Additional arguments to log
   */
  error(message: string, ...args: unknown[]): void {
    if (!this.isEnabled) return;
    console.error(
      '%c ❌ ERROR: ' + message,
      this.getColoredText('red'),
      ...this.formatArgs(args)
    );
  }

  /**
   * Log debug message (only in development)
   * @param message - The debug message to log
   * @param args - Additional arguments to log
   */
  debug(message: string, ...args: unknown[]): void {
    if (!this.isEnabled || process.env.NODE_ENV !== 'development') return;
    console.debug(
      '%c 🔍 DEBUG: ' + message,
      this.getColoredText('gray'),
      ...this.formatArgs(args)
    );
  }
}

export const logger = new Logger();