package com.trackkar.app

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Bundle
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class TrackKarLocationModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  override fun getName() = "TrackKarLocation"

  @ReactMethod
  fun getCurrentPosition(promise: Promise) {
    val fine = ContextCompat.checkSelfPermission(reactApplicationContext, Manifest.permission.ACCESS_FINE_LOCATION)
    val coarse = ContextCompat.checkSelfPermission(reactApplicationContext, Manifest.permission.ACCESS_COARSE_LOCATION)
    if (fine != PackageManager.PERMISSION_GRANTED && coarse != PackageManager.PERMISSION_GRANTED) {
      promise.reject("LOCATION_PERMISSION", "Location permission is required.")
      return
    }
    val manager = reactApplicationContext.getSystemService(Context.LOCATION_SERVICE) as LocationManager
    val provider = when {
      manager.isProviderEnabled(LocationManager.GPS_PROVIDER) -> LocationManager.GPS_PROVIDER
      manager.isProviderEnabled(LocationManager.NETWORK_PROVIDER) -> LocationManager.NETWORK_PROVIDER
      else -> { promise.reject("LOCATION_DISABLED", "Turn on device location and try again."); return }
    }
    val listener = object : LocationListener {
      override fun onLocationChanged(location: Location) {
        manager.removeUpdates(this)
        val result = Arguments.createMap().apply {
          putDouble("latitude", location.latitude); putDouble("longitude", location.longitude)
          putDouble("accuracyMeters", location.accuracy.toDouble()); putDouble("capturedAtMs", location.time.toDouble())
          if (location.hasSpeed()) putDouble("speedMetersPerSecond", location.speed.toDouble()) else putNull("speedMetersPerSecond")
        }
        promise.resolve(result)
      }
      override fun onProviderEnabled(provider: String) = Unit
      override fun onProviderDisabled(provider: String) = Unit
      @Deprecated("Deprecated in Android") override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) = Unit
    }
    try { manager.requestSingleUpdate(provider, listener, null) }
    catch (error: SecurityException) { promise.reject("LOCATION_PERMISSION", error) }
  }
}
