// src/components/LeaveModal.jsx
import React, { useState, useEffect } from "react";

/**
 * LeaveModal Component
 *
 * Props:
 * - selectedDate: Date object for which the leave is being set.
 * - initialData: An object { leaveType, leaveValue } with existing data (if any).
 * - onSave: Callback when the user saves the changes.
 * - onClose: Callback to close the modal without saving.
 */
const LeaveModal = ({ selectedDate, initialData, onSave, onClose }) => {
  const [leaveType, setLeaveType] = useState(initialData.leaveType || "none");
  const [leaveValue, setLeaveValue] = useState(initialData.leaveValue || "0");

  useEffect(() => {
    setLeaveType(initialData.leaveType || "none");
    setLeaveValue(initialData.leaveValue || "0");
  }, [initialData]);

  const handleSave = () => {
    onSave({
      leaveType,
      leaveValue: parseFloat(leaveValue),
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Set Leave for {selectedDate.toDateString()}</h3>

        <div className="form-group">
          <label>Leave Type:</label>
          <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
            <option value="none">None (Present)</option>
            <option value="earned">Earned Leave</option>
            <option value="sick">Sick Leave</option>
            <option value="lop">Loss of Pay</option>
          </select>
        </div>

        {leaveType !== "none" && (
          <div className="form-group">
            <label>Leave Value:</label>
            <select value={leaveValue} onChange={(e) => setLeaveValue(e.target.value)}>
              <option value="0">0</option>
              <option value="0.5">0.5</option>
              <option value="1">1</option>
            </select>
          </div>
        )}

        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveModal;
