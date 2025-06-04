export interface VersionInfo {
  version: string;
  buildDate: string;
  commitHash?: string;
}

declare global {
  const __APP_VERSION__: string;
  const __BUILD_DATE__: string;
  const __COMMIT_HASH__: string;
}

export class VersionService {
  private static instance: VersionService;
  private versionInfo: VersionInfo;

  private constructor() {
    // Debug logging for troubleshooting
    console.log('Version Service Debug:', {
      'import.meta.env.VITE_APP_VERSION': import.meta.env.VITE_APP_VERSION,
      '__APP_VERSION__': typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'undefined',
      'import.meta.env.VITE_BUILD_DATE': import.meta.env.VITE_BUILD_DATE,
      '__BUILD_DATE__': typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : 'undefined',
      'import.meta.env.VITE_COMMIT_HASH': import.meta.env.VITE_COMMIT_HASH,
      '__COMMIT_HASH__': typeof __COMMIT_HASH__ !== 'undefined' ? __COMMIT_HASH__ : 'undefined'
    });

    this.versionInfo = {
      version: import.meta.env.VITE_APP_VERSION || __APP_VERSION__ || '0.5.0',
      buildDate: import.meta.env.VITE_BUILD_DATE || __BUILD_DATE__ || new Date().toISOString(),
      commitHash: import.meta.env.VITE_COMMIT_HASH || __COMMIT_HASH__ || undefined
    };
  }

  public static getInstance(): VersionService {
    if (!VersionService.instance) {
      VersionService.instance = new VersionService();
    }
    return VersionService.instance;
  }

  public getVersion(): string {
    return this.versionInfo.version;
  }

  public getBuildDate(): string {
    return this.versionInfo.buildDate;
  }

  public getCommitHash(): string | undefined {
    return this.versionInfo.commitHash;
  }

  public getVersionInfo(): VersionInfo {
    return { ...this.versionInfo };
  }

  public getFormattedVersion(): string {
    const { version, buildDate } = this.versionInfo;
    const date = new Date(buildDate).toLocaleDateString();
    return `v${version} (${date})`;
  }
} 