const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { marked } = require('marked');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const Admin = require('./models/admin');
const Post = require('./models/post');
const { requireAuth, checkSetup } = require('./middleware/auth');

const app = express();

mongoose.connect('mongodb://mongodb:27017/blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-rewkufhriufhweirhfuiewrhfiuewrhfiuehrwifuerhwuifwher-key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb://mongodb:27017/blog',
        ttl: 24 * 60 * 60
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24
    }
}));

marked.setOptions({
    breaks: true,
    gfm: true
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.locals.marked = marked;

app.use((req, res, next) => {
    console.log('Session data after middleware:', req.session);
    res.locals.isAuthenticated = req.session.isAuthenticated || false;
    next();
});

app.get('/', async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 });
    console.log('hi');
    res.render('index', { posts });
});

app.get('/admin/setup', checkSetup, (req, res) => {
    console.log('trying');
    res.render('admin/setup');
});

app.post('/admin/setup', checkSetup, async (req, res) => {
    try {
        const admin = new Admin({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            setupComplete: true
        });
        await admin.save();
        req.session.isAuthenticated = true;
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Setup failed:', error);
        res.render('admin/setup', { error: 'Setup failed. Please try again.' });
    }
});

app.post('/admin/login', async (req, res) => {
    try {
        const admin = await Admin.findOne({ username: req.body.username });
        if (admin && await bcrypt.compare(req.body.password, admin.password)) {
            req.session.isAuthenticated = true;
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return res.render('admin/login', { error: 'Login failed' });
                }
                console.log('Session data after login:', req.session);
                console.log('Login successful, redirecting to dashboard');
                return res.redirect('/admin/dashboard');
            });
        } else {
            console.log('Invalid credentials');
            res.render('admin/login', { error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login failed:', error);
        res.render('admin/login', { error: 'Login failed' });
    }
});

app.get('/admin/login', (req, res) => {
    res.render('admin/login');
});

app.post('/admin/login', async (req, res) => {
    try {
        const admin = await Admin.findOne({ username: req.body.username });
        if (admin && await bcrypt.compare(req.body.password, admin.password)) {
            req.session.isAuthenticated = true;
            console.log("in loop");
            return res.redirect('/admin/dashboard');
        }
        res.render('admin/login', { error: 'Invalid credentials' });
    } catch (error) {
        console.log('Login failed:', error);
        res.render('admin/login', { error: 'Login failed' });
    }
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout failed:', err);
        }
        res.redirect('/');
    });
});

app.get('/admin/dashboard', requireAuth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.render('admin/dashboard', { posts });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).send('Error loading dashboard');
    }
});

app.get('/admin/new', requireAuth, (req, res) => {
    res.render('admin/new');
});

app.post('/admin/posts', requireAuth, async (req, res) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    await post.save();
    res.redirect('/admin/dashboard');
});

app.get('/admin/posts/:id/edit', requireAuth, async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('admin/edit', { post });
});

app.post('/admin/posts/:id', requireAuth, async (req, res) => {
    await Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        content: req.body.content
    });
    res.redirect('/admin/dashboard');
});

app.post('/admin/posts/:id/delete', requireAuth, async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
});

const PORT = 2389;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});