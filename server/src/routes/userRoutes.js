const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth'); // Injects secure JWT verification layer

// 1. Public Authentication Endpoints
router.post('/signup', userController.signup);
router.post('/login', userController.login);

// 2. SECURED Endpoint: Triggers user profile state recovery out of PostgreSQL on reloads
router.get('/me', auth, userController.getMe); 

// Module export declaration must stay at the absolute bottom of the script architecture
module.exports = router;
