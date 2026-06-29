import { useState, useEffect } from "react";

const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED", "SGD", "CAD", "AUD"];

export default function CurrencyConverter({ transactions }) {
  const [rates, setRates] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = "109adb71304ab731eef22d1a";

  useEffect(() => {
    if (selectedCurrency === "INR") return;
    fetchRates();
  }, [selectedCurrency]);

  async function fetchRates() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/INR`,
      );
      const data = await res.json();
      if (data.result === "success") {
        setRates(data.conversion_rates);
      } else {
        setError("API error — check your key!");
      }
    } catch {
      setError("Network error!");
    }
    setLoading(false);
  }

  function convert(amount) {
    if (selectedCurrency === "INR" || !rates) return amount;
    return (amount * rates[selectedCurrency]).toFixed(2);
  }

  function getCurrencySymbol(currency) {
    const symbols = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
      AED: "د.إ",
      SGD: "S$",
      CAD: "C$",
      AUD: "A$",
    };
    return symbols[currency] || currency;
  }

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;
  const symbol = getCurrencySymbol(selectedCurrency);

  return (
    <div className="bg-gray-800 rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold">Currency Converter 💱</h2>
          <p className="text-gray-400 text-xs mt-0.5">
            INR to any currency convert
          </p>
        </div>
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="bg-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="text-center text-gray-400 py-4">Converting... ⏳</div>
      )}

      {error && (
        <div className="bg-red-900/40 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm mb-3">
          {error}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">Balance</p>
            <p
              className={`text-lg font-bold ${balance >= 0 ? "text-green-400" : "text-red-400"}`}
            >
              {symbol}
              {convert(balance).toLocaleString()}
            </p>
            {selectedCurrency !== "INR" && (
              <p className="text-gray-500 text-xs mt-1">
                ₹{balance.toLocaleString()}
              </p>
            )}
          </div>

          <div className="bg-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">Income</p>
            <p className="text-lg font-bold text-green-400">
              {symbol}
              {convert(income).toLocaleString()}
            </p>
            {selectedCurrency !== "INR" && (
              <p className="text-gray-500 text-xs mt-1">
                ₹{income.toLocaleString()}
              </p>
            )}
          </div>

          <div className="bg-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">Expense</p>
            <p className="text-lg font-bold text-red-400">
              {symbol}
              {convert(expense).toLocaleString()}
            </p>
            {selectedCurrency !== "INR" && (
              <p className="text-gray-500 text-xs mt-1">
                ₹{expense.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      )}

      {selectedCurrency !== "INR" && rates && (
        <p className="text-gray-500 text-xs mt-3 text-center">
          1 INR = {rates[selectedCurrency]} {selectedCurrency}
        </p>
      )}
    </div>
  );
}
