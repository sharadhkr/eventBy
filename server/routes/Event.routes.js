// src/routes/event.routes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const { createEvent, getEvents, registerForEvent } = require('../controllers/event.controller');

// Anyone can see events
router.get('/', getEvents);

// Anyone logged in can create event
router.post('/', verifyToken, createEvent);

// Anyone logged in can register
router.post('/:eventId/register', verifyToken, registerForEvent);

module.exports = router;