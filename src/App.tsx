import React, { useState, useMemo } from 'react';
import JSZip from 'jszip';
import { ActiveTab, AndroidAppConfig } from './types';
import { defaultConfig, generateAndroidProjectFiles } from './data/androidFilesGenerator';
import { Header } from './components/Header';
import { PhoneSimulator } from './components/PhoneSimulator';
import { CodeExplorer } from './components/CodeExplorer';
import { ConfigPanel } from './components/ConfigPanel';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { BuildGuideModal } from './components/BuildGuideModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');
  const [config, setConfig] = useState<AndroidAppConfig>(defaultConfig);
  const [isDownloading, setIsDownloading] = useState(false);

  // Generate all Android native project files reactively based on current config settings
  const projectFiles = useMemo(() => {
    return generateAndroidProjectFiles(config);
  }, [config]);

  const handleUpdateConfig = (updated: Partial<AndroidAppConfig>) => {
    setConfig(prev => ({ ...prev, ...updated }));
  };

  const handleResetConfig = () => {
    setConfig(defaultConfig);
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const zip = new JSZip();

      // Add each file into the zip preserving exact relative path structure
      projectFiles.forEach(file => {
        zip.file(file.path, file.content);
      });

      // Add root README.md if not present
      if (!projectFiles.some(f => f.path === 'README.md')) {
        zip.file('README.md', '# NAC Choir Stream Android App Package\n\nCompiled via AI Studio Android Native Builder.');
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${config.packageName.replace(/\./g, '-')}-android.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating project ZIP:', error);
      alert('Failed to generate ZIP. Please try copying files individually.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white antialiased">
      
      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadZip={handleDownloadZip}
        isDownloading={isDownloading}
        config={config}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <PhoneSimulator config={config} />
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-6">
            <CodeExplorer files={projectFiles} onDownloadZip={handleDownloadZip} />
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-6">
            <ConfigPanel
              config={config}
              onChangeConfig={handleUpdateConfig}
              onReset={handleResetConfig}
            />
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <ArchitectureDiagram />
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="space-y-6">
            <BuildGuideModal config={config} onDownloadZip={handleDownloadZip} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>NAC Choir Stream - Native Android App Package & Foreground Audio Studio</span>
          <span className="font-mono text-[11px] text-slate-400">
            Target URL: <code className="text-blue-400">{config.targetUrl}</code>
          </span>
        </div>
      </footer>

    </div>
  );
}
