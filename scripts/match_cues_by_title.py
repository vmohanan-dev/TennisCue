"""
Step 3b: Match cues to videos using video TITLES and DESCRIPTIONS (no transcripts needed).

This approach works well because Karue Sell's instructional video titles are very
descriptive (e.g., "Tennis KICK SERVE Lesson", "How To Hit A Tennis Volley").

Usage:
    python match_cues_by_title.py

Requires ANTHROPIC_API_KEY in .env file.
Reads: output/channel_videos.json
Output: output/proposed_matches.json
"""

import json
import os
import sys
import time

import anthropic
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
MODEL = "claude-sonnet-4-20250514"

# All 116 cues from the TennisCue app
CUES = [
    {"id": "gen-1", "title": "Watch the Ball", "short": "Keep your eyes on the ball through contact", "stroke": "general", "skill": "contact"},
    {"id": "gen-2", "title": "Split Step", "short": "Small hop before opponent hits", "stroke": "general", "skill": "footwork"},
    {"id": "gen-3", "title": "Ready Position", "short": "Knees bent, racket in front", "stroke": "general", "skill": "preparation"},
    {"id": "gen-4", "title": "Move Your Feet", "short": "Get to the ball early", "stroke": "general", "skill": "footwork"},
    {"id": "gen-5", "title": "Disguise Your Shots", "short": "Same preparation, different directions", "stroke": "general", "skill": "mental"},
    {"id": "gen-6", "title": "Controlled Aggression", "short": "Attack smart, not just hard", "stroke": "general", "skill": "mental"},
    {"id": "gen-7", "title": "Recover to Center", "short": "Return to middle after every shot", "stroke": "general", "skill": "recovery"},
    {"id": "gen-8", "title": "Breathe on Contact", "short": "Exhale as you hit the ball", "stroke": "general", "skill": "timing"},
    {"id": "gen-9", "title": "Play the Ball Early", "short": "Take time away from opponent", "stroke": "general", "skill": "tactics"},
    {"id": "gen-10", "title": "Use Court Geometry", "short": "Crosscourt is longer and safer", "stroke": "general", "skill": "tactics"},
    {"id": "gen-11", "title": "Build the Point", "short": "Work opponent out of position first", "stroke": "general", "skill": "tactics"},
    {"id": "gen-12", "title": "Pressure Big Points", "short": "Play aggressive on crucial moments", "stroke": "general", "skill": "mental"},
    {"id": "fh-1", "title": "Racket Back Early", "short": "Turn and prepare before the ball bounces", "stroke": "forehand", "skill": "preparation"},
    {"id": "fh-2", "title": "Low to High", "short": "Swing from low to high for topspin", "stroke": "forehand", "skill": "contact"},
    {"id": "fh-3", "title": "Follow Through", "short": "Complete your swing over your shoulder", "stroke": "forehand", "skill": "follow-through"},
    {"id": "fh-4", "title": "Catch the Racket", "short": "Catch with non-dominant hand on follow-through", "stroke": "forehand", "skill": "follow-through"},
    {"id": "fh-5", "title": "Load the Outside Leg", "short": "Push off your back foot into the shot", "stroke": "forehand", "skill": "footwork"},
    {"id": "fh-6", "title": "Windshield Wiper Finish", "short": "Racket face rolls over for heavy spin", "stroke": "forehand", "skill": "follow-through"},
    {"id": "fh-7", "title": "Inside-Out Forehand", "short": "Run around backhand for aggressive forehand", "stroke": "forehand", "skill": "footwork"},
    {"id": "fh-8", "title": "Unit Turn", "short": "Shoulders and hips rotate together", "stroke": "forehand", "skill": "preparation"},
    {"id": "fh-9", "title": "Contact Out Front", "short": "Hit the ball ahead of your body", "stroke": "forehand", "skill": "contact"},
    {"id": "fh-10", "title": "Brush Up the Ball", "short": "Racket face climbs up the back of ball", "stroke": "forehand", "skill": "contact"},
    {"id": "fh-11", "title": "Open Stance Power", "short": "Rotate hips for wide balls", "stroke": "forehand", "skill": "footwork"},
    {"id": "fh-12", "title": "Heavy Ball", "short": "More spin equals more margin", "stroke": "forehand", "skill": "contact"},
    {"id": "fh-13", "title": "Inside-In Forehand", "short": "Run around backhand, hit down line", "stroke": "forehand", "skill": "tactics"},
    {"id": "fh-14", "title": "Lag the Racket", "short": "Racket head trails the hand", "stroke": "forehand", "skill": "timing"},
    {"id": "bh-1", "title": "Two Hands for Control", "short": "Use both hands for stability", "stroke": "backhand", "skill": "contact"},
    {"id": "bh-2", "title": "Shoulder Turn", "short": "Rotate shoulders to prepare", "stroke": "backhand", "skill": "preparation"},
    {"id": "bh-3", "title": "Stay Sideways Longer", "short": "Don't open up too early", "stroke": "backhand", "skill": "preparation"},
    {"id": "bh-4", "title": "Drive Through Contact", "short": "Extend through the ball", "stroke": "backhand", "skill": "contact"},
    {"id": "bh-5", "title": "Non-Dominant Hand Leads", "short": "Top hand controls the swing", "stroke": "backhand", "skill": "contact"},
    {"id": "bh-6", "title": "Eyes to Contact", "short": "Watch ball meet strings", "stroke": "backhand", "skill": "contact"},
    {"id": "bh-7", "title": "Step Across", "short": "Front foot crosses toward sideline", "stroke": "backhand", "skill": "footwork"},
    {"id": "bh-8", "title": "Compact Backswing", "short": "Less backswing, more forward swing", "stroke": "backhand", "skill": "preparation"},
    {"id": "bh-9", "title": "Two-Hand Release", "short": "Let go with top hand for extension", "stroke": "backhand", "skill": "follow-through"},
    {"id": "bh-10", "title": "One-Hand Backhand Grip", "short": "Eastern backhand for control", "stroke": "backhand", "skill": "preparation"},
    {"id": "bh-11", "title": "One-Hand Extension", "short": "Arm fully extended at contact", "stroke": "backhand", "skill": "contact"},
    {"id": "bh-12", "title": "Attack Short Balls", "short": "Step in and drive through", "stroke": "backhand", "skill": "tactics"},
    {"id": "bh-13", "title": "Disguise Direction", "short": "Same prep, different targets", "stroke": "backhand", "skill": "tactics"},
    {"id": "bh-14", "title": "Running Backhand", "short": "Hit through the ball while moving", "stroke": "backhand", "skill": "footwork"},
    {"id": "sv-1", "title": "Toss Consistency", "short": "Toss to the same spot every time", "stroke": "serve", "skill": "preparation"},
    {"id": "sv-2", "title": "Continental Grip", "short": "Hold the racket like a hammer", "stroke": "serve", "skill": "preparation"},
    {"id": "sv-3", "title": "Trophy Position", "short": "Pause at the top with racket behind", "stroke": "serve", "skill": "timing"},
    {"id": "sv-4", "title": "Load the Legs", "short": "Bend knees and push up into serve", "stroke": "serve", "skill": "preparation"},
    {"id": "sv-5", "title": "Pronation", "short": "Rotate forearm through contact", "stroke": "serve", "skill": "contact"},
    {"id": "sv-6", "title": "Kick Serve Height", "short": "Brush up the back of the ball", "stroke": "serve", "skill": "contact"},
    {"id": "sv-7", "title": "Toss Arm Straight", "short": "Lift the ball, don't throw it", "stroke": "serve", "skill": "preparation"},
    {"id": "sv-8", "title": "Feet Position", "short": "Front foot at 45 degrees to baseline", "stroke": "serve", "skill": "preparation"},
    {"id": "sv-9", "title": "Scratch Your Back", "short": "Racket drops behind before swing up", "stroke": "serve", "skill": "preparation"},
    {"id": "sv-10", "title": "Reach High", "short": "Contact at full extension", "stroke": "serve", "skill": "contact"},
    {"id": "sv-11", "title": "Slice Serve Toss", "short": "Toss slightly right for righties", "stroke": "serve", "skill": "contact"},
    {"id": "sv-12", "title": "Second Serve Spin", "short": "More spin, less pace for safety", "stroke": "serve", "skill": "tactics"},
    {"id": "sv-13", "title": "Serve Wide Ad Court", "short": "Pull receiver off court", "stroke": "serve", "skill": "tactics"},
    {"id": "sv-14", "title": "Body Serve", "short": "Jam the receiver for weak returns", "stroke": "serve", "skill": "tactics"},
    {"id": "sv-15", "title": "Serve Plus One", "short": "Plan your second shot before serving", "stroke": "serve", "skill": "tactics"},
    {"id": "sv-16", "title": "Disguise Serve Type", "short": "Same toss, different spins", "stroke": "serve", "skill": "tactics"},
    {"id": "rt-1", "title": "Shorten Your Backswing", "short": "Compact swing for faster serves", "stroke": "return", "skill": "preparation"},
    {"id": "rt-2", "title": "Watch the Toss", "short": "Read serve direction from ball toss", "stroke": "return", "skill": "preparation"},
    {"id": "rt-3", "title": "Split Step Timing", "short": "Land as server contacts ball", "stroke": "return", "skill": "footwork"},
    {"id": "rt-4", "title": "Block Return", "short": "Use server's pace, minimal swing", "stroke": "return", "skill": "contact"},
    {"id": "rt-5", "title": "Chip and Charge", "short": "Slice return and rush the net", "stroke": "return", "skill": "tactics"},
    {"id": "rt-6", "title": "Attack Second Serves", "short": "Step inside baseline and drive", "stroke": "return", "skill": "tactics"},
    {"id": "rt-7", "title": "Deep Middle Return", "short": "Safest target under pressure", "stroke": "return", "skill": "tactics"},
    {"id": "rt-8", "title": "Crosscourt Return", "short": "More margin over lower net", "stroke": "return", "skill": "tactics"},
    {"id": "rt-9", "title": "Return Winners", "short": "Punish weak second serves", "stroke": "return", "skill": "tactics"},
    {"id": "rt-10", "title": "Change Return Position", "short": "Keep server guessing with position", "stroke": "return", "skill": "tactics"},
    {"id": "vl-1", "title": "Punch, Don't Swing", "short": "Short, firm motion at the net", "stroke": "volley", "skill": "contact"},
    {"id": "vl-2", "title": "Step Into the Volley", "short": "Move forward with each volley", "stroke": "volley", "skill": "footwork"},
    {"id": "vl-3", "title": "Continental Grip", "short": "One grip for all volleys", "stroke": "volley", "skill": "preparation"},
    {"id": "vl-4", "title": "Bend Your Knees", "short": "Get low for low volleys", "stroke": "volley", "skill": "footwork"},
    {"id": "vl-5", "title": "Racket Out Front", "short": "Keep racket visible in peripheral vision", "stroke": "volley", "skill": "preparation"},
    {"id": "vl-6", "title": "Angle the Face", "short": "Open racket for sharp angles", "stroke": "volley", "skill": "contact"},
    {"id": "vl-7", "title": "First Volley Deep", "short": "Approach volley targets depth", "stroke": "volley", "skill": "tactics"},
    {"id": "vl-8", "title": "Split at Net", "short": "Small hop between each volley", "stroke": "volley", "skill": "footwork"},
    {"id": "vl-9", "title": "Drop Volley", "short": "Soft hands for touch winners", "stroke": "volley", "skill": "contact"},
    {"id": "vl-10", "title": "Swing Volley", "short": "Full swing on high balls", "stroke": "volley", "skill": "contact"},
    {"id": "oh-1", "title": "Point at the Ball", "short": "Non-racket hand tracks the lob", "stroke": "overhead", "skill": "preparation"},
    {"id": "oh-2", "title": "Turn Sideways", "short": "Shoulders perpendicular to net", "stroke": "overhead", "skill": "footwork"},
    {"id": "oh-3", "title": "Back Foot First", "short": "Move back with crossover steps", "stroke": "overhead", "skill": "footwork"},
    {"id": "oh-4", "title": "Scissor Kick", "short": "Jump and switch legs for power", "stroke": "overhead", "skill": "footwork"},
    {"id": "oh-5", "title": "High Contact Point", "short": "Hit at full arm extension", "stroke": "overhead", "skill": "contact"},
    {"id": "oh-6", "title": "Aim Deep Center", "short": "Safe target for tough overheads", "stroke": "overhead", "skill": "tactics"},
    {"id": "oh-7", "title": "Bounce Smash", "short": "Let deep lobs bounce first", "stroke": "overhead", "skill": "tactics"},
    {"id": "ap-1", "title": "Move Through the Shot", "short": "Don't stop to hit approach shots", "stroke": "approach", "skill": "footwork"},
    {"id": "ap-2", "title": "Split Before Volley", "short": "Stop and balance after approach", "stroke": "approach", "skill": "footwork"},
    {"id": "ap-3", "title": "Approach Down the Line", "short": "Close off the passing angle", "stroke": "approach", "skill": "tactics"},
    {"id": "ap-4", "title": "Slice Approach", "short": "Low ball stays low for difficult pass", "stroke": "approach", "skill": "contact"},
    {"id": "ap-5", "title": "Depth Over Pace", "short": "Deep approach pins opponent back", "stroke": "approach", "skill": "tactics"},
    {"id": "ap-6", "title": "Wrong-Foot Approach", "short": "Hit behind the recovering opponent", "stroke": "approach", "skill": "tactics"},
    {"id": "ap-7", "title": "Drive Approach", "short": "Attack weak balls with pace", "stroke": "approach", "skill": "contact"},
    {"id": "ap-8", "title": "Read the Pass", "short": "Watch opponent setup for volley", "stroke": "approach", "skill": "tactics"},
    {"id": "ds-1", "title": "Soft Hands", "short": "Relax grip for touch shots", "stroke": "drop-shot", "skill": "contact"},
    {"id": "ds-2", "title": "Disguise the Shot", "short": "Same preparation as a drive", "stroke": "drop-shot", "skill": "preparation"},
    {"id": "ds-3", "title": "Backspin for Bite", "short": "Slice under the ball", "stroke": "drop-shot", "skill": "contact"},
    {"id": "ds-4", "title": "When Opponent is Deep", "short": "Use when they can't reach it", "stroke": "drop-shot", "skill": "tactics"},
    {"id": "ds-5", "title": "Follow Your Drop", "short": "Move forward after drop shot", "stroke": "drop-shot", "skill": "tactics"},
    {"id": "ds-6", "title": "Angle Drop Shot", "short": "Cross court with sharp angle", "stroke": "drop-shot", "skill": "contact"},
    {"id": "ds-7", "title": "Drop on Return", "short": "Surprise with short return", "stroke": "drop-shot", "skill": "tactics"},
    {"id": "ds-8", "title": "Counter-Drop", "short": "Drop shot the drop shot", "stroke": "drop-shot", "skill": "tactics"},
    {"id": "lb-1", "title": "High and Deep", "short": "Clear the net player with height", "stroke": "lob", "skill": "contact"},
    {"id": "lb-2", "title": "Defensive Lob", "short": "Buy time when pulled wide", "stroke": "lob", "skill": "tactics"},
    {"id": "lb-3", "title": "Topspin Lob", "short": "Ball kicks away after bounce", "stroke": "lob", "skill": "contact"},
    {"id": "lb-4", "title": "Lob the Poacher", "short": "Over the head of the net player", "stroke": "lob", "skill": "tactics"},
    {"id": "lb-5", "title": "Lob Recovery", "short": "Move back to center after lobbing", "stroke": "lob", "skill": "recovery"},
    {"id": "lb-6", "title": "Disguised Lob", "short": "Set up like a passing shot", "stroke": "lob", "skill": "tactics"},
    {"id": "lb-7", "title": "Offensive Lob", "short": "Go for winner over closing net player", "stroke": "lob", "skill": "contact"},
    {"id": "sl-1", "title": "Continental Grip", "short": "Same grip as serve and volley", "stroke": "slice", "skill": "preparation"},
    {"id": "sl-2", "title": "High to Low Path", "short": "Swing down through the ball", "stroke": "slice", "skill": "contact"},
    {"id": "sl-3", "title": "Stay Sideways", "short": "Don't open shoulders early", "stroke": "slice", "skill": "preparation"},
    {"id": "sl-4", "title": "Slice Approach Shot", "short": "Low ball for easier volley", "stroke": "slice", "skill": "tactics"},
    {"id": "sl-5", "title": "Defensive Slice", "short": "Float deep when out of position", "stroke": "slice", "skill": "tactics"},
    {"id": "sl-6", "title": "Change of Pace", "short": "Disrupt rhythm with slice", "stroke": "slice", "skill": "tactics"},
    {"id": "sl-7", "title": "Wide Slice Angle", "short": "Open court with underspin", "stroke": "slice", "skill": "contact"},
    {"id": "sl-8", "title": "Heavy Slice", "short": "Maximum spin, ball stays down", "stroke": "slice", "skill": "contact"},
    {"id": "sl-9", "title": "Slice vs Topspin", "short": "Neutralize heavy hitters", "stroke": "slice", "skill": "tactics"},
    {"id": "sl-10", "title": "Forehand Slice", "short": "Surprise weapon for variety", "stroke": "slice", "skill": "contact"},
]


def main():
    if not ANTHROPIC_API_KEY:
        print("Error: ANTHROPIC_API_KEY not found in .env file")
        sys.exit(1)

    videos_path = "output/channel_videos.json"
    if not os.path.exists(videos_path):
        print(f"Error: {videos_path} not found. Run fetch_videos.py first.")
        sys.exit(1)

    with open(videos_path) as f:
        all_videos = json.load(f)

    # Format videos for the prompt
    videos_text = "\n".join(
        f"- ID:{v['videoId']} | {v['title']}"
        + (f" | {v['description'][:200]}" if v.get('description') else "")
        for v in all_videos
    )

    # Format cues for the prompt
    cues_text = "\n".join(
        f"- {c['id']}: \"{c['title']}\" ({c['stroke']}/{c['skill']}) - {c['short']}"
        for c in CUES
    )

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    print(f"Matching {len(CUES)} cues against {len(all_videos)} videos...\n")

    # Send all at once - Claude can handle this context size
    response = client.messages.create(
        model=MODEL,
        max_tokens=8192,
        system="""You are an expert tennis coach matching tennis technique cues to YouTube videos from the channel "Karue Sell" (formerly MyTennisHQ).

Given a list of tennis cues (technique tips) and a list of YouTube videos, match each cue to the SINGLE best video that teaches or demonstrates that specific technique.

Rules:
1. Only match if the video CLEARLY covers the cue's technique. Don't force matches.
2. Prefer instructional/lesson videos over match highlights, vlogs, shorts, or equipment reviews.
3. Videos with titles like "How To...", "Lesson", "Tip", "Drill" are usually instructional.
4. Shorts (#shorts, emojis in title, very short descriptions) are usually NOT good matches.
5. Match highlights and practice sets are NOT good matches unless the title specifically mentions the technique.
6. A video about "forehand" should only match forehand cues, not backhand cues.
7. Be specific: "KICK SERVE Lesson" matches "Kick Serve Height" not "Continental Grip".
8. For cues with no good match, omit them entirely.
9. Set startTime to 0 for all matches (we don't have timestamp data).
10. Estimate endTime based on typical video length (use 0 if unknown).

Respond with a JSON array of matches.""",
        messages=[{
            "role": "user",
            "content": f"""Here are all the YouTube videos from Karue Sell's channel:

{videos_text}

Here are the tennis cues to match:

{cues_text}

For each cue that has a good video match, respond with JSON:
[
  {{
    "cueId": "sv-6",
    "videoId": "DPgG5oNSUIM",
    "videoTitle": "Tennis KICK SERVE Lesson - Overcoming Second Serve NERVES",
    "startTime": 0,
    "endTime": 0,
    "segmentDescription": "Karue teaches kick serve technique and how to overcome second serve nerves",
    "confidence": 90
  }}
]

Return ONLY the JSON array, no other text."""
        }],
    )

    text = response.content[0].text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()

    try:
        matches = json.loads(text)
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        print("Raw response saved to output/raw_response.txt")
        with open("output/raw_response.txt", "w") as f:
            f.write(response.content[0].text)
        sys.exit(1)

    # Add cue titles for review convenience
    cue_titles = {c["id"]: c["title"] for c in CUES}
    for match in matches:
        match["cueTitle"] = cue_titles.get(match["cueId"], "Unknown")

    # Sort by confidence
    matches.sort(key=lambda m: m.get("confidence", 0))

    output_path = "output/proposed_matches.json"
    with open(output_path, "w") as f:
        json.dump(matches, f, indent=2)

    matched_cues = {m["cueId"] for m in matches}
    unmatched = [c for c in CUES if c["id"] not in matched_cues]

    print(f"=== Results ===")
    print(f"  Matched: {len(matches)}/{len(CUES)} cues")
    print(f"  Unmatched: {len(unmatched)} cues")
    if unmatched:
        print(f"\n  Unmatched cues:")
        for c in unmatched:
            print(f"    - {c['id']}: {c['title']} ({c['stroke']}/{c['skill']})")

    high_conf = sum(1 for m in matches if m.get("confidence", 0) >= 80)
    low_conf = sum(1 for m in matches if m.get("confidence", 0) < 60)
    print(f"\n  High confidence (>=80): {high_conf}")
    print(f"  Low confidence (<60): {low_conf}")
    print(f"\n  Saved to {output_path}")
    print(f"\n  Next: run review_matches.py to approve/reject matches")


if __name__ == "__main__":
    main()
