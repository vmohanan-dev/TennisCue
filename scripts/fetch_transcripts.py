"""
Step 2: Fetch transcripts for all videos.

Usage:
    python fetch_transcripts.py

Reads: output/channel_videos.json
Output: output/video_transcripts.json
"""

import json
import os
import sys
import time

from youtube_transcript_api import YouTubeTranscriptApi


def fetch_transcript(api, video_id):
    """Fetch English transcript for a video."""
    try:
        result = api.fetch(video_id)
        # Convert to list of dicts for JSON serialization
        return [
            {"text": entry.text, "start": entry.start, "duration": entry.duration}
            for entry in result
        ]
    except Exception:
        return None


def main():
    input_path = "output/channel_videos.json"
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found. Run fetch_videos.py first.")
        sys.exit(1)

    with open(input_path) as f:
        videos = json.load(f)

    api = YouTubeTranscriptApi()

    print(f"Fetching transcripts for {len(videos)} videos...")
    results = {}
    success_count = 0
    fail_count = 0

    for i, video in enumerate(videos):
        video_id = video["videoId"]
        title = video["title"]
        print(f"  [{i + 1}/{len(videos)}] {title[:60]}...", end=" ")

        transcript = fetch_transcript(api, video_id)
        if transcript:
            results[video_id] = {
                "title": title,
                "transcript": transcript,
            }
            total_duration = sum(entry["duration"] for entry in transcript)
            print(f"OK ({len(transcript)} segments, {total_duration:.0f}s)")
            success_count += 1
        else:
            print("SKIPPED (no transcript)")
            fail_count += 1

        # Small delay to be respectful
        time.sleep(0.5)

    output_path = "output/video_transcripts.json"
    with open(output_path, "w") as f:
        json.dump(results, f, indent=2)

    print(f"\nDone: {success_count} transcripts fetched, {fail_count} skipped")
    print(f"Saved to {output_path}")


if __name__ == "__main__":
    main()
