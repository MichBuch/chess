# Chess Game

Cross-platform chess game built with React Native and Expo for iOS and Android.

## Features

- Full chess gameplay with move validation
- Real-time multiplayer via WebSockets
- Chat interface for in-game communication
- Leaderboard with player rankings
- Board snapshot export (FEN format + JSON) for test data
- NeonDB PostgreSQL database for user data and game history

## Setup

### Mobile App

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example` and configure URLs

3. Start the app:
```bash
npm start
# Then press 'i' for iOS or 'a' for Android
```

### Backend Server

1. Navigate to server directory:
```bash
cd server
npm install
```

2. Set up NeonDB:
   - Go to https://console.neon.tech/app/projects/flat-rice-23279598
   - Click "Connection Details" and copy the connection string
   - Create `.env` file in server directory with: `DATABASE_URL=your_connection_string`
   - Run schema: `psql $DATABASE_URL -f schema.sql`
   - Or use NeonDB SQL Editor in the console to run the schema.sql contents

3. Start server:
```bash
npm start
```

## Board Snapshots

Export board state at any time during gameplay:
- Tap "Export Snapshot" button in game
- Exports JSON with board state, FEN notation, timestamp, and move number
- Use for testing, analysis, or training data

## App Store Preparation

The app is configured for both iOS and Android:
- Update `app.json` with your bundle identifiers
- Add app icons to `assets/` directory
- Configure signing in Expo EAS
- Run `eas build` for production builds

## Tech Stack

- React Native + Expo
- TypeScript
- Socket.io (real-time)
- NeonDB (PostgreSQL)
- React Navigation
