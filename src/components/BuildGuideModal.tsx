import React, { useState } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Download, 
  Cpu, 
  ExternalLink, 
  AlertCircle,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { AndroidAppConfig } from '../types';

interface BuildGuideProps {
  config: AndroidAppConfig;
  onDownloadZip: () => void;
}

export const BuildGuideModal: React.FC<BuildGuideProps> = ({ config, onDownloadZip }) => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, stepIndex: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepIndex);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const steps = [
    {
      title: '1. Extract Exported ZIP Archive',
      description: 'Click "Export Android ZIP" button above to download the pre-configured native Android repository structure.',
      command: `unzip nac-choir-stream-android.zip\ncd nac-choir-stream-android`
    },
    {
      title: '2. Verify Prerequisites',
      description: 'Ensure JDK 17, Android SDK API 34, and Node.js 18+ are installed on your build machine.',
      command: `java -version\nnode -v\nadb --version`
    },
    {
      title: '3. Initialize Capacitor or Gradle Environment',
      description: 'Install Capacitor Android dependencies and sync native configurations.',
      command: `npm install @capacitor/core @capacitor/cli @capacitor/android\nnpx cap sync android`
    },
    {
      title: '4. Build Native Debug or Release APK',
      description: 'Execute the Gradle wrapper build script to output the compiled APK file.',
      command: `# Grant execution permission\nchmod +x gradlew\n\n# Build Debug APK\n./gradlew assembleDebug\n\n# Output location:\n# app/build/outputs/apk/debug/app-debug.apk`
    },
    {
      title: '5. Install APK Directly onto Android Device',
      description: 'Connect phone via USB with USB Debugging enabled, or drag APK to emulator.',
      command: `adb install app/build/outputs/apk/debug/app-debug.apk`
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <span>Step-by-Step Android APK Compilation Guide</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Follow these commands in your local terminal or CI/CD pipeline to compile this project into a native APK.
          </p>
        </div>

        <button
          onClick={onDownloadZip}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition shadow-lg shadow-blue-600/30 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download Android Project ZIP</span>
        </button>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 flex items-center space-x-2">
                <ChevronRight className="w-4 h-4 text-blue-400" />
                <span>{step.title}</span>
              </h3>
              <button
                onClick={() => copyToClipboard(step.command, idx)}
                className="flex items-center space-x-1 text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 transition"
              >
                {copiedStep === idx ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedStep === idx ? 'Copied' : 'Copy Commands'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {step.description}
            </p>

            <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-3 font-mono text-xs text-blue-300 overflow-x-auto selection:bg-blue-600 selection:text-white">
              <pre className="whitespace-pre-wrap">{step.command}</pre>
            </div>
          </div>
        ))}
      </div>

      {/* Troubleshooting Banner */}
      <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-4 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <h4 className="font-bold text-amber-300">Target Android 14 (API 33/34) Permission Checklist</h4>
          <p className="text-slate-400 leading-relaxed">
            Starting with Android 13/14, apps using foreground audio services must declare both <code className="text-amber-300">FOREGROUND_SERVICE</code> and <code className="text-amber-300">FOREGROUND_SERVICE_MEDIA_PLAYBACK</code> in <code className="text-blue-400">AndroidManifest.xml</code>. This package includes all required permissions out of the box!
          </p>
        </div>
      </div>

    </div>
  );
};
