import WidgetKit
import SwiftUI

struct GratitudeWidgetProvider: TimelineProvider {
    func getEntryFromUserDefaults() -> GratitudeEntry {
        let userDefaults = UserDefaults(suiteName: "group.app.justfortoday.widgets")
        let storedUserDisplayName = userDefaults?.string(forKey: "userDisplayName")
        let gratitudeText = userDefaults?.string(forKey: "gratitudeLog:content")

        let today = Date()

        let isValid = gratitudeText != nil ? true : false
      
        return GratitudeEntry(
            userDisplayName: storedUserDisplayName ?? "there",
            date: today,
            hasGratitude: isValid,
            gratitude: isValid ? gratitudeText : nil
        )
    }
  
    func placeholder(in context: Context) -> GratitudeEntry {
      GratitudeEntry(userDisplayName: "there", date: Date(), hasGratitude: false, gratitude: nil)
    }

    func getSnapshot(in context: Context, completion: @escaping (GratitudeEntry) -> ()) {
        let entry = getEntryFromUserDefaults()
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<GratitudeEntry>) -> ()) {
        let entry = getEntryFromUserDefaults()
        completion(Timeline(entries: [entry], policy: .never)) // no auto-refresh
    }
}

struct GratitudeEntry: TimelineEntry {
    let userDisplayName: String
    let date: Date
    let hasGratitude: Bool
    let gratitude: String?
}

struct EmptyGratitudeView: View {
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
            
            Text("Did you know a few moments of gratitude can lift your mood?")
              .font(.caption)
              .foregroundStyle(.secondary)
          }

            if widgetFamily != .systemSmall {
                Text("Let's try it")
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

struct GratitudeView: View {
  let gratitude: String
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
          Text("Reasons to be grateful 🙏")
            .font(justForTodaySize)
            .foregroundColor(.secondary)
          Text(gratitude)
            .font(GratitudeSize)
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
  
  private var GratitudeSize: Font {
      widgetFamily == .systemSmall ? .headline : .title
  }
}

struct GratitudeWidgetEntryView : View {
    var entry: GratitudeEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
      if entry.hasGratitude, let gratitude = entry.gratitude {
        GratitudeView(gratitude: gratitude, widgetFamily: family)
      } else {
        EmptyGratitudeView(userName: entry.userDisplayName, widgetFamily: family)
      }
    }
}

struct GratitudeWidget: Widget {
    let kind: String = "gratitude-widget"

    var body: some WidgetConfiguration {
      StaticConfiguration(kind: kind, provider: GratitudeWidgetProvider()) { entry in
        GratitudeWidgetEntryView(entry: entry)
          .containerBackground(.background, for: .widget)
        }
    }
}

#Preview(as: .systemSmall) {
  GratitudeWidget()
} timeline: {
  GratitudeEntry(userDisplayName: "John", date: .now, hasGratitude: true, gratitude: "Feeling supported, even in small ways.")
  GratitudeEntry(userDisplayName: "John", date: .now, hasGratitude: false, gratitude: nil)
}
