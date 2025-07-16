// tests/sweet.test.js

const request = require('supertest');
const app = require('../server');

const addTests = [
    {
        name: 'Kaju Katli',
        category: 'Nut-Based',
        price: 50,
        quantity: 20
    },
    {
        name: 'Gajar Halwa',
        category: 'Vegetable-Based',
        price: 30,
        quantity: 15
    },
    {
        name: 'Gulab Jamun',
        category: 'Milk-Based',
        price: 10,
        quantity: 50
    }
]

describe('POST /api/sweets', () => {
    addTests.forEach(sweet => {
        it('should add a new sweet', async () => {
            const res = await request(app)
                .post('/api/sweets/add') // <-- changed path here
                .send({
                    name: sweet.name,
                    category: sweet.category,
                    price: sweet.price,
                    quantity: sweet.quantity
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.name).toBe(sweet.name);
            expect(res.body.category).toBe(sweet.category);
        });
    });

    // it('should add a new sweet', async () => {
    //     const res = await request(app)
    //         .post('/api/sweets/add') // <-- changed path here
    //         .send({
    //             name: 'Kaju Katli',
    //             category: 'Nut-Based',
    //             price: 50,
    //             quantity: 20
    //         });

    //     console.log("===>", res);

    //     expect(res.statusCode).toBe(201);
    //     expect(res.body.name).toBe('Kaju Katli');
    //     expect(res.body.category).toBe('Nut-Based');
    // });
});
