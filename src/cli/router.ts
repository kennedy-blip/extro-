import { Logger } from '../utils/logger.js';
import { colors } from '../utils/colors.js';
import { SystemInspector } from '../core/system-inspector.js';
import type { CliCommand } from '../core/types.js';

export class CliRouter {
  private commands: Map<string, CliCommand> = new Map();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults(): void {
    this.register({
      name: 'status',
      description: 'Audit workspace health, system environment, and Git repository status',
      action: () => this.handleStatus(),
    });

    this.register({
      name: 'help',
      description: 'Display available commands and usage guide',
      action: () => this.handleHelp(),
    });
  }

  public register(command: CliCommand): void {
    this.commands.set(command.name.toLowerCase(), command);
  }

  public async run(args: string[]): Promise<void> {
    const commandName = (args[0] || 'status').toLowerCase();

    if (commandName === '--help' || commandName === '-h') {
      return this.handleHelp();
    }

    const command = this.commands.get(commandName);
    if (!command) {
      Logger.error(`Unknown command: ${colors.bold(commandName)}`);
      this.handleHelp();
      process.exitCode = 1;
      return;
    }

    await command.action(args.slice(1));
  }

  private handleStatus(): void {
    Logger.banner();
    const report = SystemInspector.generateReport();

    Logger.header('SYSTEM ENVIRONMENT');
    Logger.table([
      ['Node Runtime', colors.green(report.system.nodeVersion)],
      ['Platform / Arch', `${report.system.platform} (${report.system.arch})`],
      ['CPU', report.system.cpuModel],
      ['Memory Usage', `${report.system.freeMemoryMB} MB free / ${report.system.totalMemoryMB} MB total`],
    ]);

    Logger.header('GIT WORKSPACE HEALTH');
    if (report.git.isGitRepo) {
      Logger.table([
        ['Current Branch', colors.brightCyan(report.git.branch ?? 'N/A')],
        ['Remote Origin', report.git.remoteUrl ? colors.dim(report.git.remoteUrl) : colors.yellow('None configured')],
        ['Latest Commit', report.git.latestCommitHash ? `${colors.yellow(report.git.latestCommitHash)} - ${report.git.latestCommitSubject}` : 'No commits yet'],
        ['Commit Author', report.git.latestCommitAuthor ?? 'N/A'],
        ['Working Tree', report.git.hasUncommittedChanges ? colors.yellow('Dirty (uncommitted changes present)') : colors.brightGreen('Clean (ready to ship)')],
      ]);
    } else {
      Logger.warn('Not currently inside a git repository.');
    }

    console.log('\n' + colors.dim(`Diagnostics collected at ${report.timestamp}\n`));
  }

  private handleHelp(): void {
    Logger.banner();
    console.log(colors.bold('USAGE:'));
    console.log('  extro <command> [options]\n');
    console.log(colors.bold('COMMANDS:'));
    for (const [, cmd] of this.commands) {
      console.log(`  ${colors.brightCyan(cmd.name.padEnd(12))} ${cmd.description}`);
    }
    console.log('\n');
  }
}
