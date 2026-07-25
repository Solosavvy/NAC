import React from 'react';
import { 
  Radio, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Smartphone, 
  Zap, 
  Activity, 
  Lock, 
  Wifi, 
  ArrowRight, 
  CheckCircle2
} from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-8">
      
      {/* Title */}
      <div>
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <span>Android Background Audio & Foreground Service Architecture</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Detailed breakdown of how the native Kotlin wrapper layer interacts with Android OS services and the remote web stream.
        </p>
      </div>

      {/* Visual Flow Diagram Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        
        {/* Step 1 */}
        <div className="bg-slate-950 border border-blue-500/30 rounded-2xl p-4 flex flex-col justify-between shadow-xl relative">
          <div className="space-y-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="text-xs font-bold text-slate-100 flex items-center space-x-1.5">
              <Smartphone className="w-4 h-4 text-blue-400" />
              <span>Embedded WebView</span>
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Loads <code className="text-blue-300">nac-choir-stream.ai.studio</code> with JS Bridge Enabled and GPU Hardware Acceleration.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
            MainActivity.kt
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between shadow-xl relative">
          <div className="space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="text-xs font-bold text-slate-100 flex items-center space-x-1.5">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>Foreground Service</span>
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Promotes process priority with <code className="text-emerald-300">FOREGROUND_SERVICE_MEDIA_PLAYBACK</code> to prevent Doze termination.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
            BackgroundAudioService.kt
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-4 flex flex-col justify-between shadow-xl relative">
          <div className="space-y-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="text-xs font-bold text-slate-100 flex items-center space-x-1.5">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>WakeLock & Wi-Fi</span>
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Acquires <code className="text-amber-300">PARTIAL_WAKE_LOCK</code> keeping CPU cores and network sockets active during screen lock.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
            PowerManager & WifiLock
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-4 flex flex-col justify-between shadow-xl relative">
          <div className="space-y-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h3 className="text-xs font-bold text-slate-100 flex items-center space-x-1.5">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>MediaSessionCompat</span>
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Binds hardware media buttons, lock screen media controls, and Bluetooth headsets for seamless playback control.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
            MediaNotificationManager
          </div>
        </div>

      </div>

      {/* Deep Technical Specs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
        
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-slate-200 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Why Standard WebViews Stop Playing in Background</span>
          </h3>
          <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside leading-relaxed">
            <li>
              <strong className="text-slate-300">Android Doze Mode:</strong> When the device is idle or screen locks, Android restricts CPU and network access for standard apps.
            </li>
            <li>
              <strong className="text-slate-300">WebView Suspension:</strong> Standard WebViews pause JavaScript timers and audio contexts when the Activity moves to background.
            </li>
            <li>
              <strong className="text-slate-300">Memory Pressure Kills:</strong> OS background tasks without an active Foreground Notification get terminated when RAM is needed.
            </li>
          </ul>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-slate-200 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>How This Native Wrapper Fixes It</span>
          </h3>
          <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside leading-relaxed">
            <li>
              <strong className="text-slate-300">MediaPlayback Foreground Service:</strong> Elevates OS process rank, rendering the stream immune to background task killers.
            </li>
            <li>
              <strong className="text-slate-300">Partial WakeLock:</strong> Holds a high-efficiency CPU wake lock so stream buffering continues across lock screens.
            </li>
            <li>
              <strong className="text-slate-300">Audio Focus Request:</strong> Automatically handles incoming calls or audio interruptions by pausing and resuming gracefully.
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
};
