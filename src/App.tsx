import React from 'react'
import Header from './components/Header'
import SongList from './components/SongList'
import Player from './components/Player'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4">
        <SongList />
      </main>
      <Player />
    </div>
  )
}
