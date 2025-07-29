package app.justfortoday.widgets

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.view.View
import android.widget.RemoteViews
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import app.justfortoday.widgets.R

class GratitudeWidgetProvider : AppWidgetProvider() {
    private val localizedTexts = mapOf(
        "en" to mapOf(
            "hi" to "Hi",
            "emptyState" to "Did you know a few moments of gratitude can lift your mood?",
            "title" to "Reasons to be grateful 🙏",
            "cta" to "Let's try it",
            "mockLog" to "Feeling supported, even in small ways."
        ),
        "pt" to mapOf(
            "hi" to "Oi",
            "emptyState" to "Você sabia que alguns momentos de gratidão podem melhorar seu humor?",
            "title" to "Motivos para agradecer 🙏",
            "cta" to "Vamos tentar?",
            "mockLog" to "Sentindo-me apoiado, mesmo que em pequenas coisas."
        ),
    )

    private fun t(lang: String?, key: String): String {
        val language = lang ?: "en"
        return localizedTexts[language]?.get(key) ?: key
    }

    override fun onUpdate(context: Context, manager: AppWidgetManager, ids: IntArray) {
        val prefs = context.getSharedPreferences("just_for_today", Context.MODE_PRIVATE)
        
        val language = prefs.getString("language", "en")

        val userName = prefs.getString("userDisplayName", null)
        val gratitude = prefs.getString("gratitudeLog:content", null)

        val hasGratitude = !gratitude.isNullOrBlank()

        for (id in ids) {
            val views = RemoteViews(context.packageName, R.layout.gratitude_widget)

            if (hasGratitude) {
                views.setViewVisibility(R.id.gratitude_view, View.VISIBLE)
                views.setViewVisibility(R.id.empty_view, View.GONE)

                views.setTextViewText(R.id.gratitude_label, t(language, "title"))
                views.setTextViewText(R.id.gratitude_text, gratitude)
            } else {
                views.setViewVisibility(R.id.gratitude_view, View.GONE)
                views.setViewVisibility(R.id.empty_view, View.VISIBLE)

                views.setTextViewText(
                    R.id.greeting,
                    if (!userName.isNullOrBlank()) {
                        "${t(language, "hi")}, $userName 👋"
                    } else {
                        "${t(language, "hi")} 👋"
                    }
                )
                views.setTextViewText(
                    R.id.message,
                    t(language, "emptyState")
                )

                views.setViewVisibility(R.id.cta, View.VISIBLE)
                views.setTextViewText(R.id.cta, t(language, "cta"))

                views.setTextViewText(R.id.gratitude_text, t(language, "mockLog"))
            }

            // Optional: tap to open app
            val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)
            val pendingIntent = android.app.PendingIntent.getActivity(
                context,
                0,
                launchIntent,
                android.app.PendingIntent.FLAG_IMMUTABLE or android.app.PendingIntent.FLAG_UPDATE_CURRENT
            )
            views.setOnClickPendingIntent(R.id.container, pendingIntent)

            manager.updateAppWidget(id, views)
        }
    }
}
