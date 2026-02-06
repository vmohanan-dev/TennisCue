#!/bin/bash

# TennisCue Screenshot Capture Helper
# This script helps you capture App Store screenshots systematically

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SIMULATOR="iPhone 17 Pro"  # Use the currently booted simulator
OUTPUT_DIR="$HOME/Desktop/TennisCue-Screenshots"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          TennisCue App Store Screenshot Helper${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Create output directory
mkdir -p "$OUTPUT_DIR"
echo -e "${GREEN}✓${NC} Screenshots will be saved to: ${BLUE}$OUTPUT_DIR${NC}"
echo

# Check if simulator is booted
echo -e "${YELLOW}Checking simulator status...${NC}"
BOOTED=$(xcrun simctl list devices | grep "Booted" | head -1 || echo "")

if [ -z "$BOOTED" ]; then
    echo -e "${YELLOW}No simulator is currently booted.${NC}"
    echo -e "${YELLOW}Booting iPhone 17 Pro Max...${NC}"
    xcrun simctl boot "iPhone 17 Pro Max" 2>/dev/null || {
        echo -e "${YELLOW}iPhone 17 Pro Max not found. Using iPhone 17 Pro...${NC}"
        xcrun simctl boot "iPhone 17 Pro" || {
            echo -e "${RED}Failed to boot simulator. Please start one manually.${NC}"
            exit 1
        }
    }
    sleep 3
    echo -e "${GREEN}✓${NC} Simulator booted"
else
    SIMULATOR_NAME=$(echo "$BOOTED" | sed 's/.*(\([^)]*\)) (Booted).*/\1/')
    echo -e "${GREEN}✓${NC} Found booted simulator: $SIMULATOR_NAME"
    SIMULATOR="$SIMULATOR_NAME"
fi

# Function to take screenshot
take_screenshot() {
    local filename="$1"
    local description="$2"

    echo
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}Screenshot: ${description}${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}${description}${NC}"
    echo
    read -p "Press ENTER when ready to capture (or 's' to skip): " response

    if [ "$response" != "s" ]; then
        xcrun simctl io booted screenshot "$OUTPUT_DIR/$filename"
        echo -e "${GREEN}✓${NC} Saved: $filename"

        # Show dimensions
        dimensions=$(sips -g pixelWidth -g pixelHeight "$OUTPUT_DIR/$filename" | grep "pixel" | awk '{print $2}' | tr '\n' 'x' | sed 's/x$//')
        echo -e "${GREEN}  Dimensions: ${dimensions}${NC}"
    else
        echo -e "${YELLOW}⊘ Skipped${NC}"
    fi
}

# Main screenshot sequence
echo
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Ready to capture screenshots!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo
echo "Make sure your app is running on the simulator."
echo "Follow the prompts to navigate through the app."
echo
read -p "Press ENTER to start..."

# Screenshot 1: Onboarding/Welcome (if first time)
take_screenshot \
    "1-onboarding-welcome.png" \
    "ONBOARDING: Welcome screen showing skill level selection"

# Screenshot 2: Library - All Cues
take_screenshot \
    "2-library-all.png" \
    "LIBRARY: Navigate to Library tab, make sure 'All' filter is selected.
Shows the full catalog of tennis technique cues."

# Screenshot 3: Library - Stroke Filter
take_screenshot \
    "3-library-stroke.png" \
    "LIBRARY FILTERED: Tap 'By Stroke', then select 'Forehand' or any stroke.
Shows category organization and filtering."

# Screenshot 4: Cue Detail
take_screenshot \
    "4-cue-detail.png" \
    "CUE DETAIL: Tap on any cue card to view full details.
Shows coaching content, video links, and key points."

# Screenshot 5: Home - Active Cues
take_screenshot \
    "5-home-active.png" \
    "HOME: Go back to Library, toggle ON 3-4 cues, then go to Home tab.
Shows active practice focus areas and stats."

# Screenshot 6: Session Start
take_screenshot \
    "6-session-start.png" \
    "SESSION: From Home, tap 'Start Practice Session' button.
Shows the session recording interface."

# Screenshot 7: Sessions History (optional)
take_screenshot \
    "7-sessions-history.png" \
    "SESSIONS: Navigate to Sessions tab (if available).
Shows practice session history."

# Summary
echo
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Screenshot capture complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo
echo -e "${BLUE}Screenshots saved to:${NC}"
echo -e "${GREEN}$OUTPUT_DIR${NC}"
echo
echo -e "${BLUE}Captured files:${NC}"
ls -1 "$OUTPUT_DIR" | while read file; do
    echo -e "  ${GREEN}✓${NC} $file"
done

echo
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Open Finder and go to: $OUTPUT_DIR"
echo "2. Review each screenshot for quality"
echo "3. Choose your best 3-6 screenshots for App Store submission"
echo "4. Order them by importance (first screenshot = most important)"
echo
echo -e "${BLUE}Recommended order for App Store:${NC}"
echo "  1. Home with active cues (shows main value)"
echo "  2. Library with cues (shows content breadth)"
echo "  3. Cue detail (shows depth and quality)"
echo "  4. Library filtered (shows organization)"
echo "  5. Session recording (shows tracking feature)"
echo
echo -e "${GREEN}Done! 🎾${NC}"
