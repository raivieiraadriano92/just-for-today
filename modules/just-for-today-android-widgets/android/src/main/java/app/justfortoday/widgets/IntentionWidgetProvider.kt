package app.justfortoday.widgets

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.view.View
import android.widget.RemoteViews
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import app.justfortoday.widgets.R
import android.app.PendingIntent
import android.content.Intent
import android.net.Uri

class IntentionWidgetProvider : AppWidgetProvider() {
    private val localizedTexts = mapOf(
        "en" to mapOf(
            "hi" to "Hi",
            "emptyState" to "Each sunrise brings a new choice — what will you choose, Just for Today?",
            "title" to "Just for Today, I choose...",
            "cta" to "Today I choose...",
            "mockIntention" to "Be kind to myself."
        ),
        "pt" to mapOf(
            "hi" to "Oi",
            "emptyState" to "Cada nascer do sol traz consigo a chance de uma nova escolha — o que você vai escolher, Só por Hoje?",
            "title" to "Só por Hoje, eu escolho...",
            "cta" to "Hoje eu escolho...",
            "mockIntention" to "Ser gentil comigo mesmo."
        ),
    )

    private fun t(lang: String?, key: String): String {
        val language = lang ?: "en"
        return localizedTexts[language]?.get(key) ?: key
    }

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        val prefs = context.getSharedPreferences("just_for_today", Context.MODE_PRIVATE)
        
        val language = prefs.getString("language", "en")

        val userName = prefs.getString("userDisplayName", null)
        val intention = prefs.getString("intention", null)
        val date = prefs.getString("intention_date", null)

        val today = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
        val hasIntention = date == today && !intention.isNullOrBlank()

        for (id in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.intention_widget)

            if (hasIntention) {
                views.setViewVisibility(R.id.intention_view, View.VISIBLE)
                views.setViewVisibility(R.id.empty_view, View.GONE)

                views.setTextViewText(R.id.intention_label, t(language, "title"))
                views.setTextViewText(R.id.intention_text, intention)
            } else {
                views.setViewVisibility(R.id.intention_view, View.GONE)
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

                // Optional: only show CTA for larger widget (not done here — static for now)
                views.setViewVisibility(R.id.cta, View.VISIBLE)
                views.setTextViewText(R.id.cta, t(language, "cta"))

                views.setTextViewText(R.id.intention_text, t(language, "mockIntention"))
            }

            // Intent to open the app
            val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)
            val pendingIntent = PendingIntent.getActivity(
                context,
                0,
                launchIntent,
                PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
            )

            // Make the entire widget tappable
            views.setOnClickPendingIntent(R.id.container, pendingIntent)

            appWidgetManager.updateAppWidget(id, views)
        }
    }
}
