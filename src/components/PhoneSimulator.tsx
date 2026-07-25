import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Wifi, 
  WifiOff, 
  Lock, 
  Unlock, 
  Battery, 
  Zap, 
  Bell, 
  Radio, 
  RotateCw, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Maximize2,
  ExternalLink,
  Info
} from 'lucide-react';
import { AndroidAppConfig, PlayerState } from '../types';

interface PhoneSimulatorProps {
  config: AndroidAppConfig;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({ config }) => {
  const [player, setPlayer] = useState<PlayerState>({
    isPlaying: true,
    title: config.notificationTitle,
    artist: 'NAC Sacred Choir & Orchestra',
    isMinimized: false,
    isLocked: false,
    isOffline: false,
    serviceRunning: true,
    volume: 80,
  });

  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTogglePlay = () => {
    setPlayer(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleToggleOffline = () => {
    setPlayer(prev => ({ ...prev, isOffline: !prev.isOffline }));
  };

  const handleReload = () => {
    setIframeKey(prev => prev + 1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Phone Simulator Frame */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-center justify-center">
        
        {/* Device Controls Top Toolbar */}
        <div className="w-full max-w-[360px] bg-slate-900 border border-slate-800 rounded-t-2xl p-3 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleOffline}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition text-[11px] font-semibold ${
                player.isOffline 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
              title="Toggle Wi-Fi connection to test offline fallback page"
            >
              {player.isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              <span>{player.isOffline ? 'Offline' : 'Online'}</span>
            </button>

            <button
              onClick={() => setPlayer(prev => ({ ...prev, isLocked: !prev.isLocked }))}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition text-[11px] font-semibold ${
                player.isLocked 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
              title="Simulate Screen Lock to verify background audio service"
            >
              {player.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{player.isLocked ? 'Screen Locked' : 'Unlocked'}</span>
            </button>
          </div>

          <button
            onClick={handleReload}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
            title="Reload WebView"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Realistic Mobile Frame */}
        <div className="w-full max-w-[360px] h-[720px] bg-slate-950 border-4 border-slate-800 rounded-b-3xl shadow-2xl relative overflow-hidden flex flex-col">
          
          {/* Status Bar */}
          <div className="bg-slate-950 text-slate-300 text-xs px-4 py-2 flex items-center justify-between border-b border-slate-900 select-none z-30">
            <span className="font-semibold text-[11px] tracking-tight">{currentTime || '12:00'}</span>
            
            {/* Camera Punchhole Notch */}
            <div className="w-3 h-3 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center">
              <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
            </div>

            <div className="flex items-center space-x-2 text-[11px]">
              {config.enableForegroundService && player.isPlaying && (
                <Radio className="w-3 h-3 text-blue-400 animate-pulse" />
              )}
              {player.isOffline ? <WifiOff className="w-3 h-3 text-rose-400" /> : <Wifi className="w-3 h-3 text-emerald-400" />}
              <div className="flex items-center space-x-0.5">
                <Battery className="w-3.5 h-3.5 text-slate-300" />
                <span>94%</span>
              </div>
            </div>
          </div>

          {/* Foreground Audio Notification Drawer Pulldown Toggle */}
          <div className="relative z-20">
            <button
              onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
              className="w-full bg-slate-900/90 hover:bg-slate-800 backdrop-blur border-b border-slate-800 text-[11px] font-medium text-slate-300 py-1 flex items-center justify-center space-x-1 transition"
            >
              <Bell className="w-3 h-3 text-blue-400" />
              <span>{showNotificationDrawer ? 'Hide Android Media Tray' : 'Android Foreground Audio Notification'}</span>
            </button>

            {/* Notification Drawer Content */}
            {showNotificationDrawer && (
              <div className="bg-slate-900 border-b border-blue-500/30 p-3.5 shadow-xl transition-all">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <div className="flex items-center space-x-1.5 text-blue-400 font-semibold">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>{config.notificationChannelName}</span>
                  </div>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono">
                    FOREGROUND_SERVICE
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Radio className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 truncate max-w-[160px]">
                        {config.notificationTitle}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate max-w-[160px]">
                        {player.artist}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleTogglePlay}
                    className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 transition shadow-md shadow-blue-600/30"
                  >
                    {player.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Screen Lock Simulator Overlay */}
          {player.isLocked ? (
            <div className="flex-1 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mb-4 shadow-xl">
                <Lock className="w-8 h-8 text-amber-400" />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1">Device Screen Locked</h3>
              <p className="text-xs text-slate-400 mb-6 max-w-xs">
                Native Foreground Service & Wake Lock keeping the audio stream alive without power interruption.
              </p>

              {/* Lockscreen Media Card */}
              <div className="w-full bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-2xl">
                <div className="flex items-center space-x-3 text-left mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
                    🎵
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white truncate max-w-[180px]">
                      {config.appName}
                    </h4>
                    <p className="text-xs text-blue-400 font-medium">Live Background Stream Active</p>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-6">
                  <button 
                    onClick={handleTogglePlay}
                    className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 transition shadow-lg shadow-blue-600/40"
                  >
                    {player.isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setPlayer(prev => ({ ...prev, isLocked: false }))}
                className="mt-8 text-xs text-slate-400 underline hover:text-slate-200"
              >
                Tap to Unlock Screen
              </button>
            </div>
          ) : (
            /* Main Embedded Content View */
            <div className="flex-1 relative bg-slate-900">
              {player.isOffline ? (
                /* Offline Fallback Page Simulation */
                <div className="w-full h-full bg-slate-950 p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                    <WifiOff className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">No Internet Connection</h3>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    Local offline fallback handler loaded from <code className="text-blue-400 bg-slate-900 px-1.5 py-0.5 rounded">file:///android_asset/offline.html</code>.
                  </p>
                  <button
                    onClick={() => setPlayer(prev => ({ ...prev, isOffline: false }))}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/30"
                  >
                    Re-establish Stream
                  </button>
                </div>
              ) : (
                /* Embedded WebView Frame loading target URL */
                <iframe
                  key={iframeKey}
                  src={config.targetUrl}
                  title="NAC Choir Stream Web Application"
                  className="w-full h-full border-0"
                  allow="autoplay; camera; microphone; geolocation"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              )}
            </div>
          )}

          {/* Android Navigation Bar Bottom */}
          <div className="bg-slate-950 py-2.5 px-12 flex items-center justify-around border-t border-slate-900 z-30">
            <button className="w-3.5 h-3.5 border-l-2 border-b-2 border-slate-500 transform rotate-45 hover:border-slate-300"></button>
            <button className="w-3.5 h-3.5 rounded-full border-2 border-slate-500 hover:border-slate-300"></button>
            <button className="w-3 h-3 border-2 border-slate-500 hover:border-slate-300"></button>
          </div>

        </div>
      </div>

      {/* Simulator Info & Controls Sidebar */}
      <div className="lg:col-span-6 xl:col-span-7 space-y-6">
        
        {/* Native Status Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Native Android Capabilities</h3>
            </div>
            <a
              href={config.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1"
            >
              <span>Open Remote URL</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl">
              <div className="text-slate-400 text-[11px] mb-1">Target Application</div>
              <div className="font-semibold text-slate-200 truncate">{config.targetUrl}</div>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl">
              <div className="text-slate-400 text-[11px] mb-1">Package Identifier</div>
              <div className="font-semibold text-blue-400 truncate">{config.packageName}</div>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl">
              <div className="text-slate-400 text-[11px] mb-1">Foreground Service</div>
              <div className="font-semibold text-emerald-400 flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Active (MediaPlayback)</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl">
              <div className="text-slate-400 text-[11px] mb-1">Hardware Acceleration</div>
              <div className="font-semibold text-slate-200">
                {config.enableHardwareAcceleration ? 'Enabled (GPU)' : 'Disabled'}
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl">
              <div className="text-slate-400 text-[11px] mb-1">CPU Wake Lock</div>
              <div className="font-semibold text-slate-200">
                {config.enableWakeLock ? 'PARTIAL_WAKE_LOCK' : 'None'}
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl">
              <div className="text-slate-400 text-[11px] mb-1">Target Android API</div>
              <div className="font-semibold text-indigo-400">API 34 (Android 14)</div>
            </div>
          </div>
        </div>

        {/* Features & Android Permissions Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Core Native Architecture Highlights</span>
          </h3>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-start space-x-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0 mt-0.5">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 mb-0.5">Seamless Background Audio Streaming</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Utilizes Android’s <code className="text-blue-300 bg-slate-900 px-1 py-0.5 rounded">FOREGROUND_SERVICE_MEDIA_PLAYBACK</code> type so audio streams continuously even when the app is minimized or screen is locked.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 mb-0.5">MediaSessionCompat & Lock Screen Notification</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Integrates with Android’s system media controls. Hardware media keys, Bluetooth headphones, and smartwatch controls work seamlessly.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 mb-0.5">Security & Offline Resilience</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Network security config enforces HTTPS TLS. When offline, WebView automatically intercepts network failure and loads local asset fallback.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
