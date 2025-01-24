import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';
import crypto from 'crypto';
import figlet from 'figlet';
import fs from 'fs';
import http from 'http';

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
      password TEXT,
      key TEXT
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

  await db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      slug TEXT
    );
  `);
})();

app.use(express.json());

async function validateUser(key, username, isRoute) {
  if (isRoute) {
    try {
      const user = await db.get('SELECT * FROM users WHERE key = ? AND username = ?', [key, username]);
      if (user) {
        return { success: true, user };
      } else {
        return { success: false, message: 'Your session has failed verification, please try again.' };
      }
    } catch (error) {
      console.error('[!] Error validating user:', error);
      return { success: false, message: 'Server error' };
    }
  } else {
    try {
      const user = await db.get('SELECT * FROM users WHERE key = ? AND username = ?', [key, username]);
      if (user) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('[!] Error validating user:', error);
      return false;
    }
  }
}

app.get('/api/posts/get/:slug', async (req, res) => {
  const { slug } = req.params;

  console.log("[i] Received request for post with slug", slug);

  try {
    const post = await db.get('SELECT * FROM posts WHERE slug = ?', [slug]);
    if (post) {
      console.log("[i] Found post entry in database with slug", slug);
      const md = post.content;
      if (md === null) {
        console.log("[!] Post does not have any content");
        res.json({ success: false, message: 'Post not found' });
      } else {
        console.log("[✓] Sending post content to client");
        res.send(md);
      }
    } else {
      console.log("[X] Post not found in database");
      res.json({ success: false, message: 'Post not found' });
    }
  } catch (error) {
    console.error('[!] Error fetching post:', error);
    res.json({ success: false, message: 'Server error' });
  }
});

app.post('/api/admin/validate', async (req, res) => {
  const { key, username } = req.body;
  console.log("[i] Received key validation request for", username);
  const result = await validateUser(key, username, true);
  if (result.success) {
    console.log("[✓] User validated");
    res.json({ success: true });
  } else {
    console.log("[X] User validation failed");
    res.json(result);
  }
});

app.post('/api/admin/posts/totalPosts', async (req, res) => {
  const { key, username } = req.body;
  console.log("[i] Received request to count total posts from", username);

  const isValid = await validateUser(key, username, false);
  if (!isValid) {
    console.log("[X] User validation failed");
    return res.json({ message: 'Invalid credentials' });
  }

  try {
    const result = await db.get('SELECT COUNT(*) as count FROM posts');
    console.log("[✓] Total posts counted:", result.count);
    res.json({ count: result.count });
  } catch (error) {
    console.error('[!] Error counting posts:', error);
    res.json({ message: 'Server error' });
  }
});

app.post('/api/admin/users/totalUsers', async (req, res) => {
  const { key, username } = req.body;
  console.log("[i] Received request to count total users from", username);

  const isValid = await validateUser(key, username, false);
  if (!isValid) {
    console.log("[X] User validation failed");
    return res.json({ message: 'Invalid credentials' });
  }

  try {
    const result = await db.get('SELECT COUNT(*) as count FROM users');
    console.log("[✓] Total users counted:", result.count);
    res.json({ count: result.count });
  } catch (error) {
    console.error('[!] Error counting users:', error);
    res.json({ message: 'Server error' });
  }
});

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const key = crypto.randomBytes(32).toString('hex');
  try {
    const user = await db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    if (user) {
      console.log("[✓] User logged in:", username);
      await db.run('UPDATE users SET key = ? WHERE username = ?', [key, username]);
      console.log("[✓] Key updated for", username);
      res.json({ success: true, user, key: key });
    } else {
      console.log("[X] Invalid credentials for", username);
      res.json({ success: false, message: 'Incorrect username or password' });
    }
  } catch (error) {
    console.error('[!] Error logging in:', error);
    res.json({ success: false, message: 'Server error' });
  }
});

app.post('/api/users/add', async (req, res) => {
  const { username, email, password, key } = req.body;
  console.log("[i] Received request to add user", username);
  const result = await db.run('INSERT INTO users (username, email, password, key) VALUES (?, ?, ?, ?)', [username, email, password, key]);
  if (result) {
    console.log("[✓] User added successfully");
    res.json({ id: result.lastID });
  } else {
    console.log("[X] Failed to add user");
    res.json({ success: false, message: 'Failed to add user' });
  }
});

app.post('/api/posts/new', async (req, res) => {
  const { title, description, category, slug, content, date } = req.body;
  console.log("[i] Received request to add new post:", title);
  const result = await db.run('INSERT INTO posts (title, description, category, slug, content, date) VALUES (?, ?, ?, ?, ?, ?)', [title, description, category, slug, content, date]);
  if (result) {
    console.log("[✓] Post added successfully");
    res.json({ slug: result.slug });
  } else {
    console.log("[X] Failed to add post");
    res.json({ success: false, message: 'Failed to add post' });
  }
});

app.get('/api/posts/fetchList', async (req, res) => {
  console.log("[i] Received request to fetch post list");
  try {
    const posts = await db.all('SELECT id, title, description, category, slug, date FROM posts');
    console.log("[✓] Fetched post list");
    res.json({ posts });
  } catch (error) {
    console.error('[!] Error fetching post list:', error);
    res.json({ message: 'Server error' });
  }
});

app.get('/api/categories/fetchList', async (req, res) => {
  console.log("[i] Received request to fetch category list");
  try {
    const categories = await db.all('SELECT id, name, description, slug FROM categories');
    console.log("[✓] Fetched category list");
    res.json({ categories });
  } catch (error) {
    console.error('[!] Error fetching category list:', error);
    res.json({ message: 'Server error' });
  }
});

app.get('/api/posts/getPostDetails/:slug', async (req, res) => {
  const { slug } = req.params;
  console.log("[i] Received request to fetch post details for slug", slug);
  try {
    const postData = await db.get('SELECT title, date, category FROM posts WHERE slug = ?', [slug]);
    if (!postData || !postData.title || !postData.date || !postData.category) {
      console.log("[X] Failed to query post details not found for slug", slug);
      return res.json({ success: false, message: 'Post data not found' });
    }
    console.log("[✓] Fetched post details for slug", slug);
    res.json({ success: true, title: postData.title, date: postData.date, category: postData.category });
  } catch (error) {
    console.error('[!] Error fetching post details for ', slug, ': ', error);
    res.json({ success: false });
  }
});

async function checkFrontendStatus() { // please someone come up with a better name for this function
  return new Promise((resolve) => {
    http.get('http://localhost:3000', (res) => {
      if (res.statusCode === 200) {
        resolve("│ ONLINE │ :3000 │ Frontend                    │");
      } else {
        resolve("│  DOWN  │ :3000 │ Frontend                    │");
      }
    }).on('error', () => {
      resolve("│  DOWN  │ :3000 │ Frontend                    │");
    });
  });
}

app.listen(port, async () => {
  figlet("BlogPop", async function (err, data) {
    if (err) {
      console.log("┌─────────────ascii display failed─────────────┐");
      console.log("│            BLOGPOP SERVER EDITION            │");
      console.log("├──────────────────────────────────────────────┤");
      console.log("│ IF YOU PAID FOR THIS CODE, YOU WERE SCAMMED! │");
      console.log("└──────────────────────────────────────────────┘");
    } else {
      console.log(data + "\n");
      console.log("┌──────────────────────────────────────────────┐");
      console.log("│           SERVER EDITION / BSD-3.0           │");
      console.log("├──────────────────────────────────────────────┤");
      console.log("│ IF YOU PAID FOR THIS CODE, YOU WERE SCAMMED! │")
      console.log("└──────────────────────────────────────────────┘\n");
    }

    console.log("┌────────┬───────┬─────────────────────────────┐");
    console.log("│ STATUS │ PORT  │ SERVICE                     │");
    console.log("├────────┼───────┼─────────────────────────────┤");
    console.log("│ ONLINE │ :3001 │ Backend                     │");
    const dbStatus = fs.existsSync('./db.sqlite') ? "ONLINE" : " DOWN ";
    console.log(`│ ${dbStatus} │ XXXXX │ Database                    │`);
    const frontendStatus = await checkFrontendStatus();
    console.log(frontendStatus);
    console.log("└────────┴───────┴─────────────────────────────┘\n");
  });
});

