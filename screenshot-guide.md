# TennisCue App Store Screenshots Guide

## Overview
This guide will help you capture the required screenshots for App Store submission.

## Required Screenshots

### iPhone (6.9" Display - iPhone 17 Pro Max)
**Resolution**: 1320x2868px (for iPhone 17 Pro Max)
**Minimum required**: 3 screenshots
**Maximum allowed**: 10 screenshots

### Recommended Screens to Capture

1. **Home Screen with Active Cues** (Primary screenshot)
   - Shows the main value: active practice cues
   - Displays stats and "Start Practice Session" button
   - Best first impression

2. **Library View - All Cues**
   - Shows the full library of tennis technique cues
   - Demonstrates the breadth of content
   - Filter tabs visible at top

3. **Library View - Filtered by Stroke**
   - Shows category filtering (e.g., Forehand, Backhand)
   - Demonstrates organization and categorization

4. **Individual Cue Card Detail**
   - Pick a popular cue like "Split Step Timing"
   - Shows detailed coaching content
   - Displays video links and key points

5. **Session Recording Screen** (Optional but recommended)
   - Shows the practice rating interface
   - Demonstrates the tracking feature

6. **Onboarding Welcome** (Optional)
   - Shows the skill level selection
   - Good for showing ease of getting started

## Step-by-Step Screenshot Process

### Setup

1. **Boot the iPhone 17 Pro Max simulator:**
   ```bash
   xcrun simctl boot "iPhone 17 Pro Max"
   ```

2. **Start your app:**
   ```bash
   npm run ios
   ```
   Or press `i` in the Expo terminal to open on iOS

3. **Wait for app to load completely**

### Capture Screenshots

The simulator is already booted (iPhone 17 Pro). Use it or boot iPhone 17 Pro Max:

**Method 1: Using Simulator Menu**
- With simulator focused: `Cmd + S` saves screenshot to Desktop
- Screenshots are automatically saved as PNG files

**Method 2: Using Command Line**
```bash
# Take screenshot of iPhone 17 Pro Max
xcrun simctl io "iPhone 17 Pro Max" screenshot ~/Desktop/tenniscue-1-home.png

# For the currently booted simulator (iPhone 17 Pro):
xcrun simctl io booted screenshot ~/Desktop/tenniscue-1-home.png
```

### Recommended Screenshot Sequence

1. **Navigate to Library** and select some cues (toggle them on)
   - Capture: Library screen showing filters and cues

2. **Go to Home tab**
   - Should show "No Active Cues" initially or active cues if you selected some
   - Capture: Home screen with active cues

3. **Go back to Library, select "By Stroke"**
   - Capture: Library with stroke categories

4. **Tap on a cue** (e.g., "Split Step")
   - Capture: Cue detail screen

5. **Go to Sessions tab** (if implemented)
   - Capture: Sessions history or empty state

6. **Tap "Start Practice Session"** from home
   - Capture: Session rating screen

## Screenshot Naming Convention

Save screenshots with clear names:
```
tenniscue-iphone-1-home.png
tenniscue-iphone-2-library-all.png
tenniscue-iphone-3-library-filtered.png
tenniscue-iphone-4-cue-detail.png
tenniscue-iphone-5-session.png
```

## After Capturing

1. **Check screenshot dimensions:**
   ```bash
   sips -g pixelWidth -g pixelHeight ~/Desktop/tenniscue-iphone-1-home.png
   ```

2. **Create a screenshots folder:**
   ```bash
   mkdir -p ~/Desktop/TennisCue-Screenshots
   mv ~/Desktop/tenniscue-*.png ~/Desktop/TennisCue-Screenshots/
   ```

3. **Verify quality:**
   - Open each screenshot
   - Ensure text is readable
   - Check that colors look good
   - No loading states or blank screens

## iPad Screenshots (Optional but Recommended)

Your app supports iPad. If you want to submit iPad screenshots:

**iPad Pro 12.9" (6th generation)**
- Resolution: 2048x2732px
- Follow the same process but with iPad simulator

```bash
xcrun simctl boot "iPad Pro (12.9-inch) (6th generation)"
npm run ios
# Take screenshots as above
```

## Tips for Great Screenshots

1. **Use a clean state**: Reset app data if needed
2. **Show actual content**: Don't show empty states except for onboarding
3. **Consistent lighting**: Use light mode or dark mode consistently
4. **Add some data**:
   - Select 3-5 active cues for home screen
   - Show populated library
   - If possible, show session history

4. **Order matters**: Your first screenshot is most important - it's what users see first in the App Store

## Optional: Screenshot Beautification

After capturing, you can:
- Add device frames using tools like [Screenshot.rocks](https://screenshot.rocks)
- Add text overlays highlighting features (optional)
- Use Apple's official marketing templates (advanced)

For now, clean simulator screenshots are perfectly acceptable for your first submission.

## Automation Script

Run the automated screenshot helper:
```bash
bash capture-screenshots.sh
```

This will guide you through capturing all required screenshots.
