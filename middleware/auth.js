async function checkSetup(req, res, next) {
    console.log("check setup");
    const Admin = require('../models/admin');
    try {
        const adminExists = await Admin.findOne({ setupComplete: true });
        if (!adminExists && req.path !== '/admin/setup') {
            console.log("attempting to redirect to setup");
            return res.redirect('/admin/setup');
        }
        if (adminExists && req.path === '/admin/setup') {
            console.log("attempting to redirect to login");
            return res.redirect('/admin/login');
        }
        next();
    } catch (error) {
        console.error('Setup check failed:', error);
        next(error);
    }
}

function requireAuth(req, res, next) {
    console.log('Session data in requireAuth:', req.session);
    if (req.session && req.session.isAuthenticated) {
        console.log('User is authenticated');
        next();
    } else {
        console.log('User is not authenticated, redirecting to login');
        res.redirect('/admin/login');
    }
}

console.log("Bottom")
module.exports = { requireAuth, checkSetup };