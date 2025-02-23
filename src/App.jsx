// src/App.jsx
import React from "react";
import { Analytics } from "@vercel/analytics/react"
import CalendarSalaryCalculator from "./components/CalendarSalaryCalculator";

function App() {
  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "1rem" }}>
        <span className="red-text">Salary</span> Calculator
      </h1>
      <CalendarSalaryCalculator />
      <Analytics />
    </div>
  );
}

export default App;
