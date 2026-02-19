import WidgetKit
import SwiftUI

// MARK: - Data Models

struct WidgetCue: Codable, Identifiable {
    let id: String
    let title: String
    let shortDescription: String
}

struct WidgetPayload: Codable {
    let cues: [WidgetCue]
    let updatedAt: String
}

// MARK: - Timeline Entry

struct CueEntry: TimelineEntry {
    let date: Date
    let cues: [WidgetCue]
}

// MARK: - Timeline Provider

struct CueProvider: TimelineProvider {
    private let appGroupID = "group.com.tenniscue.app"
    private let userDefaultsKey = "widgetCues"

    func placeholder(in context: Context) -> CueEntry {
        CueEntry(date: Date(), cues: Self.sampleCues)
    }

    func getSnapshot(in context: Context, completion: @escaping (CueEntry) -> Void) {
        completion(CueEntry(date: Date(), cues: loadCues()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<CueEntry>) -> Void) {
        let currentDate = Date()
        let entry = CueEntry(date: currentDate, cues: loadCues())
        let nextUpdate = Calendar.current.date(byAdding: .hour, value: 2, to: currentDate)!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }

    private func loadCues() -> [WidgetCue] {
        guard let userDefaults = UserDefaults(suiteName: appGroupID),
              let jsonString = userDefaults.string(forKey: userDefaultsKey),
              let data = jsonString.data(using: .utf8),
              let payload = try? JSONDecoder().decode(WidgetPayload.self, from: data)
        else {
            return Self.sampleCues
        }
        return payload.cues
    }

    static let sampleCues: [WidgetCue] = [
        WidgetCue(id: "gen-1", title: "Watch the Ball", shortDescription: "Keep your eyes on the ball through contact"),
        WidgetCue(id: "fh-1", title: "Racket Back Early", shortDescription: "Turn and prepare before the ball bounces"),
        WidgetCue(id: "sv-2", title: "Continental Grip", shortDescription: "Hold the racket like a hammer"),
    ]
}

// MARK: - Color Helpers

extension Color {
    // Light mode colors
    static let tcLightPrimary = Color(hex: "#2D6A4F")
    static let tcLightBackground = Color(hex: "#FFFBF5")
    static let tcLightText = Color(hex: "#212121")
    static let tcLightTextSecondary = Color(hex: "#666666")
    static let tcLightBorder = Color(hex: "#E0DCD5")

    // Dark mode colors
    static let tcDarkPrimary = Color(hex: "#00F5D4")
    static let tcDarkBackground = Color(hex: "#0A1628")
    static let tcDarkText = Color(hex: "#F8F8F8")
    static let tcDarkTextSecondary = Color(hex: "#A0AAB8")
    static let tcDarkBorder = Color(hex: "#2A3F5F")

    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let r = Double((int >> 16) & 0xFF) / 255
        let g = Double((int >> 8) & 0xFF) / 255
        let b = Double(int & 0xFF) / 255
        self.init(.sRGB, red: r, green: g, blue: b, opacity: 1)
    }
}

// MARK: - Widget View

struct CueWidgetEntryView: View {
    var entry: CueProvider.Entry
    @Environment(\.colorScheme) var colorScheme

    private var primaryColor: Color {
        colorScheme == .dark ? .tcDarkPrimary : .tcLightPrimary
    }

    private var backgroundColor: Color {
        colorScheme == .dark ? .tcDarkBackground : .tcLightBackground
    }

    private var textColor: Color {
        colorScheme == .dark ? .tcDarkText : .tcLightText
    }

    private var textSecondaryColor: Color {
        colorScheme == .dark ? .tcDarkTextSecondary : .tcLightTextSecondary
    }

    private var borderColor: Color {
        colorScheme == .dark ? .tcDarkBorder : .tcLightBorder
    }

    var body: some View {
        if entry.cues.isEmpty {
            emptyStateView
        } else {
            cueListView
        }
    }

    private var emptyStateView: some View {
        VStack(spacing: 8) {
            Image(systemName: "tennisball.fill")
                .font(.title2)
                .foregroundColor(primaryColor)
            Text("No Active Cues")
                .font(.headline)
                .foregroundColor(textColor)
            Text("Open TennisCue to add cues")
                .font(.caption)
                .foregroundColor(textSecondaryColor)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .containerBackground(for: .widget) {
            backgroundColor
        }
    }

    private var cueListView: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Header
            HStack {
                Image(systemName: "tennisball.fill")
                    .font(.caption)
                    .foregroundColor(primaryColor)
                Text("Focus Cues")
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundColor(primaryColor)
                Spacer()
                Text("\(entry.cues.count)")
                    .font(.caption2)
                    .foregroundColor(textSecondaryColor)
            }
            .padding(.bottom, 6)

            // Cue rows
            ForEach(Array(entry.cues.prefix(3).enumerated()), id: \.element.id) { index, cue in
                Link(destination: URL(string: "tenniscue://cue/\(cue.id)")!) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(cue.title)
                            .font(.subheadline)
                            .fontWeight(.semibold)
                            .foregroundColor(textColor)
                            .lineLimit(1)
                        Text(cue.shortDescription)
                            .font(.caption2)
                            .foregroundColor(textSecondaryColor)
                            .lineLimit(1)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.vertical, 4)
                }
                if index < min(entry.cues.count, 4) - 1 {
                    Divider()
                        .background(borderColor)
                }
            }
        }
        .padding(16)
        .containerBackground(for: .widget) {
            backgroundColor
        }
    }
}

// MARK: - Widget Declaration

@main
struct TennisCueWidget: Widget {
    let kind: String = "TennisCueWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: CueProvider()) { entry in
            CueWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Tennis Focus Cues")
        .description("Your active practice cues at a glance.")
        .supportedFamilies([.systemMedium])
    }
}

// MARK: - Preview

#Preview(as: .systemMedium) {
    TennisCueWidget()
} timeline: {
    CueEntry(date: .now, cues: CueProvider.sampleCues)
    CueEntry(date: .now, cues: [])
}
