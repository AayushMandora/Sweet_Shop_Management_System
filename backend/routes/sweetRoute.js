const express = require('express');
const router = express.Router();

const { addSweet, deleteSweet } = require('../controller/sweetController');

router.post('/add', addSweet);
router.delete('/:id', deleteSweet);

module.exports = router;