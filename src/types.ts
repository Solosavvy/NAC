export interface AndroidAppConfig {
  appName: string;
  packageName: string;
  targetUrl: string;
  versionName: string;
  versionCode: number;
  minSdkVersion: number;
  targetSdkVersion: number;
  compileSdkVersion: number;
  
  // Background Audio & Permissions
  enableForegroundService: boolean;
  enableWakeLock: boolean;
  enableMediaSession: boolean;
  notificationChannelName: string;
  notificationTitle: string;
  
  // Hardware & Caching
  enableHardwareAcceleration: boolean;
  enableDomStorage: boolean;
  enableAppCache: boolean;
  enableZoomControls: boolean;
  cleartextTrafficAllowed: boolean;
  
  // UI & Splash
  primaryColor: string;
  backgroundColor: string;
  splashDuration: number;
  showOfflineFallback: boolean;
}

export interface ProjectFile {
  path: string;
  name: string;
  language: string;
  category: 'manifest' | 'gradle' | 'kotlin' | 'layout' | 'res' | 'config';
  content: string;
  description: string;
}

export type ActiveTab = 'simulator' | 'code' | 'config' | 'architecture' | 'guide';

export interface PlayerState {
  isPlaying: boolean;
  title: string;
  artist: string;
  isMinimized: boolean;
  isLocked: boolean;
  isOffline: boolean;
  serviceRunning: boolean;
  volume: number;
}
