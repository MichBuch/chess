const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Pool } = require('@neondatabase/serverless');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_game', ({ gameId }) => {
    socket.join(gameId);
  });

  socket.on('move', ({ gameId, move }) => {
    socket.to(gameId).emit('move', move);
  });

  socket.on('chat_message', async ({ gameId, message }) => {
    const chatMessage = {
      id: Date.now().toString(),
      userId: socket.id,
      username: 'Player',
      message,
      timestamp: Date.now(),
    };
    io.to(gameId).emit('chat_message', chatMessage);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  const result = await pool.query(
    'INSERT INTO users (username, password, rating) VALUES ($1, $2, 1500) RETURNING id, username, rating',
    [username, password]
  );
  res.json({ user: result.rows[0], token: 'jwt_token_here' });
});

app.get('/api/leaderboard', async (req, res) => {
  const result = await pool.query(
    'SELECT id, username, rating, wins, losses, draws FROM users ORDER BY rating DESC LIMIT 100'
  );
  const leaderboard = result.rows.map((user, index) => ({
    rank: index + 1,
    user,
  }));
  res.json(leaderboard);
});

app.post('/api/games', async (req, res) => {
  const { whitePlayerId, blackPlayerId, winnerId, moves } = req.body;
  await pool.query(
    'INSERT INTO games (white_player_id, black_player_id, winner_id, moves) VALUES ($1, $2, $3, $4)',
    [whitePlayerId, blackPlayerId, winnerId, JSON.stringify(moves)]
  );
  res.json({ success: true });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
