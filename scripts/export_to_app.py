"""
Step 5: Export approved matches to app data format.

Usage:
    python export_to_app.py

Reads: output/approved_matches.json
Output: ../data/cue-videos.ts
"""

import json
import os
import sys


def escape_ts_string(s):
    """Escape a string for use in a TypeScript single-quoted string."""
    return s.replace("\\", "\\\\").replace("'", "\\'")


def main():
    input_path = "output/approved_matches.json"
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found. Run review_matches.py first.")
        sys.exit(1)

    with open(input_path) as f:
        matches = json.load(f)

    if not matches:
        print("No approved matches to export.")
        sys.exit(0)

    # Sort by cueId for consistent ordering
    matches.sort(key=lambda m: m["cueId"])

    # Generate TypeScript
    lines = [
        "import { CueVideo } from '@/types';",
        "",
        "export const cueVideos: CueVideo[] = [",
    ]

    for match in matches:
        lines.append("  {")
        lines.append(f"    cueId: '{escape_ts_string(match['cueId'])}',")
        lines.append(f"    videoId: '{escape_ts_string(match['videoId'])}',")
        lines.append(f"    videoTitle: '{escape_ts_string(match['videoTitle'])}',")
        lines.append(f"    startTime: {match['startTime']},")
        lines.append(f"    endTime: {match['endTime']},")
        lines.append(f"    segmentDescription:")
        lines.append(f"      '{escape_ts_string(match['segmentDescription'])}',")
        lines.append("  },")

    lines.extend([
        "];",
        "",
        "const cueVideoMap = new Map<string, CueVideo>(",
        "  cueVideos.map((cv) => [cv.cueId, cv])",
        ");",
        "",
        "export function getVideoForCue(cueId: string): CueVideo | null {",
        "  return cueVideoMap.get(cueId) ?? null;",
        "}",
        "",
        "export function getVideoThumbnailUrl(videoId: string): string {",
        "  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;",
        "}",
        "",
        "export function getTimestampedVideoUrl(",
        "  videoId: string,",
        "  startTime: number",
        "): string {",
        "  return `https://youtu.be/${videoId}?t=${startTime}`;",
        "}",
        "",
    ])

    output_path = os.path.join(os.path.dirname(__file__), "..", "data", "cue-videos.ts")
    output_path = os.path.normpath(output_path)

    with open(output_path, "w") as f:
        f.write("\n".join(lines))

    print(f"Exported {len(matches)} video matches to {output_path}")


if __name__ == "__main__":
    main()
