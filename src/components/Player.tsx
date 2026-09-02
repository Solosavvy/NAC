import React from 'react'

export default function Player(){
  return (
    <div className="fixed left-0 right-0 bottom-0 z-50 border-t border-zinc-800 player-blur bg-zinc-900-card/60 p-3">
      <div className="max-w-5xl mx-auto flex items-center gap-4">
        <div className="w-12 h-12 bg-zinc-800 rounded flex items-center justify-center">🎵</div>
        <div className="flex-1">
          <div className="font-medium">Not Playing</div>
          <div className="text-xs text-zinc-400">—</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2">Prev</button>
          <button className="p-2 bg-sky-600 text-black rounded-full">Play</button>
          <button className="p-2">Next</button>
        </div>
      </div>
    </div>
  )
}
