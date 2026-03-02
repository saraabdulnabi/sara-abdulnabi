const express = require('express');
const router = express.Router();

// Placeholder route
router.get('/test', (req, res) => {
    res.json({ message: 'Cart routes working' });
});

module.exports = router;