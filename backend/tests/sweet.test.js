// tests/sweet.test.js

const request = require('supertest');
const Sweet = require('../models/sweet');
const app = require('../server');

// For Clean up purpose DB should not be full
afterEach(async () => {
    await Sweet.deleteMany();
});

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

describe('Sweet API', () => {
    // Add Sweet Test
    describe('POST /api/sweets', () => {
        addTests.forEach(sweet => {
            it(`should add new sweet: ${sweet.name}`, async () => {
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
    });

    // Get All Sweet Test
    describe('GET /api/sweets', () => {
        beforeEach(async () => {
            await Sweet.insertMany([...addTests]);
        });

        afterEach(async () => {
            await Sweet.deleteMany();
        });

        it('should return all sweets in the database', async () => {
            const res = await request(app).get('/api/sweets');

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(addTests.length);

            const names = res.body.map(sweet => sweet.name);
            for (const sweet of addTests) {
                expect(names).toContain(sweet.name);
            }
        });
    });

    // Get sweet by search & price range sort (Price Filter)
    describe('GET /api/sweets with query params (Filter)', () => {
        beforeEach(async () => {
            await Sweet.insertMany([...addTests]);
        });

        afterEach(async () => {
            await Sweet.deleteMany();
        });

        it('should return sweets matching name query', async () => {
            const res = await request(app).get('/api/sweets?name=jamun');
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].name).toMatch(/jamun/i);
        });

        it('should return sweets in price range', async () => {
            const res = await request(app).get('/api/sweets?minPrice=25&maxPrice=60');
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(2); // Kaju Katli and Gajar Halwa 
        });
    });

    // Delete Sweet By ID
    describe('DELETE /api/sweets/:id', () => {
        let sweetId;

        beforeEach(async () => {
            const sweet = new Sweet({
                name: 'Test Sweet',
                category: 'Test Category',
                price: 10,
                quantity: 5
            });
            await sweet.save();
            sweetId = sweet._id;
        });

        afterEach(async () => {
            await Sweet.deleteMany();
        });

        it('should delete an existing sweet', async () => {
            const res = await request(app)
                .delete(`/api/sweets/${sweetId}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Sweet deleted successfully');

            // Optional: verify it's actually gone
            const deleted = await Sweet.findById(sweetId);
            expect(deleted).toBeNull();
        });

        it('should return 404 if sweet does not exist', async () => {
            const fakeId = '000000000000000000000000'; // valid ObjectId format but non-existent
            const res = await request(app)
                .delete(`/api/sweets/${fakeId}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.error).toBe('Sweet not found');
        });
    })

    // Purchase Sweet (Decrease Quantity)
    describe('POST /api/sweets/:id/purchase', () => {
        let sweet;

        beforeEach(async () => {
            sweet = await Sweet.create({
                name: 'Test Sweet',
                category: 'Milk-Based',
                price: 15,
                quantity: 10
            });
        });

        afterEach(async () => {
            await Sweet.deleteMany();
        });

        it('should purchase a sweet if stock is available', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweet._id}/purchase`)
                .send({ quantity: 3 });

            expect(res.statusCode).toBe(200);
            expect(res.body.sweet.quantity).toBe(7);
        });

        it('should return error if stock is insufficient', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweet._id}/purchase`)
                .send({ quantity: 20 });

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Insufficient stock available');
        });
    });

    // Restock Sweet (Increase Quantity)
    describe('POST /api/sweets/:id/restock', () => {
        let sweet;

        beforeEach(async () => {
            sweet = await Sweet.create({
                name: 'Test Sweet',
                category: 'Milk-Based',
                price: 15,
                quantity: 5
            });
        });

        afterEach(async () => {
            await Sweet.deleteMany();
        });

        it('should restock a sweet by increasing quantity', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweet._id}/restock`)
                .send({ quantity: 10 });

            expect(res.statusCode).toBe(200);
            expect(res.body.sweet.quantity).toBe(15);
        });
    });
});
