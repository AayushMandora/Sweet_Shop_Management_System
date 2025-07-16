const express = require('express');
const router = express.Router();

const { addSweet } = require('../controller/sweetController');

router.post('/add', addSweet);

module.exports = router;