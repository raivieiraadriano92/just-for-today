import WidgetKit
import SwiftUI

private let localizedIntentionTexts: [String: [String: String]] = [
  "en": [
    "hi": "Hi",
    "emptyState": "Each sunrise brings a new choice — what will you choose, Just for Today?",
    "title": "Just for Today, I choose...",
    "cta": "Today I choose...",
    "mockIntention": "Be kind to myself."
  ],
  "pt": [
    "hi": "Oi",
    "emptyState": "Cada nascer do sol traz consigo a chance de uma nova escolha — o que você vai escolher, Só por Hoje?",
    "title": "Só por Hoje, eu escolho...",
    "cta": "Hoje eu escolho...",
    "mockIntention": "Ser gentil comigo mesmo."
  ],
]

func localizedIntentionText(for key: String) -> String {
  let userDefaults = UserDefaults(suiteName: "group.app.justfortoday.widgets")
  let languageCode = userDefaults?.string(forKey: "language") ?? "en"
  
  let fallbackLanguage = "en"
  return localizedIntentionTexts[languageCode]?[key] ?? localizedIntentionTexts[fallbackLanguage]?[key] ?? key
}

struct IntentionWidgetProvider: TimelineProvider {
    func getEntryFromUserDefaults() -> IntentionEntry {
        let userDefaults = UserDefaults(suiteName: "group.app.justfortoday.widgets")
        let storedUserDisplayName = userDefaults?.string(forKey: "userDisplayName")
        let storedDateString = userDefaults?.string(forKey: "intention:date")
        let intentionText = userDefaults?.string(forKey: "intention:intention")

        let today = Date()
        let todayString = ISO8601DateFormatter().string(from: today).prefix(10) // "yyyy-MM-dd"

        let isValid = (storedDateString ?? "") == todayString
      
        return IntentionEntry(
            userDisplayName: storedUserDisplayName ?? nil,
            date: today,
            hasIntention: isValid,
            intention: isValid ? intentionText : nil
        )
    }
  
    func placeholder(in context: Context) -> IntentionEntry {
      IntentionEntry(userDisplayName: "there", date: Date(), hasIntention: false, intention: nil)
    }

    func getSnapshot(in context: Context, completion: @escaping (IntentionEntry) -> ()) {
        let entry = getEntryFromUserDefaults()
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<IntentionEntry>) -> ()) {
        let entry = getEntryFromUserDefaults()
        completion(Timeline(entries: [entry], policy: .never)) // no auto-refresh
    }
}

struct IntentionEntry: TimelineEntry {
    let userDisplayName: String?
    let date: Date
    let hasIntention: Bool
    let intention: String?
}

struct EmptyIntentionView: View {
    let userName: String?
    let widgetFamily: WidgetFamily

    var body: some View {
        ZStack {
            content
                .padding()
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }

    private var content: some View {
        VStack(alignment: alignment, spacing: spacing) {
          VStack(spacing: 8) {
            Text(userName != nil ? "\(localizedIntentionText(for: "hi")), \(userName ?? "") 👋" : "\(localizedIntentionText(for: "hi")) 👋")
              .font(.callout).fontWeight(.medium)
            
            Text(localizedIntentionText(for: "emptyState"))
              .font(.caption)
              .foregroundStyle(.secondary)
          }

            if widgetFamily != .systemSmall {
                Text(localizedIntentionText(for: "cta"))
                    .font(.caption)
                    .fontWeight(.medium)
                    .foregroundStyle(.background)
                    .padding()
                    .frame(height: 48)
                    .background(Color(red: 76/255, green: 148/255, blue: 171/255))
                    .cornerRadius(48)
            }
        }
        .multilineTextAlignment(widgetFamily == .systemSmall ? .leading : .center)
    }

    private var alignment: HorizontalAlignment {
        widgetFamily == .systemSmall ? .leading : .center
    }
  
    private var spacing: CGFloat {
        widgetFamily == .systemSmall ? 8 : 24
    }
  
  private var titleFont: Font {
      widgetFamily == .systemSmall ? .headline : .caption
    }
}

struct IntentionView: View {
  let intention: String
  let widgetFamily: WidgetFamily
  
  var body: some View {
    GeometryReader { geometry in
      ZStack {
        Image(systemName: "quote.opening")
          .font(quoteSize)
          .foregroundStyle(.primary.opacity(0.1))
          .frame(width: geometry.size.width, height: geometry.size.height, alignment: .topLeading)

        Image(systemName: "quote.closing")
          .font(quoteSize)
          .foregroundStyle(.primary.opacity(0.1))
          .frame(width: geometry.size.width, height: geometry.size.height, alignment: .bottomTrailing)

        VStack(alignment: alignment, spacing: 8) {
          Text(localizedIntentionText(for: "title"))
            .font(justForTodaySize)
            .foregroundColor(.secondary)
          Text(intention)
            .font(intentionSize)
            .fontWeight(.semibold)
        }
        .multilineTextAlignment(widgetFamily == .systemSmall ? .leading : .center)
        .padding()
      }
    }
  }
  
  private var alignment: HorizontalAlignment {
      widgetFamily == .systemSmall ? .leading : .center
  }
  
  private var quoteSize: Font {
      widgetFamily == .systemSmall ? .system(size: 28) : .system(size: 48)
  }
  
  private var justForTodaySize: Font {
      widgetFamily == .systemSmall ? .caption : .headline
  }
  
  private var intentionSize: Font {
      widgetFamily == .systemSmall ? .headline : .title
  }
}

struct IntentionWidgetEntryView : View {
    var entry: IntentionEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
      if entry.hasIntention, let intention = entry.intention {
        IntentionView(intention: intention, widgetFamily: family)
      } else {
        EmptyIntentionView(userName: entry.userDisplayName, widgetFamily: family)
      }
    }
}

struct IntentionWidget: Widget {
    let kind: String = "intention-widget"

    var body: some WidgetConfiguration {
      StaticConfiguration(kind: kind, provider: IntentionWidgetProvider()) { entry in
        IntentionWidgetEntryView(entry: entry)
          .containerBackground(.background, for: .widget)
        }
    }
}

#Preview(as: .systemSmall) {
  IntentionWidget()
} timeline: {
  IntentionEntry(userDisplayName: "John", date: .now, hasIntention: true, intention: localizedIntentionText(for: "mockIntention"))
  IntentionEntry(userDisplayName: "John", date: .now, hasIntention: false, intention: nil)
  IntentionEntry(userDisplayName: nil, date: .now, hasIntention: false, intention: nil)
}
