package app.justfortoday.widgets

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class JustForTodayAndroidWidgetsModule : Module() {
  // This defines the module's interface for JavaScript
  override fun definition() = ModuleDefinition {

    // This is the name used to import the module from JavaScript:
    // `import { JustForTodayAndroidWidgets } from 'just-for-today-android-widgets'`
    Name("JustForTodayAndroidWidgets")

    // Defines a function accessible from JavaScript: JustForTodayAndroidWidgets.updateIntentionWidget()
    Function("updateIntentionWidget") {
      // Triggers an update for the Intention widget
      sendWidgetUpdate(IntentionWidgetProvider::class.java)
    }

    // Defines another JS-accessible function: JustForTodayAndroidWidgets.updateGratitudeWidget()
    Function("updateGratitudeWidget") {
      // Triggers an update for the Gratitude widget
      sendWidgetUpdate(GratitudeWidgetProvider::class.java)
    }

    // Sets the intention and the date (e.g. "2024-07-23")
    Function("setIntention") { value: String, date: String ->
      saveToPreferences("intention", value)
      saveToPreferences("intention_date", date)
    }

    // Sets the gratitude message
    Function("setGratitude") { value: String ->
      saveToPreferences("gratitudeLog:content", value)
    }

    Function("setUserDisplayName") { name: String ->
      saveToPreferences("userDisplayName", name)
    }

    Function("setLanguage") { language: String ->
      saveToPreferences("language", language)
    }
  }

  // Saves a string value to SharedPreferences under a given key
  private fun saveToPreferences(key: String, value: String) {
    // Get the React Native context from the app (null-safe)
    val context = appContext.reactContext ?: return

    // Access the shared preferences named "just_for_today"
    val prefs = context.getSharedPreferences("just_for_today", Context.MODE_PRIVATE)

    // Store the key-value pair persistently using apply() for async commit
    prefs.edit().putString(key, value).apply()
  }

  // Helper function to send a broadcast that asks the given widget provider to update
  private fun sendWidgetUpdate(provider: Class<*>) {
    // Get the app's context
    val context = appContext.reactContext ?: return

    // Access the Android system's AppWidgetManager
    val appWidgetManager = AppWidgetManager.getInstance(context)

    // Get all widget IDs associated with the given provider class (Intention or Gratitude)
    val ids = appWidgetManager.getAppWidgetIds(ComponentName(context, provider))

    // Prepare an intent to trigger a widget update
    val intent = Intent(context, provider).apply {
      action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
      putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
    }

    // Send the broadcast to request the widget(s) to update
    context.sendBroadcast(intent)
  }
}
