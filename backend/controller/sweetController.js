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
        const { name, category, minPrice, maxPrice } = req.query;

        const filter = {};

        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }

        if (category) {
            filter.category = category;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const sweets = await Sweet.find(filter);
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

const purchaseSweet = async (req, res) => {
    try {
        const { quantity } = req.body;

        const sweet = await Sweet.findById(req.params.id);
        if (!sweet) return res.status(404).json({ error: 'Sweet not found' });

        if (sweet.quantity < quantity) {
            return res.status(400).json({ error: 'Insufficient stock available' });
        }

        sweet.quantity -= quantity;
        await sweet.save();

        res.status(200).json({ message: 'Purchase successful', sweet });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const restockSweet = async (req, res) => {
    try {
        const { quantity } = req.body;

        const sweet = await Sweet.findById(req.params.id);
        if (!sweet) return res.status(404).json({ error: 'Sweet not found' });

        sweet.quantity += quantity;
        await sweet.save();

        res.status(200).json({ message: 'Restocked successfully', sweet });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { addSweet, deleteSweet, getAllSweets, purchaseSweet, restockSweet };
