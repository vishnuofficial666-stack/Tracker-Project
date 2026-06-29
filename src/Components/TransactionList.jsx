import { useState } from "react";
import { MdEdit } from "react-icons/md";
import { PiEmptyBold } from "react-icons/pi";

const CATEGORY_COLORS = {
  Salary: "bg-green-500",
  Freelance: "bg-teal-500",
  Investment: "bg-blue-500",
  Business: "bg-purple-500",
  Food: "bg-orange-500",
  Rent: "bg-red-500",
  Transport: "bg-yellow-500",
  Shopping: "bg-pink-500",
  Medical: "bg-rose-500",
  Entertainment: "bg-indigo-500",
  Other: "bg-gray-500",
};

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

export default function TransactionList({ transactions, onDelete, onEdit }) {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const categories = ["All", ...new Set(transactions.map((t) => t.category))];
  const months = [
    "All",
    ...new Set(transactions.map((t) => t.date.slice(0, 7))).values(),
  ]
    .sort()
    .reverse();

  const filtered = transactions.filter((t) => {
    const categoryMatch =
      categoryFilter === "All" || t.category === categoryFilter;
    const monthMatch =
      monthFilter === "All" || t.date.slice(0, 7) === monthFilter;
    const typeMatch = typeFilter === "All" || t.type === typeFilter;
    const searchMatch =
      search === "" ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.amount.toString().includes(search);
    return categoryMatch && monthMatch && typeMatch && searchMatch;
  });

  function handleEditClick(t) {
    setEditingId(t.id);
    setEditForm({ ...t });
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "type" && { category: CATEGORIES[value][0] }),
    }));
  }

  function handleEditSave() {
    onEdit({ ...editForm, amount: parseFloat(editForm.amount) });
    setEditingId(null);
  }

  function handleEditCancel() {
    setEditingId(null);
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-8 text-center text-gray-400 mb-6 grid justify-center items-center">
        <p className="text-4xl mb-2 flex justify-center items-center">
          <PiEmptyBold />
        </p>
        <p>No transactions yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-5 mb-6">
      <h2 className="text-lg font-bold mb-4">Transactions</h2>

      {/* Search Bar */}
      <div className="relative mb-3">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
          🔍
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by description, category, amount..."
          className="w-full bg-gray-700 rounded-lg pl-9 pr-4 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <label className="text-gray-400 text-xs mb-1 block">Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label className="text-gray-400 text-xs mb-1 block">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-gray-400 text-xs mb-1 block">Month</label>
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result count */}
      <p className="text-gray-400 text-xs mb-3">
        Showing {filtered.length} of {transactions.length} transactions
        {search && <span className="text-blue-400"> for "{search}"</span>}
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center text-gray-400 py-6">
          <p className="text-2xl mb-2">🔍</p>
          <p>No results found!</p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="mt-2 text-blue-400 text-sm hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((t) => (
            <div key={t.id} className="bg-gray-700 rounded-lg px-4 py-3">
              {editingId === t.id ? (
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleEditChange({
                          target: { name: "type", value: "expense" },
                        })
                      }
                      className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        editForm.type === "expense"
                          ? "bg-red-500 text-white"
                          : "bg-gray-600 text-gray-400"
                      }`}
                    >
                      Expense
                    </button>
                    <button
                      onClick={() =>
                        handleEditChange({
                          target: { name: "type", value: "income" },
                        })
                      }
                      className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        editForm.type === "income"
                          ? "bg-green-500 text-white"
                          : "bg-gray-600 text-gray-400"
                      }`}
                    >
                      Income
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="amount"
                      value={editForm.amount}
                      onChange={handleEditChange}
                      className="bg-gray-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Amount"
                    />
                    <select
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      className="bg-gray-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {CATEGORIES[editForm.type].map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      className="bg-gray-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Description"
                    />
                    <input
                      type="date"
                      name="date"
                      value={editForm.date}
                      onChange={handleEditChange}
                      className="bg-gray-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleEditSave}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                    >
                      Save ✓
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="flex-1 bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                    >
                      Cancel ✕
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-8 rounded-full ${CATEGORY_COLORS[t.category] || "bg-gray-500"}`}
                    />
                    <div>
                      <p className="font-medium text-white">{t.description}</p>
                      <p className="text-xs text-gray-400">
                        {t.category} • {t.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <p
                      className={`font-bold ${t.type === "income" ? "text-green-400" : "text-red-400"}`}
                    >
                      {t.type === "income" ? "+" : "-"}₹
                      {t.amount.toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleEditClick(t)}
                      className="text-gray-500 hover:text-blue-400 transition-colors"
                    >
                      <MdEdit />
                    </button>
                    <button
                      onClick={() => onDelete(t.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors text-lg"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
