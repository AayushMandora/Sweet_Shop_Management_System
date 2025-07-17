const express = require('express');
const router = express.Router();

const { addSweet, deleteSweet, getAllSweets, purchaseSweet, restockSweet } = require('../controller/sweetController');

router.post('/add', addSweet);
router.post('/:id/purchase', purchaseSweet);
router.post('/:id/restock', restockSweet);
router.get('/', getAllSweets);
router.delete('/:id', deleteSweet);

module.exports = router;