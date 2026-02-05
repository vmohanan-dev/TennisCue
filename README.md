# TennisCue

A mobile tennis coaching app that helps players of all skill levels improve their game through visual cue cards and progress tracking.

> **Note:** This project is currently a work in progress.

## Features

- **Cue Cards** - Visual technique cards with tips and guidance to improve your strokes
- **Progress Tracking** - Monitor your improvement over time as you practice

## Screenshots

<!-- Add screenshots here -->
| Home | Cue Card | Progress |
|------|----------|----------|
| Coming soon | Coming soon | Coming soon |

## Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 54)
- **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) with typed routes
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Language:** TypeScript
- **Platforms:** iOS, Android, Web

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/vmohanan-dev/TennisCue.git
   cd TennisCue
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm start
   ```

4. Run on your preferred platform
   ```bash
   npm run ios      # iOS simulator
   npm run android  # Android emulator
   npm run web      # Web browser
   ```

## Project Structure

```
TennisCue/
├── app/                  # App screens (Expo Router)
│   ├── (tabs)/          # Tab navigation screens
│   ├── cue/             # Cue card screens
│   ├── onboarding/      # Onboarding flow
│   └── session/         # Session screens
├── components/          # Reusable UI components
├── constants/           # App constants and theme
├── data/                # Static data (cues, quiz)
├── store/               # Zustand state stores
└── types/               # TypeScript type definitions
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
