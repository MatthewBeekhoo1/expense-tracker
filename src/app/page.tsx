"use client";

import { useState, useEffect } from "react";
import axios from "axios";

type Expense = {
  id: string;
  title: string;
  amount: number;
  category?: string;
};

export default function HomePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // TOTAL CALCULATION
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("/api/expenses");
      setExpenses(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    if (!title || !amount) return alert("Enter title and amount");

    try {
      if (editingId) {
        const res = await axios.patch(`/api/expenses/${editingId}`, {
          title,
          amount,
          category,
        });

        setExpenses((prev) =>
          prev.map((exp) => (exp.id === editingId ? res.data : exp))
        );

        setEditingId(null);
      } else {
        const res = await axios.post("/api/expenses", {
          title,
          amount,
          category,
        });

        setExpenses((prev) => [...prev, res.data]);
      }

      setTitle("");
      setAmount("");
      setCategory("");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await axios.delete(`/api/expenses/${id}`);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (expense: Expense) => {
    setTitle(expense.title);
    setAmount(expense.amount);
    setCategory(expense.category || "");
    setEditingId(expense.id);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "auto" }}>
      <h1>Expense Tracker</h1>

      {/* TOTAL */}
      <h2>Total: ${total.toFixed(2)}</h2>

      {/* FORM */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Expense Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        {/* CATEGORY DROPDOWN */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>

        <button onClick={handleSubmit}>
          {editingId ? "Update" : "Add"}
        </button>

        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setTitle("");
              setAmount("");
              setCategory("");
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {/* LIST */}
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.title} - ${expense.amount} ({expense.category || "No category"})
            <button onClick={() => handleEdit(expense)}>Edit</button>
            <button onClick={() => deleteExpense(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}