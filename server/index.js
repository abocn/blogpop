import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors(
  {
    origin: 'http://localhost:3000',
    credentials: true
  }
));

let db;

(async () => {
  db = await open({
    filename: './db.sqlite',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      email TEXT,
      password TEXT
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      category TEXT,
      slug TEXT,
      content TEXT,
      date TEXT
    );
  `);
})();

app.use(express.json());

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/users/add', async (req, res) => {
  const { username, email, password } = req.body;
  const result = await db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password]);
  res.json({ id: result.lastID });
});

app.post('/api/posts/new', async (req, res) => {
  const { title, description, category, slug, content, date } = req.body;
  const result = await db.run('INSERT INTO posts (title, description, category, slug, content, date) VALUES (?, ?, ?, ?, ?, ?)', [title, description, category, slug, content, date]);
  res.json({ id: result.lastID });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});