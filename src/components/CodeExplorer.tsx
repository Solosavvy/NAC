import React, { useState } from 'react';
import { 
  FileCode, 
  Folder, 
  FolderOpen, 
  FileText, 
  Copy, 
  Check, 
  Search, 
  Download, 
  ExternalLink,
  Code2,
  Cpu,
  Shield,
  Layers,
  FileJson
} from 'lucide-react';
import { ProjectFile } from '../types';

interface CodeExplorerProps {
  files: ProjectFile[];
  onDownloadZip: () => void;
}

export const CodeExplorer: React.FC<CodeExplorerProps> = ({ files, onDownloadZip }) => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(files[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.path.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || f.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryIcon = (category: ProjectFile['category']) => {
    switch (category) {
      case 'manifest':
        return <Shield className="w-4 h-4 text-rose-400" />;
      case 'kotlin':
        return <Cpu className="w-4 h-4 text-indigo-400" />;
      case 'gradle':
        return <Layers className="w-4 h-4 text-emerald-400" />;
      case 'layout':
      case 'res':
        return <FileCode className="w-4 h-4 text-amber-400" />;
      case 'config':
        return <FileJson className="w-4 h-4 text-blue-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row h-[780px]">
      
      {/* File Tree Left Sidebar */}
      <div className="w-full lg:w-80 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
        
        {/* Sidebar Header & Search */}
        <div className="p-3.5 border-b border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
              <FolderOpen className="w-4 h-4 text-blue-400" />
              <span>Android Project Tree</span>
            </h3>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
              {files.length} Files
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter Android files..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 placeholder-slate-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-[11px] no-scrollbar">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-2 py-0.5 rounded-md font-medium whitespace-nowrap transition ${
                filterCategory === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterCategory('manifest')}
              className={`px-2 py-0.5 rounded-md font-medium whitespace-nowrap transition ${
                filterCategory === 'manifest' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              Manifest
            </button>
            <button
              onClick={() => setFilterCategory('kotlin')}
              className={`px-2 py-0.5 rounded-md font-medium whitespace-nowrap transition ${
                filterCategory === 'kotlin' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              Kotlin
            </button>
            <button
              onClick={() => setFilterCategory('gradle')}
              className={`px-2 py-0.5 rounded-md font-medium whitespace-nowrap transition ${
                filterCategory === 'gradle' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              Gradle
            </button>
          </div>
        </div>

        {/* File Tree Items List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-900/50">
          {filteredFiles.map((file) => {
            const isSelected = selectedFile.path === file.path;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-3 py-2 rounded-xl transition flex items-start space-x-2.5 ${
                  isSelected
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <div className="mt-0.5">{getCategoryIcon(file.category)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate leading-tight">{file.name}</div>
                  <div className="text-[10px] text-slate-500 truncate font-mono mt-0.5">{file.path}</div>
                </div>
              </button>
            );
          })}

          {filteredFiles.length === 0 && (
            <div className="p-6 text-center text-xs text-slate-500">
              No matching Android files found.
            </div>
          )}
        </div>

        {/* Download Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950">
          <button
            onClick={onDownloadZip}
            className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center space-x-2 transition"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Download All as ZIP</span>
          </button>
        </div>

      </div>

      {/* Code Viewer Panel Right */}
      <div className="flex-1 flex flex-col bg-slate-900 min-w-0">
        
        {/* Code Editor Header */}
        <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            {getCategoryIcon(selectedFile.category)}
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-xs font-bold text-slate-100 font-mono">{selectedFile.path}</h4>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono uppercase">
                  {selectedFile.language}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-lg mt-0.5">
                {selectedFile.description}
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition shrink-0 ml-3"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Code View Body */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs text-slate-200 leading-relaxed selection:bg-blue-600 selection:text-white">
          <pre className="whitespace-pre">
            {selectedFile.content.split('\n').map((line, idx) => (
              <div key={idx} className="table-row hover:bg-slate-900/60">
                <span className="table-cell pr-4 text-right select-none text-slate-600 text-[11px] w-10">
                  {idx + 1}
                </span>
                <span className="table-cell pl-2">{line}</span>
              </div>
            ))}
          </pre>
        </div>

      </div>

    </div>
  );
};
