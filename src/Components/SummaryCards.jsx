import React from "react";

function SummaryCards({ transactions }) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 md:mb-6">
      <div className="bg-gray-800 rounded-xl p-4">
        <p className="text-gray-400 text-sm mb-1">Balance</p>
        <p
          className={`text-xl md:text-2xl font-bold ${balance >= 0 ? "text-green-400" : "text-red-400"}`}
        >
          ₹{balance.toLocaleString()}
        </p>
      </div>

      <div className="bg-gray-800 rounded-xl p-4">
        <p className="text-gray-400 text-sm mb-1">Income</p>
        <p className="text-xl md:text-2xl font-bold text-green-400">
          ₹{income.toLocaleString()}
        </p>
      </div>

      <div className="bg-gray-800 rounded-xl p-4">
        <p className="text-gray-400 text-sm mb-1">Expense</p>
        <p className="text-xl md:text-2xl font-bold text-red-400">
          ₹{expense.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default SummaryCards;
