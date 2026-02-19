import ExpoModulesCore
import WidgetKit

public class WidgetDataBridgeModule: Module {
    public func definition() -> ModuleDefinition {
        Name("WidgetDataBridge")

        Function("setWidgetData") { (jsonString: String) in
            let userDefaults = UserDefaults(suiteName: "group.com.tenniscue.app")
            userDefaults?.set(jsonString, forKey: "widgetCues")
            userDefaults?.synchronize()

            if #available(iOS 14.0, *) {
                WidgetCenter.shared.reloadAllTimelines()
            }
        }
    }
}
