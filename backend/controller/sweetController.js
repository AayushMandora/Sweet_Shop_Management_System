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

const getAllSweets = async (req, res) => {
    try {
        const sweets = await Sweet.find({});
        res.status(200).json(sweets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteSweet = async (req, res) => {
    try {
        const { id } = req.params;

        const sweet = await Sweet.findByIdAndDelete(id);

        if (!sweet) {
            return res.status(404).json({ error: 'Sweet not found' });
        }

        res.status(200).json({ message: 'Sweet deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = { addSweet, deleteSweet, getAllSweets };
