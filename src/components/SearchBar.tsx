import React from 'react'

export default function SearchBar(){
  return (
    <div className="relative">
      <input placeholder="Search hymns, number, choir, category..." className="w-full bg-zinc-800 text-white rounded-md px-3 py-2 placeholder:text-zinc-400" />
      <button className="absolute right-1 top-1/2 -translate-y-1/2 px-2 text-zinc-300">Clear</button>
    </div>
  )
}
