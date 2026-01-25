# Chess Game Server

Backend server for the chess game with real-time multiplayer and database integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure NeonDB:
   - Visit https://console.neon.tech/app/projects/flat-rice-23279598
   - Click "Connection Details" 
   - Copy the connection string
   - Create `.env` file from `.env.example`
   - Paste your connection string as `DATABASE_URL`

3. Initialize database:

**Option A: Using psql**
```bash
psql $DATABASE_URL -f schema.sql
```

**Option B: Using NeonDB Console**
- Go to your project dashboard
- Click "SQL Editor"
- Copy and paste contents of `schema.sql`
- Click "Run"

4. Start server:
```bash
npm start
```

Server will run on http://localhost:3000

## Database Schema

The database includes:
- **users**: Player accounts with ratings and stats
- **games**: Game history with moves and results

## API Endpoints

- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - User login
- `GET /api/leaderboard` - Get top players
- `POST /api/games` - Save game result
- `PATCH /api/users/:id/rating` - Update player rating

## WebSocket Events

- `join_game` - Join a game room
- `move` - Send/receive chess moves
- `chat_message` - Send/receive chat messages
