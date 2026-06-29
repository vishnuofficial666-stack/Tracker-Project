import { useState } from "react";

const CATEGORIES = {
  income: ["Salary", "Freelance", "Investment", "Business", "Other"],
  expense: [
    "Food",
    "Rent",
    "Transport",
    "Shopping",
    "Medical",
    "Entertainment",
    "Other",
  ],
};

export default function TransactionForm({ onAdd }) {
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "Food",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "type" && { category: CATEGORIES[value][0] }),
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.amount || !form.description) return;
    onAdd({
      ...form,
      id: Date.now(),
      amount: parseFloat(form.amount),
    });
    setForm((prev) => ({
      ...prev,
      amount: "",
      description: "",
    }));
  }

  return (
    <div className="bg-gray-800 rounded-xl p-5 mb-6">
      <h2 className="text-lg font-bold mb-4">Add Transaction</h2>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() =>
            setForm((prev) => ({ ...prev, type: "expense", category: "Food" }))
          }
          className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
            form.type === "expense"
              ? "bg-red-500 text-white"
              : "bg-gray-700 text-gray-400"
          }`}
        >
          Expense
        </button>
        <button
          onClick={() =>
            setForm((prev) => ({ ...prev, type: "income", category: "Salary" }))
          }
          className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
            form.type === "income"
              ? "bg-green-500 text-white"
              : "bg-gray-700 text-gray-400"
          }`}
        >
          Income
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="0"
            className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-1 block">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES[form.type].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-gray-400 text-sm mb-1 block">
            Description
          </label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder={
              form.type === "income"
                ? "What income made?"
                : "what expenses made?"
            }
            className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-1 block">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors"
      >
        Add Transaction
      </button>
    </div>
  );
}
