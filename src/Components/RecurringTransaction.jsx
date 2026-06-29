import { useState, useEffect } from "react";
import { GrTransaction } from "react-icons/gr";
import { FaSave } from "react-icons/fa";

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

export default function RecurringTransactions({ onAdd }) {
  const [recurring, setRecurring] = useState(() => {
    const saved = localStorage.getItem("recurring");
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "Rent",
    description: "",
    dayOfMonth: 1,
  });

  useEffect(() => {
    localStorage.setItem("recurring", JSON.stringify(recurring));
  }, [recurring]);

  // Auto add பண்ணு — app open ஆகும்போது check பண்ணும்
  useEffect(() => {
    const today = new Date();
    const currentMonth = today.toISOString().slice(0, 7);
    const lastRun = localStorage.getItem("lastRecurringRun");

    if (lastRun === currentMonth) return;

    recurring.forEach((r) => {
      const shouldAddToday = today.getDate() >= r.dayOfMonth;
      if (shouldAddToday) {
        onAdd({
          id: Date.now() + Math.random(),
          type: r.type,
          amount: parseFloat(r.amount),
          category: r.category,
          description: `🔄 ${r.description} (Auto)`,
          date: `${currentMonth}-${String(r.dayOfMonth).padStart(2, "0")}`,
        });
      }
    });

    if (recurring.length > 0) {
      localStorage.setItem("lastRecurringRun", currentMonth);
    }
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "type" && { category: CATEGORIES[value][0] }),
    }));
  }

  function handleAdd() {
    if (!form.amount || !form.description) return;
    const newRecurring = [...recurring, { ...form, id: Date.now() }];
    setRecurring(newRecurring);
    setForm({
      type: "expense",
      amount: "",
      category: "Rent",
      description: "",
      dayOfMonth: 1,
    });
    setShowForm(false);
  }

  function handleDelete(id) {
    setRecurring((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="bg-gray-800 rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold flex gap-2 justify-center items-center">
            Recurring Transactions <GrTransaction />
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">Monthly auto added</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          {showForm ? "Cancel" : "+ Add"}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-gray-700 rounded-xl p-4 mb-4">
          <div className="flex gap-2 mb-3">
            <button
              onClick={() =>
                handleChange({ target: { name: "type", value: "expense" } })
              }
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                form.type === "expense"
                  ? "bg-red-500 text-white"
                  : "bg-gray-600 text-gray-400"
              }`}
            >
              Expense
            </button>
            <button
              onClick={() =>
                handleChange({ target: { name: "type", value: "income" } })
              }
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                form.type === "income"
                  ? "bg-green-500 text-white"
                  : "bg-gray-600 text-gray-400"
              }`}
            >
              Income
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">
                Amount (₹)
              </label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0"
                className="w-full bg-gray-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-gray-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES[form.type].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g. Monthly Rent"
                className="w-full bg-gray-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">
                Day of Month
              </label>
              <input
                type="number"
                name="dayOfMonth"
                value={form.dayOfMonth}
                onChange={handleChange}
                min="1"
                max="28"
                className="w-full bg-gray-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors flex gap-2 justify-center items-center "
          >
            Save Recurring import <FaSave />
          </button>
        </div>
      )}

      {/* Recurring List */}
      {recurring.length === 0 ? (
        <div className="text-center text-gray-400 text-sm py-4">
          No recurring transactions yet!
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {recurring.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between bg-gray-700 rounded-lg px-4 py-3"
            >
              <div>
                <p className="font-medium text-white text-sm">
                  {r.description}
                </p>
                <p className="text-xs text-gray-400">
                  {r.category} • Every month {r.dayOfMonth}th
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p
                  className={`font-bold text-sm ${r.type === "income" ? "text-green-400" : "text-red-400"}`}
                >
                  {r.type === "income" ? "+" : "-"}₹
                  {parseFloat(r.amount).toLocaleString()}
                </p>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
