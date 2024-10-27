const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');


router.get('/', verifyToken, (req, res) => {
    console.log('verifyToken called');
    res.status(200).json({ message: 'Protected route accessed' });
});


module.exports = router;