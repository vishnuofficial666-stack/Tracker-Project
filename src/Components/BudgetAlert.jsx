import { useState } from "react";
import { IoIosSettings } from "react-icons/io";
import { FaSave } from "react-icons/fa";

const EXPENSE_CATEGORIES = [
  "Food",
  "Rent",
  "Transport",
  "Shopping",
  "Medical",
  "Entertainment",
  "Other",
];

export default function BudgetAlert({ transactions }) {
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem("budgets");
    return saved ? JSON.parse(saved) : {};
  });
  const [showSetup, setShowSetup] = useState(false);
  const [tempBudgets, setTempBudgets] = useState(budgets);

  function handleSave() {
    const cleaned = Object.fromEntries(
      Object.entries(tempBudgets).filter(([_, v]) => v !== "" && v > 0),
    );
    setBudgets(cleaned);
    localStorage.setItem("budgets", JSON.stringify(cleaned));
    setShowSetup(false);
  }

  const currentMonth = new Date().toISOString().slice(0, 7);

  const spent = EXPENSE_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          t.category === cat &&
          t.date.slice(0, 7) === currentMonth,
      )
      .reduce((sum, t) => sum + t.amount, 0);
    return acc;
  }, {});

  const alerts = EXPENSE_CATEGORIES.filter(
    (cat) => budgets[cat] && spent[cat] > 0,
  );

  return (
    <div className="mb-6">
      {/* Setup Button */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">Budget Alerts</h2>
        <button
          onClick={() => {
            setTempBudgets(budgets);
            setShowSetup(!showSetup);
          }}
          className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg transition-colors"
        >
          {showSetup ? "Cancel" : "Set Budget ⚙️"}
        </button>
      </div>

      {/* Budget Setup Form */}
      {showSetup && (
        <div className="bg-gray-800 rounded-xl p-5 mb-4">
          <p className="text-gray-400 text-sm mb-4">
            Set Monthly budget limit(₹)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {EXPENSE_CATEGORIES.map((cat) => (
              <div key={cat}>
                <label className="text-gray-400 text-xs mb-1 block">
                  {cat}
                </label>
                <input
                  type="number"
                  value={tempBudgets[cat] || ""}
                  onChange={(e) =>
                    setTempBudgets((prev) => ({
                      ...prev,
                      [cat]: parseFloat(e.target.value) || "",
                    }))
                  }
                  placeholder="₹ limit"
                  className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors flex gap-2 justify-center items-center"
          >
            Save Budgets <FaSave />
          </button>
        </div>
      )}

      {/* Alert Cards */}
      {alerts.length === 0 && !showSetup && (
        <div className="bg-gray-800 rounded-xl p-4 text-center text-gray-400 text-sm flex gap-2 justify-center items-center">
          Click to Set Budget <IoIosSettings />
        </div>
      )}

      {alerts.length > 0 && (
        <div className="flex flex-col gap-3">
          {alerts.map((cat) => {
            const limit = budgets[cat];
            const used = spent[cat];
            const percentage = Math.min((used / limit) * 100, 100);
            const isOver = used > limit;
            const isWarning = percentage >= 80 && !isOver;

            return (
              <div
                key={cat}
                className={`rounded-xl p-4 ${
                  isOver
                    ? "bg-red-900/40 border border-red-500/50"
                    : isWarning
                      ? "bg-yellow-900/40 border border-yellow-500/50"
                      : "bg-gray-800"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{cat}</span>
                  <span
                    className={`text-sm font-bold ${
                      isOver
                        ? "text-red-400"
                        : isWarning
                          ? "text-yellow-400"
                          : "text-green-400"
                    }`}
                  >
                    {isOver
                      ? "🚨 Over Budget!"
                      : isWarning
                        ? "⚠️ Almost!"
                        : "✅ Good"}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isOver
                        ? "bg-red-500"
                        : isWarning
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-400">
                  <span>
                    Spent:{" "}
                    <span className="text-white">₹{used.toLocaleString()}</span>
                  </span>
                  <span>
                    Limit:{" "}
                    <span className="text-white">
                      ₹{limit.toLocaleString()}
                    </span>
                  </span>
                  <span>
                    Left:{" "}
                    <span
                      className={isOver ? "text-red-400" : "text-green-400"}
                    >
                      {isOver
                        ? `-₹${(used - limit).toLocaleString()}`
                        : `₹${(limit - used).toLocaleString()}`}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
