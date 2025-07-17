import React, { useState } from "react";
import api from "../api/axios";

const AddSweetModal = ({ isOpen, onClose, onAddSuccess }) => {
    const [form, setForm] = useState({ name: "", category: "", price: "", quantity: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await api.post("/add", {
                ...form,
                price: Number(form.price),
                quantity: Number(form.quantity),
            });
            onAddSuccess();
            onClose();
            setForm({ name: "", category: "", price: "", quantity: "" });
        } catch (err) {
            setError(err.response?.data?.error || "Failed to add sweet");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add New Sweet</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="bg-gray-800 border border-gray-700 rounded px-3 py-2" required />
                    <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="bg-gray-800 border border-gray-700 rounded px-3 py-2" required />
                    <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" min="0" className="bg-gray-800 border border-gray-700 rounded px-3 py-2" required />
                    <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" type="number" min="0" className="bg-gray-800 border border-gray-700 rounded px-3 py-2" required />
                    {error && <div className="text-red-400 text-sm">{error}</div>}
                    <div className="flex gap-2 mt-2">
                        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold flex-1">
                            {loading ? "Adding..." : "Add Sweet"}
                        </button>
                        <button type="button" onClick={onClose} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded font-semibold flex-1">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSweetModal; 