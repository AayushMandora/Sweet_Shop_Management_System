import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api/sweets", // Adjust port if needed
    headers: {
        "Content-Type": "application/json",
    },
});

export default api; 