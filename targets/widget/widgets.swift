import WidgetKit
import SwiftUI

struct Provider: TimelineProvider {
    func getEntryFromUserDefaults() -> SimpleEntry {
        let userDefaults = UserDefaults(suiteName: "group.app.justfortoday.intention.widget")
        let storedUserDisplayName = userDefaults?.string(forKey: "userDisplayName")
        let storedDateString = userDefaults?.string(forKey: "date")
        let intentionText = userDefaults?.string(forKey: "intention")

        let today = Date()
        let todayString = ISO8601DateFormatter().string(from: today).prefix(10) // "yyyy-MM-dd"

        let isValid = (storedDateString ?? "") == todayString
      
        return SimpleEntry(
            userDisplayName: storedUserDisplayName ?? "there",
            date: today,
            hasIntention: isValid,
            intention: isValid ? intentionText : nil
        )
    }
  
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(userDisplayName: "there", date: Date(), hasIntention: false, intention: nil)
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = getEntryFromUserDefaults()
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> ()) {
        let entry = getEntryFromUserDefaults()
        completion(Timeline(entries: [entry], policy: .never)) // no auto-refresh
    }
}

struct SimpleEntry: TimelineEntry {
    let userDisplayName: String
    let date: Date
    let hasIntention: Bool
    let intention: String?
}

struct EmptyIntentionView: View {
    let userName: String
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
            Text("Hi, \(userName)! 👋")
              .font(.callout).fontWeight(.medium)
            
            Text("Each sunrise brings a new choice — what will you choose, Just for Today?")
              .font(.caption)
              .foregroundStyle(.secondary)
          }

            if widgetFamily != .systemSmall {
                Text("Today I choose...")
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
          Text("Just for Today, I’ll...")
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

struct widgetEntryView : View {
    var entry: SimpleEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
      if entry.hasIntention, let intention = entry.intention {
        IntentionView(intention: intention, widgetFamily: family)
      } else {
        EmptyIntentionView(userName: entry.userDisplayName, widgetFamily: family)
      }
    }
}

struct widget: Widget {
    let kind: String = "widget"

    var body: some WidgetConfiguration {
      StaticConfiguration(kind: kind, provider: Provider()) { entry in
            widgetEntryView(entry: entry)
          .containerBackground(.background, for: .widget)
        }
    }
}

#Preview(as: .systemSmall) {
    widget()
} timeline: {
    SimpleEntry(userDisplayName: "John", date: .now, hasIntention: true, intention: "Be kind to myself.")
    SimpleEntry(userDisplayName: "John", date: .now, hasIntention: false, intention: nil)
}
