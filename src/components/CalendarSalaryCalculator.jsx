// src/components/CalendarSalaryCalculator.jsx
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import LeaveModal from "./LeaveModal";
import "../App.css"; // Import the updated CSS

const CalendarSalaryCalculator = () => {
  // Salary & leave balances
  const [baseSalary, setBaseSalary] = useState(0);
  const [availableEarned, setAvailableEarned] = useState(0);
  const [availableSick, setAvailableSick] = useState(0);

  // Current calendar date
  const [currentDate, setCurrentDate] = useState(new Date());

  // leaveData: map of dateKey => { leaveType, leaveValue }
  const [leaveData, setLeaveData] = useState({});

  // Modal control
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Final computed salary
  const [finalSalary, setFinalSalary] = useState(null);

  // When user clicks a day in the calendar
  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  // Save leave data from the modal
  const handleSaveLeave = (data) => {
    const dateKey = selectedDate.toISOString().split("T")[0];
    setLeaveData((prev) => ({
      ...prev,
      [dateKey]: data,
    }));
    setShowModal(false);
  };

  // Calculate final prorated salary
  const calculateSalary = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    let totalEffective = 0;
    let earnedLeft = availableEarned;
    let sickLeft = availableSick;

    for (let day = 1; day <= totalDays; day++) {
      const dateObj = new Date(year, month, day);
      const dateKey = dateObj.toISOString().split("T")[0];
      const dayLeave = leaveData[dateKey] || { leaveType: "none", leaveValue: 0 };

      let effective = 1; // default = full attendance

      const leaveVal = parseFloat(dayLeave.leaveValue) || 0;
      switch (dayLeave.leaveType) {
        case "earned":
          if (leaveVal <= earnedLeft) {
            earnedLeft -= leaveVal;
            effective = 1;
          } else {
            const unpaid = leaveVal - earnedLeft;
            earnedLeft = 0;
            effective = Math.max(1 - unpaid, 0);
          }
          break;
        case "sick":
          if (leaveVal <= sickLeft) {
            sickLeft -= leaveVal;
            effective = 1;
          } else {
            const unpaid = leaveVal - sickLeft;
            sickLeft = 0;
            effective = Math.max(1 - unpaid, 0);
          }
          break;
        case "lop":
          effective = Math.max(1 - leaveVal, 0);
          break;
        default:
          effective = 1;
          break;
      }
      totalEffective += effective;
    }

    const calculatedSalary = (baseSalary / totalDays) * totalEffective;
    setFinalSalary(calculatedSalary.toFixed(2));
  };

  // Show a small indicator if a leave is set
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dateKey = date.toISOString().split("T")[0];
      const info = leaveData[dateKey];
      if (info && info.leaveType !== "none") {
        if (info.leaveType === "earned") return <div className="tile-leave-indicator">EL</div>;
        if (info.leaveType === "sick") return <div className="tile-leave-indicator">SL</div>;
        if (info.leaveType === "lop") return <div className="tile-leave-indicator">LOP</div>;
      }
    }
    return null;
  };

  return (
    <div className="container">
      {/* LEFT PANEL: Header, Inputs, Button, Final Salary */}
      <div className="left-panel">
        <div className="header">
          <p className="tagline">
            Every Day Counts: Accurately Calculate Your Salary with Leave in Mind.
          </p>
        </div>

        <div className="form-group">
          <label>Base Salary:</label>
          <input
            type="number"
            placeholder="e.g. 50000"
            value={baseSalary}
            onChange={(e) => setBaseSalary(Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label>Available Earned Leave:</label>
          <input
            type="number"
            placeholder="e.g. 5"
            value={availableEarned}
            onChange={(e) => setAvailableEarned(Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label>Available Sick Leave:</label>
          <input
            type="number"
            placeholder="e.g. 3"
            value={availableSick}
            onChange={(e) => setAvailableSick(Number(e.target.value))}
          />
        </div>

        <button onClick={calculateSalary}>Calculate Salary</button>

        {finalSalary !== null && (
          <h3 style={{ marginTop: "1rem" }}>Final Salary: ₹{finalSalary}</h3>
        )}
      </div>

      {/* RIGHT PANEL: Calendar */}
      <div className="right-panel">
        <Calendar
          onClickDay={handleDayClick}
          value={currentDate}
          onActiveStartDateChange={({ activeStartDate }) => setCurrentDate(activeStartDate)}
          tileContent={tileContent}
          showNeighboringMonth={false}
          showFixedNumberOfWeeks={false}
        />
      </div>

      {/* Leave Modal */}
      {showModal && selectedDate && (
        <LeaveModal
          selectedDate={selectedDate}
          initialData={
            leaveData[selectedDate.toISOString().split("T")[0]] || { leaveType: "none", leaveValue: 0 }
          }
          onSave={handleSaveLeave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default CalendarSalaryCalculator;
