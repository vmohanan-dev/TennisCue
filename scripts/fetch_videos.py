"""
Step 1: Fetch all videos from the Karue Sell YouTube channel.

Usage:
    python fetch_videos.py

Requires YOUTUBE_API_KEY in .env file.
Output: output/channel_videos.json
"""

import json
import os
import sys

from dotenv import load_dotenv
from googleapiclient.discovery import build

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
CHANNEL_HANDLE = "@Karue-Sell"


def get_channel_id(youtube):
    """Resolve channel handle to channel ID."""
    # Try the channels.list with forHandle (works for @handles)
    response = youtube.channels().list(part="id", forHandle=CHANNEL_HANDLE.lstrip("@")).execute()
    if response.get("items"):
        return response["items"][0]["id"]

    # Fallback: search for the channel
    response = youtube.search().list(
        part="snippet", q=CHANNEL_HANDLE, type="channel", maxResults=1
    ).execute()
    if response.get("items"):
        return response["items"][0]["snippet"]["channelId"]

    return None


def get_uploads_playlist_id(youtube, channel_id):
    """Get the uploads playlist ID for a channel."""
    response = youtube.channels().list(
        part="contentDetails", id=channel_id
    ).execute()
    return response["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]


def get_all_videos(youtube, playlist_id):
    """Fetch all videos from a playlist, handling pagination."""
    videos = []
    next_page_token = None

    while True:
        response = youtube.playlistItems().list(
            part="snippet",
            playlistId=playlist_id,
            maxResults=50,
            pageToken=next_page_token,
        ).execute()

        for item in response.get("items", []):
            snippet = item["snippet"]
            videos.append({
                "videoId": snippet["resourceId"]["videoId"],
                "title": snippet["title"],
                "description": snippet.get("description", ""),
                "publishedAt": snippet["publishedAt"],
            })

        next_page_token = response.get("nextPageToken")
        if not next_page_token:
            break

    return videos


def main():
    if not YOUTUBE_API_KEY:
        print("Error: YOUTUBE_API_KEY not found in .env file")
        print("Get a free key at https://console.cloud.google.com/apis/credentials")
        print("Enable 'YouTube Data API v3' in your Google Cloud project")
        sys.exit(1)

    youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)

    print(f"Resolving channel handle: {CHANNEL_HANDLE}")
    channel_id = get_channel_id(youtube)
    if not channel_id:
        print(f"Error: Could not find channel for {CHANNEL_HANDLE}")
        sys.exit(1)
    print(f"Channel ID: {channel_id}")

    playlist_id = get_uploads_playlist_id(youtube, channel_id)
    print(f"Uploads playlist: {playlist_id}")

    print("Fetching videos...")
    videos = get_all_videos(youtube, playlist_id)

    os.makedirs("output", exist_ok=True)
    output_path = "output/channel_videos.json"
    with open(output_path, "w") as f:
        json.dump(videos, f, indent=2)

    print(f"Found {len(videos)} videos, saved to {output_path}")


if __name__ == "__main__":
    main()
