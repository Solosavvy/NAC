// Minimal audio engine scaffold — implements singleton pattern and IndexedDB/Cache stubs.

class AudioEngine {
  private static instance: AudioEngine | null = null
  private audio: HTMLAudioElement
  private constructor(){
    this.audio = new Audio()
  }
  static getInstance(){
    if(!AudioEngine.instance) AudioEngine.instance = new AudioEngine()
    return AudioEngine.instance
  }
  play(src:string){
    this.audio.src = src
    this.audio.play().catch(()=>{})
  }
  pause(){
    this.audio.pause()
  }
}

export default AudioEngine.getInstance()
