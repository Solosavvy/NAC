import React from 'react'
import Logo from '../icons/Logo'
import SearchBar from './SearchBar'

export default function Header(){
  return (
    <header className="sticky top-0 z-40 bg-zinc-900-card border-b border-zinc-800 p-3">
      <div className="max-w-5xl mx-auto flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Logo className="w-12 h-12 rounded-md p-1 bg-gradient-to-br from-sky-600 to-indigo-600" />
          <div>
            <div className="font-semibold text-lg">NAC Choir</div>
            <div className="text-xs text-zinc-400">Sacred Hymns & Audio</div>
          </div>
        </div>
        <div className="flex-1">
          <SearchBar />
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-sky-600 text-black rounded">Install App</button>
          <button className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded">Downloads <span className="ml-2 inline-block bg-sky-400 text-black px-2 rounded-full text-xs">0</span></button>
        </div>
      </div>
    </header>
  )
}
