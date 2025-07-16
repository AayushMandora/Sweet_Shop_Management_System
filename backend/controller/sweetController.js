const Sweet = require('../models/sweet');

const addSweet = async (req, res) => {
    try {
        const sweet = new Sweet(req.body);
        await sweet.save();
        res.status(201).json(sweet);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { addSweet };
