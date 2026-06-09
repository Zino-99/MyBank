import { useState } from "react";

const CATEGORIES = ["Food", "Transport", "Health", "Housing", "Entertainment", "Salary", "Other"];

export default function OperationModal({ onClose }) {
  const [form, setForm] = useState({
    label: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "Food",
  });

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleCreate = () => {
    if (!form.label || !form.amount) return;
    console.log("New operation:", form);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">New operation</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">
          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Label</label>
            <input
              type="text"
              placeholder="Grocery store"
              value={form.label}
              onChange={set("label")}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
            />
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount</label>
              <input
                type="number"
                placeholder="-12.50"
                value={form.amount}
                onChange={set("amount")}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={set("date")}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={set("category")}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition appearance-auto"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2.5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="bg-teal-800 hover:bg-teal-700 active:bg-teal-900 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}