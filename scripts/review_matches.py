"""
Step 4: Interactively review proposed matches.

Usage:
    python review_matches.py

Reads: output/proposed_matches.json
Output: output/approved_matches.json
"""

import json
import os
import sys
import webbrowser


def get_youtube_url(video_id, start_time):
    return f"https://youtu.be/{video_id}?t={start_time}"


def main():
    input_path = "output/proposed_matches.json"
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found. Run match_cues.py first.")
        sys.exit(1)

    with open(input_path) as f:
        matches = json.load(f)

    # Load any existing approved matches to allow resuming
    approved_path = "output/approved_matches.json"
    if os.path.exists(approved_path):
        with open(approved_path) as f:
            approved = json.load(f)
        reviewed_ids = {m["cueId"] for m in approved}
        print(f"Loaded {len(approved)} previously approved matches.")
    else:
        approved = []
        reviewed_ids = set()

    # Filter to unreviewed matches
    pending = [m for m in matches if m["cueId"] not in reviewed_ids]
    rejected_count = 0

    print(f"\n{len(pending)} matches to review ({len(matches)} total)\n")
    print("Commands: [a]pprove  [r]eject  [o]pen in browser  [s]kip  [q]uit\n")
    print("-" * 60)

    for i, match in enumerate(pending):
        print(f"\n[{i + 1}/{len(pending)}] Confidence: {match['confidence']}")
        print(f"  Cue:     {match['cueId']} - {match['cueTitle']}")
        print(f"  Video:   {match['videoTitle']}")
        print(f"  Segment: {match['segmentDescription']}")
        print(f"  Time:    {match['startTime']}s - {match['endTime']}s")
        url = get_youtube_url(match["videoId"], match["startTime"])
        print(f"  URL:     {url}")

        while True:
            choice = input("\n  > ").strip().lower()

            if choice == "a":
                approved.append(match)
                print("  -> Approved")
                break
            elif choice == "r":
                rejected_count += 1
                print("  -> Rejected")
                break
            elif choice == "o":
                webbrowser.open(url)
                print("  -> Opened in browser. Choose [a]pprove or [r]eject:")
            elif choice == "s":
                print("  -> Skipped (will remain in pending)")
                break
            elif choice == "q":
                # Save progress and exit
                with open(approved_path, "w") as f:
                    json.dump(approved, f, indent=2)
                print(f"\nProgress saved. {len(approved)} approved, {rejected_count} rejected.")
                print("Run again to continue reviewing skipped matches.")
                sys.exit(0)
            else:
                print("  Unknown command. Use [a]pprove, [r]eject, [o]pen, [s]kip, or [q]uit")

    # Save final results
    with open(approved_path, "w") as f:
        json.dump(approved, f, indent=2)

    print(f"\n{'=' * 60}")
    print(f"Review complete!")
    print(f"  Approved: {len(approved)}")
    print(f"  Rejected: {rejected_count}")
    print(f"  Saved to {approved_path}")
    print(f"\nRun export_to_app.py to generate the app data file.")


if __name__ == "__main__":
    main()
