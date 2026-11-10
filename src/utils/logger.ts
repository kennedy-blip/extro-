import { colors } from './colors.js';

export class Logger {
  static info(message: string): void {
    console.log(`${colors.cyan('ℹ')} ${message}`);
  }

  static success(message: string): void {
    console.log(`${colors.brightGreen('✔')} ${message}`);
  }

  static warn(message: string): void {
    console.log(`${colors.yellow('⚠')} ${message}`);
  }

  static error(message: string): void {
    console.error(`${colors.red('✖')} ${message}`);
  }

  static header(title: string): void {
    console.log('\n' + colors.bold(colors.brightCyan(`─── ${title} ` + '─'.repeat(Math.max(0, 50 - title.length)))));
  }

  static banner(): void {
    const art = `
  ███████╗██╗  ██╗████████╗██████╗  ██████╗ 
  ██╔════╝╚██╗██╔╝╚══██╔══╝██╔══██╗██╔═══██╗
  █████╗   ╚███╔╝    ██║   ██████╔╝██║   ██║
  ██╔══╝   ██╔██╗    ██║   ██╔══██╗██║   ██║
  ███████╗██╔╝ ██╗   ██║   ██║  ██║╚██████╔╝
  ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ `;
    console.log(colors.cyan(art));
    console.log(colors.dim('  Collaborative Developer Toolkit & Repository Analytics\n'));
  }

  static table(rows: [string, string][]): void {
    const maxLabelLen = Math.max(...rows.map(([label]) => label.length), 0);
    for (const [label, value] of rows) {
      console.log(`  ${colors.dim(label.padEnd(maxLabelLen + 2))} ${value}`);
    }
  }
}
