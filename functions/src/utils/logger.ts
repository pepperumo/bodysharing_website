import chalk from "chalk";

/** Logger class for consistent logging across cloud functions */
class Logger {
  /**
   * Returns ISO timestamp for log entries
   * @return {string} ISO format timestamp
   */
  private timestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Log informational message
   * @param {string} message - The message to log
   * @param {...unknown} args - Additional arguments to log
   */
  info(message: string, ...args: unknown[]): void {
    console.log(
      chalk.blue(`[${this.timestamp()}] ℹ️ INFO: ${message}`),
      ...args.map((arg) => typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg)
    );
  }

  /**
   * Log success message
   * @param {string} message - The success message to log
   * @param {...unknown} args - Additional arguments to log
   */
  success(message: string, ...args: unknown[]): void {
    console.log(
      chalk.green(`[${this.timestamp()}] ✅ SUCCESS: ${message}`),
      ...args.map((arg) => typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg)
    );
  }

  /**
   * Log warning message
   * @param {string} message - The warning message to log
   * @param {...unknown} args - Additional arguments to log
   */
  warn(message: string, ...args: unknown[]): void {
    console.warn(
      chalk.yellow(`[${this.timestamp()}] ⚠️ WARNING: ${message}`),
      ...args.map((arg) => typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg)
    );
  }

  /**
   * Log error message
   * @param {string} message - The error message to log
   * @param {...unknown} args - Additional arguments to log
   */
  error(message: string, ...args: unknown[]): void {
    console.error(
      chalk.red(`[${this.timestamp()}] ❌ ERROR: ${message}`),
      ...args.map((arg) => typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg)
    );
  }

  /**
   * Log debug message (only in emulator)
   * @param {string} message - The debug message to log
   * @param {...unknown} args - Additional arguments to log
   */
  debug(message: string, ...args: unknown[]): void {
    if (process.env.FUNCTIONS_EMULATOR) {
      console.debug(
        chalk.gray(`[${this.timestamp()}] 🔍 DEBUG: ${message}`),
        ...args.map((arg) => typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg)
      );
    }
  }
}

export const logger = new Logger();
