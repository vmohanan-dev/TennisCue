# TennisCue Screenshot Capture Steps

## Your App is Running! 🎾

The app is now live on your iPhone 17 Pro simulator. Follow these steps to capture screenshots:

## Method: Keyboard Shortcut (Easiest)

1. **Focus the simulator** - Click on the simulator window
2. **Navigate to a screen** in your app
3. **Press `Cmd + S`** - Screenshot saves to Desktop automatically
4. **Repeat** for each screen below

## Screenshots to Capture (in order of importance):

### 1. Library - All Cues (FIRST/MOST IMPORTANT)
**Why**: Shows the breadth of coaching content
- Tap the "Library" tab at the bottom
- Make sure "All" filter is selected at the top
- You should see a list of all tennis technique cues
- **Press `Cmd + S`** to capture

### 2. Home - With Active Cues
**Why**: Shows the app's main value proposition
- First, **toggle ON 3-5 cues** from the Library (tap the switch on the right side of any cue card)
- Then tap the "Home" tab
- You should see active cues, stats, and "Start Practice Session" button
- **Press `Cmd + S`** to capture

### 3. Library - Filtered by Stroke
**Why**: Shows organization and filtering
- Go back to Library tab
- Tap "By Stroke" at the top
- Tap on "Forehand" or any stroke category that appears
- **Press `Cmd + S`** to capture

### 4. Cue Detail Screen
**Why**: Shows depth and quality of coaching content
- From Library, tap on any cue card (like "Split Step" or "Unit Turn")
- You'll see the full detail screen with description, key points, and videos
- **Press `Cmd + S`** to capture

### 5. Session Recording Screen (Optional)
**Why**: Shows the practice tracking feature
- Go to Home tab
- Tap the green "Start Practice Session" button
- You'll see the session rating interface
- **Press `Cmd + S`** to capture

### 6. Onboarding (If Visible)
**Why**: Shows ease of getting started
- If you saw an onboarding screen when the app first launched, great!
- If not, you can reinstall the app to see it again:
  - In simulator menu: Device → Erase All Content and Settings
  - Then run `npm run ios` again
- **Press `Cmd + S`** to capture the welcome/skill selection screen

## After Capturing

Your screenshots will be on your Desktop with names like:
- `Simulator Screenshot - iPhone 17 Pro - 2026-02-06 at 15.30.45.png`

### Rename them for clarity:
```bash
cd ~/Desktop
mv "Simulator Screenshot*1*.png" tenniscue-1-library-all.png
mv "Simulator Screenshot*2*.png" tenniscue-2-home-active.png
mv "Simulator Screenshot*3*.png" tenniscue-3-library-filtered.png
mv "Simulator Screenshot*4*.png" tenniscue-4-cue-detail.png
mv "Simulator Screenshot*5*.png" tenniscue-5-session.png
```

Or just organize them into a folder:
```bash
mkdir -p ~/Desktop/TennisCue-Screenshots
mv ~/Desktop/*Simulator*Screenshot*.png ~/Desktop/TennisCue-Screenshots/
```

## Check Screenshot Quality

After capturing, verify:
- ✓ Text is readable
- ✓ No loading states or blank screens
- ✓ Colors look good
- ✓ Captures show the main features clearly

## Screenshot Dimensions

Your iPhone 17 Pro screenshots will be approximately **1179x2556px**.

For App Store submission, Apple accepts this size for the 6.1"/6.3" display category, which is perfect!

## Need Help?

If you need to:
- **Restart the app**: Close simulator and run `npm run ios` again
- **Reset app data**: Simulator menu → Device → Erase All Content and Settings
- **Take more screenshots**: Just navigate and press `Cmd + S` again

## Next Steps

Once you have 3-6 good screenshots:
1. Choose your best ones (prioritize Library and Home screens)
2. They're ready for App Store Connect upload!
3. You can optionally add device frames or text overlays later (not required)

Happy screenshotting! 📸🎾
