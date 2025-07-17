import React, { useEffect, useState } from "react";
import api from "../api/axios";
import AddSweetModal from "./AddSweetModal";
import QuantityModal from "./QuantityModal";

const Sweets = () => {
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({ name: "", category: "", minPrice: "", maxPrice: "" });

    // Modal states would go here
    const [showAddModal, setShowAddModal] = useState(false);
    const [quantityModal, setQuantityModal] = useState({ isOpen: false, action: "", sweet: null });
    const [actionLoading, setActionLoading] = useState("");

    const fetchSweets = async () => {
        setLoading(true);
        setError("");
        try {
            const params = {};
            if (filters.name) params.name = filters.name;
            if (filters.category) params.category = filters.category;
            if (filters.minPrice) params.minPrice = filters.minPrice;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;
            const res = await api.get("/", { params });
            setSweets(res.data);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to fetch sweets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSweets();
    }, []);

    const handleInputChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleFilter = (e) => {
        e.preventDefault();
        fetchSweets();
    };

    const handleAddSweet = () => setShowAddModal(true);
    const handleAddSuccess = () => fetchSweets();

    const handlePurchase = (sweet) => setQuantityModal({ isOpen: true, action: "purchase", sweet });
    const handleRestock = (sweet) => setQuantityModal({ isOpen: true, action: "restock", sweet });
    const handleDelete = async (id) => {
        setActionLoading(id + "-delete");
        try {
            await api.delete(`/${id}`);
            fetchSweets();
        } catch (err) {
            alert(err.response?.data?.error || "Failed to delete");
        } finally {
            setActionLoading("");
        }
    };

    const handleQuantitySubmit = async (quantity, setModalError, setModalLoading) => {
        setModalLoading(true);
        try {
            if (quantityModal.action === "purchase") {
                await api.post(`/${quantityModal.sweet._id}/purchase`, { quantity });
            } else {
                await api.post(`/${quantityModal.sweet._id}/restock`, { quantity });
            }
            fetchSweets();
        } catch (err) {
            setModalError(err.response?.data?.error || "Failed to update");
        } finally {
            setModalLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Sweet Shop Management</h1>
            <form onSubmit={handleFilter} className="flex flex-wrap gap-4 mb-6 justify-center">
                <input name="name" value={filters.name} onChange={handleInputChange} placeholder="Name" className="bg-gray-800 border border-gray-700 rounded px-3 py-2" />
                <input name="category" value={filters.category} onChange={handleInputChange} placeholder="Category" className="bg-gray-800 border border-gray-700 rounded px-3 py-2" />
                <input name="minPrice" value={filters.minPrice} onChange={handleInputChange} placeholder="Min Price" type="number" className="bg-gray-800 border border-gray-700 rounded px-3 py-2" />
                <input name="maxPrice" value={filters.maxPrice} onChange={handleInputChange} placeholder="Max Price" type="number" className="bg-gray-800 border border-gray-700 rounded px-3 py-2" />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold">Filter</button>
                <button type="button" onClick={handleAddSweet} className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded font-semibold">+ Add Sweet</button>
            </form>
            {/* Add Sweet Modal */}
            <AddSweetModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAddSuccess={handleAddSuccess} />
            {/* Quantity Modal for purchase/restock */}
            <QuantityModal
                isOpen={quantityModal.isOpen}
                onClose={() => setQuantityModal({ isOpen: false, action: "", sweet: null })}
                onSubmit={handleQuantitySubmit}
                action={quantityModal.action}
                sweetName={quantityModal.sweet?.name || ""}
            />
            {loading ? (
                <div className="text-center">Loading...</div>
            ) : error ? (
                <div className="text-center text-red-400">{error}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 rounded shadow">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Category</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Price</th>
                                <th className="px-4 py-2">Quantity</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sweets.map((sweet) => (
                                <tr key={sweet._id} className="border-t border-gray-700">
                                    <td className="px-4 py-2 text-center">{sweet.category}</td>
                                    <td className="px-4 py-2 text-center">{sweet.name}</td>
                                    <td className="px-4 py-2 text-center">₹{sweet.price}</td>
                                    <td className="px-4 py-2 text-center">{sweet.quantity}</td>
                                    <td className="px-4 py-2 flex justify-center gap-2">
                                        <button
                                            className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-sm"
                                            onClick={() => handlePurchase(sweet)}
                                        >
                                            Purchase
                                        </button>
                                        <button
                                            className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-sm"
                                            onClick={() => handleRestock(sweet)}
                                        >
                                            Restock
                                        </button>
                                        <button
                                            className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-sm disabled:opacity-50"
                                            onClick={() => handleDelete(sweet._id)}
                                            disabled={actionLoading === sweet._id + "-delete"}
                                        >
                                            {actionLoading === sweet._id + "-delete" ? "Deleting..." : "Delete"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Sweets; 