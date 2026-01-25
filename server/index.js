require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Pool } = require('@neondatabase/serverless');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_in_production';

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
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, rating) VALUES ($1, $2, 1500) RETURNING id, username, rating, wins, losses, draws',
      [username, hashedPassword]
    );
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query(
      'SELECT id, username, password, rating, wins, losses, draws FROM users WHERE username = $1',
      [username]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    delete user.password;
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
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

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
});
