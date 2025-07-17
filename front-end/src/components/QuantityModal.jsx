import React, { useState } from "react";

const QuantityModal = ({ isOpen, onClose, onSubmit, action, sweetName }) => {
    const [quantity, setQuantity] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await onSubmit(Number(quantity), setError, setLoading);
            setQuantity("");
            onClose();
        } catch (err) {
            setError("Failed to submit");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4 capitalize">{action} Sweet: {sweetName}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        placeholder="Quantity"
                        className="bg-gray-800 border border-gray-700 rounded px-3 py-2"
                        required
                    />
                    {error && <div className="text-red-400 text-sm">{error}</div>}
                    <div className="flex gap-2 mt-2">
                        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold flex-1">
                            {loading ? (action === "purchase" ? "Purchasing..." : "Restocking...") : (action === "purchase" ? "Purchase" : "Restock")}
                        </button>
                        <button type="button" onClick={onClose} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded font-semibold flex-1">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuantityModal; 