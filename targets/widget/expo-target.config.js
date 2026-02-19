/** @type {import('@bacons/apple-targets').Config} */
module.exports = {
  type: "widget",
  name: "TennisCueWidget",
  bundleIdentifier: ".widget",
  deploymentTarget: "17.0",
  entitlements: {
    "com.apple.security.application-groups": ["group.com.tenniscue.app"],
  },
  frameworks: ["WidgetKit", "SwiftUI"],
};
