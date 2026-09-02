// indexJsonLoader: resilient parser for different index.json shapes

export type Song = {
  id: string
  title: string
  artist?: string
  duration?: number
  url?: string
}

export function parseIndexJson(data: any): Song[]{
  if(!data) return []
  if(Array.isArray(data)) return data as Song[]
  if(Array.isArray(data.songs)) return data.songs as Song[]
  if(data.sections && typeof data.sections === 'object'){
    const out: Song[] = []
    Object.values(data.sections).forEach((sec:any)=>{
      if(Array.isArray(sec)) out.push(...sec)
      if(Array.isArray(sec.songs)) out.push(...sec.songs)
    })
    return out
  }
  return []
}
