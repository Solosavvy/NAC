import React from 'react'

function Skeleton(){
  return <div className="h-20 bg-zinc-800 animate-pulse rounded mb-3" />
}

export default function SongList(){
  // This is a scaffold. Replace with loader that reads /index.json
  const loading = false
  const songs: Array<any> = []

  if(loading) return (<div><Skeleton/><Skeleton/><Skeleton/></div>)
  if(songs.length === 0) return (
    <div className="text-center text-zinc-400 mt-20">
      <div className="mb-4">No hymns found</div>
      <button className="px-3 py-1 bg-sky-600 text-black rounded">Reset Search</button>
    </div>
  )

  return (
    <div className="space-y-3">
      {/* map songs to SongCard */}
    </div>
  )
}
