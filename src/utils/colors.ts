/**
 * Lightweight ANSI color utilities for rich terminal output without heavy dependencies.
 */

const isColorSupported = !process.env.NO_COLOR && (process.stdout.isTTY || process.env.FORCE_COLOR);

function wrap(code: number, resetCode: number = 39): (str: string) => string {
  if (!isColorSupported) {
    return (str: string) => str;
  }
  return (str: string) => `\x1b[${code}m${str}\x1b[${resetCode}m`;
}

export const colors = {
  reset: (str: string) => (isColorSupported ? `\x1b[0m${str}` : str),
  bold: wrap(1, 22),
  dim: wrap(2, 22),
  italic: wrap(3, 23),
  underline: wrap(4, 24),
  
  // Foreground colors
  black: wrap(30),
  red: wrap(31),
  green: wrap(32),
  yellow: wrap(33),
  blue: wrap(34),
  magenta: wrap(35),
  cyan: wrap(36),
  white: wrap(37),
  gray: wrap(90),

  // Bright variants
  brightGreen: wrap(92),
  brightYellow: wrap(93),
  brightBlue: wrap(94),
  brightCyan: wrap(96),
};
