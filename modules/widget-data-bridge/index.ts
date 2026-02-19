import { requireNativeModule } from 'expo-modules-core';

const WidgetDataBridge = requireNativeModule('WidgetDataBridge');

export function setWidgetData(jsonString: string): void {
  WidgetDataBridge.setWidgetData(jsonString);
}
