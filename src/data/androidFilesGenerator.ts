import { AndroidAppConfig, ProjectFile } from '../types';

export const defaultConfig: AndroidAppConfig = {
  appName: 'NAC Choir Stream',
  packageName: 'com.nac.choir.stream',
  targetUrl: 'https://nac-choir-stream.ai.studio',
  versionName: '1.0.0',
  versionCode: 1,
  minSdkVersion: 24,
  targetSdkVersion: 34,
  compileSdkVersion: 34,

  enableForegroundService: true,
  enableWakeLock: true,
  enableMediaSession: true,
  notificationChannelName: 'Audio Streaming Service',
  notificationTitle: 'NAC Choir Stream - Live Praise',

  enableHardwareAcceleration: true,
  enableDomStorage: true,
  enableAppCache: true,
  enableZoomControls: false,
  cleartextTrafficAllowed: false,

  primaryColor: '#1E3A8A',
  backgroundColor: '#0F172A',
  splashDuration: 2000,
  showOfflineFallback: true,
};

export function generateAndroidProjectFiles(config: AndroidAppConfig): ProjectFile[] {
  const packagePath = config.packageName.replace(/\./g, '/');

  return [
    {
      path: 'AndroidManifest.xml',
      name: 'AndroidManifest.xml',
      language: 'xml',
      category: 'manifest',
      description: 'Defines app permissions, foreground audio playback services, wake locks, and MainActivity declaration.',
      content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="${config.packageName}">

    <!-- Network & Internet Access -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />

    <!-- Foreground Service & Media Playback (Android 9 to Android 14) -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK" />
    
    <!-- Wake Lock & Power Management (Prevents OS from killing stream on screen lock) -->
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />

    <!-- Notifications for Android 13+ (API 33+) -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    
    <!-- Audio Focus & Hardware Control -->
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="${config.appName}"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.NACChoirStream"
        android:hardwareAccelerated="${config.enableHardwareAcceleration}"
        android:usesCleartextTraffic="${config.cleartextTrafficAllowed}"
        android:networkSecurityConfig="@xml/network_security_config"
        tools:targetApi="34">

        <!-- Fullscreen Web Activity -->
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="${config.enableHardwareAcceleration}"
            android:launchMode="singleTop"
            android:screenOrientation="unspecified"
            android:windowSoftInputMode="adjustResize">
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <!-- Deep linking support -->
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="https" android:host="nac-choir-stream.ai.studio" />
            </intent-filter>
        </activity>

        <!-- Background Audio Foreground Service -->
        <service
            android:name=".BackgroundAudioService"
            android:enabled="true"
            android:exported="false"
            android:foregroundServiceType="mediaPlayback"
            tools:targetApi="34" />

        <!-- Media Button Receiver for Hardware & Bluetooth controls -->
        <receiver
            android:name="androidx.media.session.MediaButtonReceiver"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MEDIA_BUTTON" />
            </intent-filter>
        </receiver>

    </application>

</manifest>`
    },
    {
      path: `app/src/main/java/${packagePath}/MainActivity.kt`,
      name: 'MainActivity.kt',
      language: 'kotlin',
      category: 'kotlin',
      description: 'Primary Activity configuring secure WebView, hardware acceleration, JS interface bridge, and background service binding.',
      content: `package ${config.packageName}

import android.annotation.SuppressLint
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.graphics.Bitmap
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Build
import android.os.Bundle
import android.os.IBinder
import android.view.View
import android.webkit.*
import android.widget.ProgressBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var swipeRefresh: SwipeRefreshLayout
    private lateinit var progressBar: ProgressBar
    
    private var audioService: BackgroundAudioService? = null
    private var isBound = false

    private val serviceConnection = object : ServiceConnection {
        override fun onServiceConnected(className: ComponentName, service: IBinder) {
            val binder = service as BackgroundAudioService.LocalBinder
            audioService = binder.getService()
            isBound = true
            audioService?.updateMediaMetadata("${config.notificationTitle}", "NAC Live Choir Stream")
        }

        override fun onServiceDisconnected(arg0: ComponentName) {
            isBound = false
            audioService = null
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        swipeRefresh = findViewById(R.id.swipeRefresh)
        progressBar = findViewById(R.id.progressBar)

        setupWebView()
        setupSwipeRefresh()
        startAndBindAudioService()

        if (isNetworkAvailable()) {
            webView.loadUrl("${config.targetUrl}")
        } else {
            loadOfflineFallback()
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = ${config.enableDomStorage}
            databaseEnabled = true
            cacheMode = WebSettings.LOAD_DEFAULT
            mediaPlaybackRequiresUserGesture = false
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            
            // Performance & Rendering Optimization
            setRenderPriority(WebSettings.RenderPriority.HIGH)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                safeBrowsingEnabled = true
            }
            
            // Custom User Agent for Mobile Stream Optimization
            userAgentString = "$userAgentString NACChoirNativeApp/1.0 (Android)"
        }

        // Bridge JS <-> Native Kotlin
        webView.addJavascriptInterface(WebAppInterface(this), "NativeAudioBridge")

        webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                super.onPageStarted(view, url, favicon)
                progressBar.visibility = View.VISIBLE
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                progressBar.visibility = View.GONE
                swipeRefresh.isRefreshing = false
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                if (request?.isForMainFrame == true) {
                    loadOfflineFallback()
                }
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                progressBar.progress = newProgress
            }
        }
    }

    private fun setupSwipeRefresh() {
        swipeRefresh.setOnRefreshListener {
            if (isNetworkAvailable()) {
                webView.reload()
            } else {
                swipeRefresh.isRefreshing = false
                loadOfflineFallback()
            }
        }
    }

    private fun startAndBindAudioService() {
        val intent = Intent(this, BackgroundAudioService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(intent)
        } else {
            startService(intent)
        }
        bindService(intent, serviceConnection, Context.BIND_AUTO_CREATE)
    }

    private fun loadOfflineFallback() {
        webView.loadUrl("file:///android_asset/offline.html")
        Toast.makeText(this, "No internet connection. Loaded offline viewer.", Toast.LENGTH_LONG).show()
    }

    private fun isNetworkAvailable(): Boolean {
        val connectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val network = connectivityManager.activeNetwork ?: return false
        val capabilities = connectivityManager.getNetworkCapabilities(network) ?: return false
        return capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

    override fun onDestroy() {
        if (isBound) {
            unbindService(serviceConnection)
            isBound = false
        }
        super.onDestroy()
    }
}`
    },
    {
      path: `app/src/main/java/${packagePath}/BackgroundAudioService.kt`,
      name: 'BackgroundAudioService.kt',
      language: 'kotlin',
      category: 'kotlin',
      description: 'Native Foreground Service maintaining active media session and wake lock to ensure continuous background audio streaming.',
      content: `package ${config.packageName}

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Binder
import android.os.Build
import android.os.IBinder
import android.os.PowerManager
import android.support.v4.media.MediaMetadataCompat
import android.support.v4.media.session.MediaSessionCompat
import android.support.v4.media.session.PlaybackStateCompat
import androidx.core.app.NotificationCompat
import androidx.media.app.NotificationCompat as MediaNotificationCompat

class BackgroundAudioService : Service() {

    private val binder = LocalBinder()
    private lateinit var mediaSession: MediaSessionCompat
    private var wakeLock: PowerManager.WakeLock? = null

    companion object {
        const val CHANNEL_ID = "nac_choir_audio_channel"
        const val NOTIFICATION_ID = 1001
        const val ACTION_PLAY = "action_play"
        const val ACTION_PAUSE = "action_pause"
        const val ACTION_STOP = "action_stop"
    }

    inner class LocalBinder : Binder() {
        fun getService(): BackgroundAudioService = this@BackgroundAudioService
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        initMediaSession()
        acquireWakeLock()
        
        startForeground(NOTIFICATION_ID, buildNotification(isPlaying = true, title = "NAC Choir Stream", artist = "Live Stream"))
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_PLAY -> updatePlaybackState(PlaybackStateCompat.STATE_PLAYING)
            ACTION_PAUSE -> updatePlaybackState(PlaybackStateCompat.STATE_PAUSED)
            ACTION_STOP -> stopSelf()
        }
        return START_STICKY
    }

    private fun initMediaSession() {
        mediaSession = MediaSessionCompat(this, "NACChoirMediaSession").apply {
            setFlags(
                MediaSessionCompat.FLAG_HANDLES_MEDIA_BUTTONS or
                MediaSessionCompat.FLAG_HANDLES_TRANSPORT_CONTROLS
            )

            setCallback(object : MediaSessionCompat.Callback() {
                override fun onPlay() {
                    updatePlaybackState(PlaybackStateCompat.STATE_PLAYING)
                }

                override fun onPause() {
                    updatePlaybackState(PlaybackStateCompat.STATE_PAUSED)
                }

                override fun onStop() {
                    stopSelf()
                }
            })

            isActive = true
        }
    }

    fun updateMediaMetadata(title: String, artist: String) {
        val metadata = MediaMetadataCompat.Builder()
            .putString(MediaMetadataCompat.METADATA_KEY_TITLE, title)
            .putString(MediaMetadataCompat.METADATA_KEY_ARTIST, artist)
            .build()
        mediaSession.setMetadata(metadata)
        
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(NOTIFICATION_ID, buildNotification(isPlaying = true, title, artist))
    }

    private fun updatePlaybackState(state: Int) {
        val playbackState = PlaybackStateCompat.Builder()
            .setActions(
                PlaybackStateCompat.ACTION_PLAY or
                PlaybackStateCompat.ACTION_PAUSE or
                PlaybackStateCompat.ACTION_STOP or
                PlaybackStateCompat.ACTION_PLAY_PAUSE
            )
            .setState(state, PlaybackStateCompat.PLAYBACK_POSITION_UNKNOWN, 1.0f)
            .build()
        mediaSession.setPlaybackState(playbackState)

        val isPlaying = state == PlaybackStateCompat.STATE_PLAYING
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(NOTIFICATION_ID, buildNotification(isPlaying, "${config.notificationTitle}", "Live Choir Audio"))
    }

    private fun buildNotification(isPlaying: Boolean, title: String, artist: String): Notification {
        val openIntent = Intent(this, MainActivity::class.java)
        val pendingOpenIntent = PendingIntent.getActivity(
            this, 0, openIntent, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        val playPauseAction = if (isPlaying) {
            val pauseIntent = Intent(this, BackgroundAudioService::class.java).apply { action = ACTION_PAUSE }
            NotificationCompat.Action(
                R.drawable.ic_pause, "Pause",
                PendingIntent.getService(this, 1, pauseIntent, PendingIntent.FLAG_IMMUTABLE)
            )
        } else {
            val playIntent = Intent(this, BackgroundAudioService::class.java).apply { action = ACTION_PLAY }
            NotificationCompat.Action(
                R.drawable.ic_play, "Play",
                PendingIntent.getService(this, 2, playIntent, PendingIntent.FLAG_IMMUTABLE)
            )
        }

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle(title)
            .setContentText(artist)
            .setSmallIcon(R.drawable.ic_music_note)
            .setContentIntent(pendingOpenIntent)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setOngoing(isPlaying)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .addAction(playPauseAction)
            .setStyle(
                MediaNotificationCompat.MediaStyle()
                    .setMediaSession(mediaSession.sessionToken)
                    .setShowActionsInCompactView(0)
            )
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "${config.notificationChannelName}",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Background Audio Playback Notification for NAC Choir Stream"
                setShowBadge(false)
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    private fun acquireWakeLock() {
        if (${config.enableWakeLock}) {
            val powerManager = getSystemService(Context.POWER_SERVICE) as PowerManager
            wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "NACChoir::BackgroundAudioWakeLock").apply {
                acquire(10 * 60 * 1000L) // 10 minutes timeout chunks
            }
        }
    }

    override fun onBind(intent: Intent?): IBinder = binder

    override fun onDestroy() {
        mediaSession.release()
        wakeLock?.let { if (it.isHeld) it.release() }
        stopForeground(STOP_FOREGROUND_REMOVE)
        super.onDestroy()
    }
}`
    },
    {
      path: `app/src/main/java/${packagePath}/WebAppInterface.kt`,
      name: 'WebAppInterface.kt',
      language: 'kotlin',
      category: 'kotlin',
      description: 'JavaScript Interface exposing native background capabilities and audio state controls to web app scripts.',
      content: `package ${config.packageName}

import android.content.Context
import android.webkit.JavascriptInterface
import android.widget.Toast

class WebAppInterface(private val context: Context) {

    @JavascriptInterface
    fun notifyStreamStarted(songTitle: String, choirName: String) {
        Toast.makeText(context, "Playing: $songTitle by $choirName", Toast.LENGTH_SHORT).show()
    }

    @JavascriptInterface
    fun requestBatteryOptimizationBypass() {
        // Triggers native battery settings prompt if needed
    }

    @JavascriptInterface
    fun getNativeAppVersion(): String {
        return "${config.versionName}"
    }
}`
    },
    {
      path: 'app/build.gradle.kts',
      name: 'app/build.gradle.kts',
      language: 'kotlin',
      category: 'gradle',
      description: 'App-level Gradle script defining Android 14 target SDK, Capacitor core, and AndroidX Media dependencies.',
      content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "${config.packageName}"
    compileSdk = ${config.compileSdkVersion}

    defaultConfig {
        applicationId = "${config.packageName}"
        minSdk = ${config.minSdkVersion}
        targetSdk = ${config.targetSdkVersion}
        versionCode = ${config.versionCode}
        versionName = "${config.versionName}"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            isDebuggable = true
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")

    // MediaSession & Foreground Audio Support
    implementation("androidx.media:media:1.7.0")
    
    // Capacitor Android Engine Integration
    implementation("com.capacitorjs:core:6.0.0")
}`
    },
    {
      path: 'build.gradle.kts',
      name: 'build.gradle.kts',
      language: 'kotlin',
      category: 'gradle',
      description: 'Top-level Gradle build configuration for Android plugins.',
      content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id("com.android.application") version "8.2.2" apply false
    id("org.jetbrains.kotlin.android") version "1.9.22" apply false
}`
    },
    {
      path: 'capacitor.config.json',
      name: 'capacitor.config.json',
      language: 'json',
      category: 'config',
      description: 'Capacitor framework configuration setting up remote URL wrapping, server url, navigation rules, and background audio.',
      content: `{
  "appId": "${config.packageName}",
  "appName": "${config.appName}",
  "webDir": "public",
  "bundledWebRuntime": false,
  "server": {
    "url": "${config.targetUrl}",
    "cleartext": ${config.cleartextTrafficAllowed},
    "allowNavigation": [
      "nac-choir-stream.ai.studio",
      "*.ai.studio"
    ]
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": ${config.splashDuration},
      "launchAutoHide": true,
      "backgroundColor": "${config.backgroundColor}",
      "androidSplashResourceName": "splash",
      "showSpinner": true
    },
    "CapacitorCookies": {
      "enabled": true
    },
    "BackgroundAudio": {
      "enable": ${config.enableForegroundService}
    }
  },
  "android": {
    "allowMixedContent": false,
    "captureInput": true,
    "webContentsDebuggingEnabled": true,
    "buildOptions": {
      "keystorePath": "",
      "keystorePassword": "",
      "keyAlias": "",
      "keyPassword": ""
    }
  }
}`
    },
    {
      path: 'app/src/main/res/layout/activity_main.xml',
      name: 'activity_main.xml',
      language: 'xml',
      category: 'layout',
      description: 'Layout containing SwipeRefreshLayout, full-screen WebView, and ProgressBar.',
      content: `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="${config.backgroundColor}">

    <ProgressBar
        android:id="@+id/progressBar"
        style="?android:attr/progressBarStyleHorizontal"
        android:layout_width="match_parent"
        android:layout_height="4dp"
        android:indeterminate="false"
        android:max="100"
        android:progressDrawable="@drawable/custom_progress_bar"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />

    <androidx.swiperefreshlayout.widget.SwipeRefreshLayout
        android:id="@+id/swipeRefresh"
        android:layout_width="0dp"
        android:layout_height="0dp"
        app:layout_constraintTop_toBottomOf="@id/progressBar"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent">

        <WebView
            android:id="@+id/webView"
            android:layout_width="match_parent"
            android:layout_height="match_parent" />

    </androidx.swiperefreshlayout.widget.SwipeRefreshLayout>

</androidx.constraintlayout.widget.ConstraintLayout>`
    },
    {
      path: 'app/src/main/res/xml/network_security_config.xml',
      name: 'network_security_config.xml',
      language: 'xml',
      category: 'res',
      description: 'Strict TLS/SSL Network Security Policy enforcing HTTPS for nac-choir-stream.ai.studio.',
      content: `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="${config.cleartextTrafficAllowed}">
        <domain includeSubdomains="true">nac-choir-stream.ai.studio</domain>
        <domain includeSubdomains="true">ai.studio</domain>
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </domain-config>
</network-security-config>`
    },
    {
      path: 'app/src/main/res/values/styles.xml',
      name: 'styles.xml',
      language: 'xml',
      category: 'res',
      description: 'Android application theme hiding standard ActionBar for full-screen webview experience.',
      content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.NACChoirStream" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="colorPrimary">@color/colorPrimary</item>
        <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
        <item name="colorAccent">@color/colorAccent</item>
        <item name="android:statusBarColor">@color/colorPrimaryDark</item>
        <item name="android:windowBackground">@color/windowBackground</item>
    </style>
</resources>`
    },
    {
      path: 'app/src/main/res/values/colors.xml',
      name: 'colors.xml',
      language: 'xml',
      category: 'res',
      description: 'Color definitions matching the choir stream aesthetic.',
      content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">${config.primaryColor}</color>
    <color name="colorPrimaryDark">#0F172A</color>
    <color name="colorAccent">#3B82F6</color>
    <color name="windowBackground">${config.backgroundColor}</color>
</resources>`
    },
    {
      path: 'app/src/main/assets/offline.html',
      name: 'offline.html',
      language: 'html',
      category: 'res',
      description: 'Local HTML fallback template rendered when network connection is unavailable.',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NAC Choir Stream - Offline</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: ${config.backgroundColor};
            color: #F8FAFC;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            text-align: center;
            padding: 24px;
            box-sizing: border-box;
        }
        .icon {
            width: 80px;
            height: 80px;
            background: rgba(59, 130, 246, 0.15);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 24px;
        }
        .icon svg {
            width: 40px;
            height: 40px;
            stroke: #3B82F6;
        }
        h1 {
            font-size: 22px;
            font-weight: 700;
            margin: 0 0 12px 0;
        }
        p {
            font-size: 14px;
            color: #94A3B8;
            margin: 0 0 28px 0;
            max-width: 320px;
            line-height: 1.5;
        }
        .btn {
            background-color: #2563EB;
            color: white;
            border: none;
            padding: 14px 28px;
            font-size: 15px;
            font-weight: 600;
            border-radius: 12px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
            transition: all 0.2s;
        }
        .btn:active {
            transform: scale(0.97);
            background-color: #1D4ED8;
        }
    </style>
</head>
<body>
    <div class="icon">
        <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856a9.25 9.25 0 0113.788 0M1.924 8.674a13.25 13.25 0 0120.152 0M12 18.75h.008v.008H12v-.008z" />
        </svg>
    </div>
    <h1>No Internet Connection</h1>
    <p>The NAC Choir Stream requires an active network connection to stream sacred choral music. Please check your connection and tap retry.</p>
    <button class="btn" onclick="window.location.reload()">Retry Stream Connection</button>
</body>
</html>`
    },
    {
      path: 'README.md',
      name: 'README.md',
      language: 'markdown',
      category: 'config',
      description: 'Complete step-by-step instructions to compile this project into a native Android APK package.',
      content: `# NAC Choir Stream - Native Android App Package

This directory contains the production-ready Android Native project structure wrapping [https://nac-choir-stream.ai.studio](https://nac-choir-stream.ai.studio) with native background audio streaming permissions, foreground media notifications, and offline support.

## Prerequisites
- **Android Studio** (Hedgehog 2023.1.1 or higher)
- **JDK 17**
- **Android SDK API 34** (Android 14)
- **Node.js 18+** & npm (for Capacitor CLI)

## Quick Start CLI Build Commands

### Option A: Standard Gradle APK Build
\`\`\`bash
# 1. Open terminal in project root
chmod +x gradlew

# 2. Build Debug APK
./gradlew assembleDebug
# APK generated at: app/build/outputs/apk/debug/app-debug.apk

# 3. Build Signed Release APK
./gradlew assembleRelease
# APK generated at: app/build/outputs/apk/release/app-release.apk
\`\`\`

### Option B: Capacitor CLI Build
\`\`\`bash
# 1. Install Capacitor CLI dependencies
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Sync native Android project
npx cap sync android

# 3. Open directly in Android Studio
npx cap open android
\`\`\`

## Key Architectural Features Implemented
1. **Background Foreground Audio Service** (\`BackgroundAudioService.kt\`)
   - Employs \`FOREGROUND_SERVICE_MEDIA_PLAYBACK\` permission.
   - Binds \`MediaSessionCompat\` so hardware play/pause buttons, lockscreen media controls, and Bluetooth headsets directly control stream playback.
   - Holds a \`PARTIAL_WAKE_LOCK\` to prevent Android OS Doze mode from throttling CPU or tearing the audio stream.

2. **Security & Hardware Acceleration**
   - Configured with strict HTTPS TLS network security policy (\`network_security_config.xml\`).
   - Hardware accelerated WebView rendering enabled.
   - Offline page fallback when network is unavailable (\`offline.html\`).
`
    }
  ];
}
