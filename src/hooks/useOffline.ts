import { useState, useEffect } from 'react'

export default function useOffline(){
  const [downloaded, setDownloaded] = useState<number>(0)
  useEffect(()=>{
    // placeholder: count from IndexedDB/cache
    setDownloaded(0)
  },[])
  return { downloaded }
}
