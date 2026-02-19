import { Platform } from 'react-native';
import { cues } from '@/data/cues';

let setWidgetData: ((json: string) => void) | null = null;
if (Platform.OS === 'ios') {
  try {
    const bridge = require('../modules/widget-data-bridge');
    setWidgetData = bridge.setWidgetData;
  } catch {
    // Module not available
  }
}

interface WidgetCueData {
  id: string;
  title: string;
  shortDescription: string;
}

interface WidgetPayload {
  cues: WidgetCueData[];
  updatedAt: string;
}

export function syncWidgetData(activeCueIds: string[]): void {
  if (!setWidgetData) return;

  const reversedIds = [...activeCueIds].reverse();
  const widgetCues: WidgetCueData[] = reversedIds
    .slice(0, 3)
    .map((id) => {
      const cue = cues.find((c) => c.id === id);
      if (!cue) return null;
      return {
        id: cue.id,
        title: cue.title,
        shortDescription: cue.shortDescription,
      };
    })
    .filter((c): c is WidgetCueData => c !== null);

  const payload: WidgetPayload = {
    cues: widgetCues,
    updatedAt: new Date().toISOString(),
  };

  setWidgetData(JSON.stringify(payload));
}
