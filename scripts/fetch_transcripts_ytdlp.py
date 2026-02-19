"""
Step 2b: Fetch transcripts using yt-dlp (fallback for rate-limited youtube-transcript-api).

Downloads auto-generated English subtitles as JSON3 format and converts to
the same structure as fetch_transcripts.py output.

Usage:
    python fetch_transcripts_ytdlp.py

Requires: yt-dlp installed (brew install yt-dlp)
Reads: output/channel_videos.json, output/video_transcripts.json (existing)
Output: output/video_transcripts.json (merged)
"""

import json
import os
import subprocess
import sys
import tempfile
import time


def fetch_transcript_ytdlp(video_id, temp_dir):
    """Fetch auto-generated English subtitles using yt-dlp."""
    output_template = os.path.join(temp_dir, f"{video_id}")

    try:
        result = subprocess.run(
            [
                "yt-dlp",
                "--skip-download",
                "--write-auto-sub",
                "--sub-lang", "en",
                "--sub-format", "json3",
                "--output", output_template,
                f"https://youtu.be/{video_id}",
            ],
            capture_output=True,
            text=True,
            timeout=30,
        )
    except subprocess.TimeoutExpired:
        return None

    # Look for the subtitle file
    sub_file = os.path.join(temp_dir, f"{video_id}.en.json3")
    if not os.path.exists(sub_file):
        return None

    with open(sub_file) as f:
        data = json.load(f)

    # Convert JSON3 format to our standard format
    events = data.get("events", [])
    transcript = []
    for event in events:
        if "segs" not in event:
            continue
        text = "".join(seg.get("utf8", "") for seg in event["segs"]).strip()
        if not text or text == "\n":
            continue
        start_ms = event.get("tStartMs", 0)
        duration_ms = event.get("dDurationMs", 0)
        transcript.append({
            "text": text,
            "start": start_ms / 1000.0,
            "duration": duration_ms / 1000.0,
        })

    # Clean up
    os.remove(sub_file)

    return transcript if transcript else None


def main():
    input_path = "output/channel_videos.json"
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found. Run fetch_videos.py first.")
        sys.exit(1)

    with open(input_path) as f:
        all_videos = json.load(f)

    # Load existing transcripts
    existing_path = "output/video_transcripts.json"
    if os.path.exists(existing_path):
        with open(existing_path) as f:
            existing = json.load(f)
        print(f"Loaded {len(existing)} existing transcripts")
    else:
        existing = {}

    # Filter to instructional videos not yet fetched
    instructional_keywords = [
        "lesson", "how to", "tips", "drill", "footwork", "forehand",
        "backhand", "serve", "volley", "approach", "return", "tactic",
        "strategy", "mistake", "improve", "better", "power", "spin",
        "technique", "groundstroke", "overhead", "slice", "drop shot",
        "ready position", "split step", "contact", "warm up", "practice",
        "pattern", "consistency", "coiling", "weight transfer",
    ]

    needed = []
    for v in all_videos:
        if v["videoId"] in existing:
            continue
        title_lower = v["title"].lower()
        if any(kw in title_lower for kw in instructional_keywords):
            needed.append(v)

    print(f"\n{len(needed)} instructional videos need transcripts\n")

    with tempfile.TemporaryDirectory() as temp_dir:
        success_count = 0
        fail_count = 0

        for i, video in enumerate(needed):
            video_id = video["videoId"]
            title = video["title"]
            print(f"  [{i + 1}/{len(needed)}] {title[:60]}...", end=" ", flush=True)

            transcript = fetch_transcript_ytdlp(video_id, temp_dir)
            if transcript:
                existing[video_id] = {
                    "title": title,
                    "transcript": transcript,
                }
                total_duration = sum(e["duration"] for e in transcript)
                print(f"OK ({len(transcript)} segments, {total_duration:.0f}s)")
                success_count += 1
            else:
                print("SKIPPED")
                fail_count += 1

            # Save progress every 20 videos
            if (i + 1) % 20 == 0:
                with open(existing_path, "w") as f:
                    json.dump(existing, f, indent=2)
                print(f"  [Saved progress: {len(existing)} total transcripts]")

            time.sleep(0.3)

    # Final save
    with open(existing_path, "w") as f:
        json.dump(existing, f, indent=2)

    print(f"\nDone: {success_count} new transcripts, {fail_count} skipped")
    print(f"Total transcripts: {len(existing)}")
    print(f"Saved to {existing_path}")


if __name__ == "__main__":
    main()
