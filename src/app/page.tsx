// src/app/page.tsx
"use client"; // this is needed for React hooks

import { useState, useEffect } from "react";
import axios from "axios";

// TypeScript type for an expense
type Expense = {
  id: string;
  title: string;
  amount: number;
};

export default function HomePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | "">("");

  // Fetch all expenses from the backend
  const fetchExpenses = async () => {
    try {
      const response = await axios.get("/api/expenses");
      setExpenses(response.data); // assumes backend returns array of expenses
    } catch (error) {
      console.error("Failed to fetch expenses", error);
    }
  };

  // Add new expense
  const addExpense = async () => {
    if (!title || !amount) return alert("Enter title and amount");

    try {
      const response = await axios.post("/api/expenses", { title, amount });
      setExpenses((prev) => [...prev, response.data]);
      setTitle("");
      setAmount("");
    } catch (error) {
      console.error("Failed to add expense", error);
    }
  };

  // Delete an expense by ID
  const deleteExpense = async (id: string) => {
    try {
      await axios.delete(`/api/expenses/${id}`);
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } catch (error) {
      console.error("Failed to delete expense", error);
    }
  };

  // Fetch expenses on page load
  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "auto" }}>
      <h1>Expense Tracker</h1>

      {/* Form to add a new expense */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Expense Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          style={{ marginRight: "0.5rem" }}
        />
        <button onClick={addExpense}>Add Expense</button>
      </div>

      {/* List all expenses */}
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id} style={{ marginBottom: "0.5rem" }}>
            {expense.title} - ${expense.amount}{" "}
            <button onClick={() => deleteExpense(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}