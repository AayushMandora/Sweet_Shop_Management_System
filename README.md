# Sweet_Shop_Management_System
Assessment Task of Incubyte

---

## ⚙️ Backend Setup (Express + MongoDB)

### 🔧 Environment Variables

In the `/backend` folder, create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

cd backend
npm install
npm start
```
Server will run on http://localhost:5000


⚡ Frontend Setup (React + Vite)
```env
cd front-end
npm install
npm run dev
```
Frontend will be available at http://localhost:5173

🖼️ Frontend Screenshot
- `screenshots/allSweets.png`
- `screenshots/add.png`
- `screenshots/purchase.png`
- `screenshots/restock.png`
- `screenshots/search.png`


✅ Running Backend Tests (Jest)
Comment out the app.listen() line in server.js:

```env 
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

```
cd backend
npm install
npm test
```
🖼️ Jest Test Output Screenshot:

- `screenshots/jest.png`

