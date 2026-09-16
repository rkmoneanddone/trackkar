package com.trackkar.app

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          add(TrackKarLocationPackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    createArrivalNotificationChannel()
    loadReactNative(this)
  }

  private fun createArrivalNotificationChannel() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
    val channel = NotificationChannel(
      "trackkar_arrivals",
      "TrackKar arrivals",
      NotificationManager.IMPORTANCE_HIGH,
    ).apply {
      description = "Alerts when a tracked service is approaching"
      enableVibration(true)
    }
    getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
  }
}
