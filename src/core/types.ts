export interface SystemInfo {
  nodeVersion: string;
  platform: string;
  arch: string;
  cpuModel: string;
  totalMemoryMB: number;
  freeMemoryMB: number;
  uptimeSeconds: number;
}

export interface GitInfo {
  isGitRepo: boolean;
  branch: string | null;
  latestCommitHash: string | null;
  latestCommitAuthor: string | null;
  latestCommitSubject: string | null;
  hasUncommittedChanges: boolean;
  remoteUrl: string | null;
}

export interface DiagnosticReport {
  timestamp: string;
  system: SystemInfo;
  git: GitInfo;
}

export interface CliCommand {
  name: string;
  description: string;
  action: (args: string[]) => Promise<void> | void;
}
