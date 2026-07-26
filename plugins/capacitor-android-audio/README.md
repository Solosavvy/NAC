# Capacitor Android Background Audio Plugin

This plugin provides a native Android Foreground Service using ExoPlayer to allow reliable background audio playback (notification, media controls, audio focus), intended for inclusion into a Capacitor Android project.

Important notes
- This repo does not contain a generated `android/` platform directory. The workflow will run `npx cap add android` in CI to create it and then copy the plugin files into place.
- Add the ExoPlayer dependency to `android/app/build.gradle` (the CI workflow attempts to insert it automatically).
- You must test on real devices.

Usage (JS)
```ts
import Audio from './plugins/capacitor-android-audio/src';

// Start playback (service will run foreground)
await Audio.start({ url: 'https://example.com/stream.mp3', title: 'NAC', text: 'Now playing' });

// Pause/Resume
await Audio.pause();
await Audio.play();

// Stop and remove notification
await Audio.stop();
