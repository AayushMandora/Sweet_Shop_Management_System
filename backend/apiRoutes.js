const express = require('express');
const router = express.Router();
const sweetRoutes = require('./routes/sweetRoute');

router.use('/sweets', sweetRoutes);

module.exports = router;