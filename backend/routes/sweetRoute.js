const express = require('express');
const router = express.Router();

const { addSweet, deleteSweet, getAllSweets } = require('../controller/sweetController');

router.post('/add', addSweet);
router.get('/', getAllSweets);
router.delete('/:id', deleteSweet);

module.exports = router;