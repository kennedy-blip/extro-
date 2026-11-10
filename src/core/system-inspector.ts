import os from 'node:os';
import { execSync } from 'node:child_process';
import type { SystemInfo, GitInfo, DiagnosticReport } from './types.js';

export class SystemInspector {
  /**
   * Gather platform, runtime, and resource information.
   */
  static getSystemInfo(): SystemInfo {
    const cpus = os.cpus();
    const cpuModel = cpus.length > 0 ? cpus[0].model.trim() : 'Unknown';
    const totalMem = Math.round(os.totalmem() / (1024 * 1024));
    const freeMem = Math.round(os.freemem() / (1024 * 1024));

    return {
      nodeVersion: process.version,
      platform: os.platform(),
      arch: os.arch(),
      cpuModel,
      totalMemoryMB: totalMem,
      freeMemoryMB: freeMem,
      uptimeSeconds: Math.round(os.uptime()),
    };
  }

  /**
   * Inspect the current git repository status.
   */
  static getGitInfo(): GitInfo {
    try {
      execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    } catch {
      return {
        isGitRepo: false,
        branch: null,
        latestCommitHash: null,
        latestCommitAuthor: null,
        latestCommitSubject: null,
        hasUncommittedChanges: false,
        remoteUrl: null,
      };
    }

    const run = (cmd: string): string => {
      try {
        return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
      } catch {
        return '';
      }
    };

    const branch = run('git branch --show-current') || 'HEAD';
    const latestCommitHash = run('git log -1 --format=%h') || null;
    const latestCommitAuthor = run('git log -1 --format=%an') || null;
    const latestCommitSubject = run('git log -1 --format=%s') || null;
    const statusOutput = run('git status --porcelain');
    const remoteUrl = run('git config --get remote.origin.url') || null;

    return {
      isGitRepo: true,
      branch,
      latestCommitHash,
      latestCommitAuthor,
      latestCommitSubject,
      hasUncommittedChanges: statusOutput.length > 0,
      remoteUrl,
    };
  }

  /**
   * Produces a comprehensive diagnostics snapshot.
   */
  static generateReport(): DiagnosticReport {
    return {
      timestamp: new Date().toISOString(),
      system: this.getSystemInfo(),
      git: this.getGitInfo(),
    };
  }
}
