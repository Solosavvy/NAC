import React from 'react';
import { 
  Settings, 
  Smartphone, 
  Radio, 
  Zap, 
  ShieldCheck, 
  Palette, 
  RotateCcw,
  Sliders,
  Bell
} from 'lucide-react';
import { AndroidAppConfig } from '../types';

interface ConfigPanelProps {
  config: AndroidAppConfig;
  onChangeConfig: (updated: Partial<AndroidAppConfig>) => void;
  onReset: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onChangeConfig, onReset }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            <span>Android Project Configuration Studio</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Modifying settings automatically updates all Kotlin classes, Gradle builds, Capacitor settings, and AndroidManifest files in real-time.
          </p>
        </div>

        <button
          onClick={onReset}
          className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-xl border border-slate-700 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Section 1: Application Identity */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-2">
            <Smartphone className="w-4 h-4" />
            <span>App Identity & Target URL</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Target Remote Web Application URL
              </label>
              <input
                type="url"
                value={config.targetUrl}
                onChange={e => onChangeConfig({ targetUrl: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                placeholder="https://nac-choir-stream.ai.studio"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Android Package Name (Application ID)
              </label>
              <input
                type="text"
                value={config.packageName}
                onChange={e => onChangeConfig({ packageName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-blue-400 font-mono focus:outline-none focus:border-blue-500"
                placeholder="com.nac.choir.stream"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Application Display Name
              </label>
              <input
                type="text"
                value={config.appName}
                onChange={e => onChangeConfig({ appName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                placeholder="NAC Choir Stream"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Version Name
                </label>
                <input
                  type="text"
                  value={config.versionName}
                  onChange={e => onChangeConfig({ versionName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Version Code
                </label>
                <input
                  type="number"
                  value={config.versionCode}
                  onChange={e => onChangeConfig({ versionCode: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Background Audio & Permissions */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
            <Radio className="w-4 h-4" />
            <span>Foreground Service & Audio Permissions</span>
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center space-x-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={config.enableForegroundService}
                onChange={e => onChangeConfig({ enableForegroundService: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-950 border-slate-700"
              />
              <div>
                <div className="font-semibold text-slate-200">
                  Enable Foreground Service (Media Playback)
                </div>
                <div className="text-[11px] text-slate-400">
                  Requests <code className="text-blue-300">FOREGROUND_SERVICE_MEDIA_PLAYBACK</code> to prevent OS audio teardown.
                </div>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={config.enableWakeLock}
                onChange={e => onChangeConfig({ enableWakeLock: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-950 border-slate-700"
              />
              <div>
                <div className="font-semibold text-slate-200">
                  Acquire CPU Partial WakeLock
                </div>
                <div className="text-[11px] text-slate-400">
                  Requests <code className="text-blue-300">WAKE_LOCK</code> to keep network sockets active during screen sleep.
                </div>
              </div>
            </label>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Notification Channel Name
              </label>
              <input
                type="text"
                value={config.notificationChannelName}
                onChange={e => onChangeConfig({ notificationChannelName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Notification Default Title
              </label>
              <input
                type="text"
                value={config.notificationTitle}
                onChange={e => onChangeConfig({ notificationTitle: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Hardware Acceleration & Caching */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Hardware & Caching Settings</span>
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center space-x-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={config.enableHardwareAcceleration}
                onChange={e => onChangeConfig({ enableHardwareAcceleration: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-950 border-slate-700"
              />
              <div>
                <div className="font-semibold text-slate-200">
                  Full GPU Hardware Acceleration
                </div>
                <div className="text-[11px] text-slate-400">
                  Enables hardware accelerated canvas and audio decode pipeline.
                </div>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={config.enableDomStorage}
                onChange={e => onChangeConfig({ enableDomStorage: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-950 border-slate-700"
              />
              <div>
                <div className="font-semibold text-slate-200">
                  Enable DOM Storage & LocalCache
                </div>
                <div className="text-[11px] text-slate-400">
                  Allows localStorage and IndexedDB persistence inside WebView.
                </div>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={config.cleartextTrafficAllowed}
                onChange={e => onChangeConfig({ cleartextTrafficAllowed: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-950 border-slate-700"
              />
              <div>
                <div className="font-semibold text-slate-200">
                  Allow Cleartext Traffic (HTTP)
                </div>
                <div className="text-[11px] text-slate-400">
                  Keep disabled for HTTPS production stream security.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Section 4: Visual Theme & Styling */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>Theme Colors & Splash Window</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Primary Brand Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={config.primaryColor}
                  onChange={e => onChangeConfig({ primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-xl border border-slate-800 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={config.primaryColor}
                  onChange={e => onChangeConfig({ primaryColor: e.target.value })}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Window Background Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={config.backgroundColor}
                  onChange={e => onChangeConfig({ backgroundColor: e.target.value })}
                  className="w-10 h-10 rounded-xl border border-slate-800 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={config.backgroundColor}
                  onChange={e => onChangeConfig({ backgroundColor: e.target.value })}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Splash Screen Duration (ms)
              </label>
              <input
                type="number"
                value={config.splashDuration}
                onChange={e => onChangeConfig({ splashDuration: parseInt(e.target.value) || 2000 })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
