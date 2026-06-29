import { useState, useEffect } from "react";
import SummaryCards from "./components/SummaryCards";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import Chart from "./components/Chart";
import BudgetAlert from "./Components/BudgetAlert"
import RecurringTransactions from "./Components/RecurringTransaction";
import CurrencyConverter from "./Components/CurrencyConverter";
import ConfirmModal from "./components/ConfirmModal";
import { FaFileDownload } from "react-icons/fa";

export default function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            type: "income",
            amount: 50000,
            category: "Salary",
            description: "Monthly salary",
            date: "2026-06-01",
          },
          {
            id: 2,
            type: "expense",
            amount: 1200,
            category: "Food",
            description: "Groceries",
            date: "2026-06-02",
          },
        ];
  });

  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  function handleAdd(transaction) {
    setTransactions((prev) => [transaction, ...prev]);
  }

  function handleDelete(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  function handleEdit(updated) {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t)),
    );
  }

  function doExportCSV() {
    const headers = ["Date", "Type", "Category", "Description", "Amount"]
    const rows = transactions.map((t) => [
      t.date, t.type, t.category, t.description, t.amount,
    ])
    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `finance-tracker-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setShowConfirm(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-3 md:p-6">

      {/* Confirm Modal */}
      {showConfirm && (
        <ConfirmModal
          message={`${transactions.length} transactions export?`}
          onConfirm={doExportCSV}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold">FINANCE TRACKER</h1>
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex gap-3 justify-center items-center"
        >
          Export CSV <FaFileDownload />
        </button>
      </div>

      <SummaryCards transactions={transactions} />
      <CurrencyConverter transactions={transactions} />
      <BudgetAlert transactions={transactions} />
      <RecurringTransactions onAdd={handleAdd} />
      <Chart transactions={transactions} />
      <TransactionForm onAdd={handleAdd} />
      <TransactionList
        transactions={transactions}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
}
