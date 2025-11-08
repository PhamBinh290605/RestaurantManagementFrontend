/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  User,
  Save,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../../../components/context/authContext";

const RegisterShiftPage = () => {
  const [shifts, setShifts] = useState([]);
  const [selectedShifts, setSelectedShifts] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const { user } = useAuth();
  const [registeredShifts, setRegisteredShifts] = useState([]);

  // Mock shifts
  useEffect(() => {
    const mockShifts = [
      {
        id: 1,
        name: "Day Shift",
        time: "08:00 - 12:00",
        color: "from-orange-500 to-yellow-500",
      },
      {
        id: 2,
        name: "Afternoon Shift",
        time: "13:00 - 17:00",
        color: "from-blue-500 to-indigo-600",
      },
      {
        id: 3,
        name: "Evening Shift",
        time: "17:00 - 22:00",
        color: "from-purple-500 to-pink-600",
      },
    ];
    setShifts(mockShifts);
  }, []);

  // Get all assignment
  useEffect(() => {
    getAllAssignment();
  }, []);

  const getAllAssignment = async () => {
    try {
      const response = await fetch(
        `http://localhost:5268/api/v1/shiftAssignment/getAll/${user.UserId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        console.log("Fail to fetch api");
      }

      const data = await response.json();
      setRegisteredShifts(data.result);
    } catch (err) {
      console.log("Error", err);
    }
  };

  // CHECK IF DATE IS FUTURE
  const isFutureDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);
    return selected > today;
  };

  // CUSTOM DATE FUNCTIONS
  const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const days = [];

    for (let i = 0; i < daysInMonth; i++) {
      const day = new Date(year, month, i + 1);
      days.push(day);
    }
    return days;
  };

  const getMonthName = (date) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[date.getMonth()];
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // count shift
  const getRegisteredShiftCount = (date) => {
    const formattedDate = formatDate(date);
    return registeredShifts.filter(
      (s) => s.workDate.split("T")[0] === formattedDate
    ).length;
  };

  const monthDays = getMonthDays(currentMonth);

  // TOGGLE SHIFT
  const toggleShift = (shiftId) => {
    if (!selectedDate) {
      setSubmitMessage({
        type: "error",
        message: "Please select a date first!",
      });
      return;
    }

    if (!isFutureDate(selectedDate)) {
      setSubmitMessage({
        type: "error",
        message: "Cannot register shifts for past dates!",
      });
      return;
    }

    const existing = selectedShifts.find(
      (s) => s.shiftId === shiftId && s.date === formatDate(selectedDate)
    );

    if (existing) {
      setSelectedShifts((prev) => prev.filter((s) => s.id !== existing.id));
    } else {
      setSelectedShifts((prev) => [
        ...prev,
        {
          id: Date.now(),
          shiftId,
          date: formatDate(selectedDate),
          name: shifts.find((s) => s.id === shiftId)?.name || "",
          time: shifts.find((s) => s.id === shiftId)?.time || "",
        },
      ]);
    }
  };

  // SUBMIT API
  const handleSubmit = async () => {
    if (selectedShifts.length === 0) {
      setSubmitMessage({
        type: "error",
        message: "Please select at least one shift!",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const bodyData = selectedShifts.map((item) => ({
        ShiftId: item.shiftId,
        DateTime: item.date,
      }));

      const response = await fetch(
        `http://localhost:5268/api/v1/shiftAssignment/create/${user.UserId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(bodyData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to register shifts");
      }

      const result = await response.json();

      setSubmitMessage({
        type: "success",
        message: `Successfully registered ${selectedShifts.length} shift(s)!`,
      });
      setSelectedShifts([]);
      setSelectedDate(null);
      getAllAssignment();
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitMessage({
        type: "error",
        message: "Failed to register shifts. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // MOVE MONTH
  const moveMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);

    const today = new Date();
    const maxMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1);

    if (newMonth > maxMonth) return;
    setCurrentMonth(newMonth);
  };

  // CHECK IF SHIFT SELECTED
  const isShiftSelected = (shiftId) => {
    return selectedShifts.some(
      (s) => s.shiftId === shiftId && s.date === formatDate(selectedDate)
    );
  };

  const isShiftRegistered = (shiftId) => {
    return registeredShifts.some(
      (s) =>
        s.shiftId === shiftId &&
        s.workDate.split("T")[0] === formatDate(selectedDate)
    );
  };

  // handle cancel shift
  const handleCancelShift = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to cancel this shift?")) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `http://localhost:5268/api/v1/shiftAssignment/delete/${user.UserId}/${assignmentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to cancel shift");

      setSubmitMessage({
        type: "success",
        message: "Canceled the case successfully!",
      });

      getAllAssignment();
    } catch (error) {
      setSubmitMessage({
        type: "error",
        message: "Cancellation failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get registered shift for date
  const getRegisteredShiftsForDate = () => {
    if (!selectedDate) return [];
    const formattedDate = formatDate(selectedDate);
    return registeredShifts
      .filter(
        (s) =>
          s.workDate.split("T")[0] === formattedDate && isFutureDate(s.workDate)
      )
      .map((s) => {
        const shift = shifts.find((sh) => sh.id === s.shiftId);
        return {
          ...s,
          name: shift?.name || "Unknown Shift",
          time: shift?.time || "",
          color: shift?.color || "from-gray-400 to-gray-600",
        };
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-white/70 backdrop-blur-lg rounded-xl shadow-sm border border-white/20">
            <User className="w-6 h-6 text-blue-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              My Shift Registration
            </h1>
          </div>
          <p className="text-slate-500 mt-4 text-lg">
            Select your preferred shifts for the month
          </p>
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <div
            className={`mb-8 p-6 rounded-xl shadow-sm border-l-4 flex items-center gap-4 ${
              submitMessage.type === "success"
                ? "bg-green-50/60 border-green-500"
                : "bg-red-50/60 border-red-500"
            }`}
          >
            <div
              className={`w-6 h-6 flex-shrink-0 ${
                submitMessage.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {submitMessage.type === "success" ? (
                <CheckCircle />
              ) : (
                <AlertCircle />
              )}
            </div>
            <p className="text-sm font-medium">{submitMessage.message}</p>
          </div>
        )}

        {/* Month Navigation */}
        <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-sm border border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => moveMonth(-1)}
              className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-all duration-200 hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                Month
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {getMonthName(currentMonth)} {currentMonth.getFullYear()}
              </p>
            </div>

            <button
              onClick={() => moveMonth(1)}
              className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-all duration-200 hover:scale-105"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar + Shifts Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* CALENDAR */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-sm border border-white/20 overflow-hidden">
              <div className="p-6 border-b bg-gradient-to-r from-blue-50/60 to-indigo-50/60">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                  Select Date
                </h3>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-7 gap-2 text-center">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="font-semibold text-sm text-slate-600 py-2 uppercase tracking-wide"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                <div className="grid grid-cols-7 gap-2 mt-4">
                  {monthDays.map((day, index) => {
                    const isToday =
                      day.toDateString() === new Date().toDateString();
                    const isSelected =
                      selectedDate?.toDateString() === day.toDateString();
                    const registeredCount = getRegisteredShiftCount(day);

                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(day)}
                        className={`
                          relative p-3 rounded-lg text-sm font-medium transition-all duration-300 h-20 flex flex-col items-center justify-start
                          ${
                            isSelected
                              ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg scale-105"
                              : isToday
                              ? "bg-yellow-100/60 text-yellow-800 border-2 border-yellow-300/50"
                              : "text-slate-700 hover:bg-slate-100/60 hover:shadow-sm"
                          }
                        `}
                      >
                        <span className="font-semibold text-lg">
                          {day.getDate()}
                        </span>

                        {registeredCount > 0 && (
                          <div
                            className={`
                              absolute top-1 right-1 min-w-5 h-5 flex items-center justify-center
                              text-xs font-bold rounded-full shadow-md z-10
                              ${
                                isSelected
                                  ? "bg-white text-blue-600"
                                  : "bg-emerald-500 text-white"
                              }
                            `}
                          >
                            {registeredCount}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* SHIFT SELECTION */}
          <div>
            <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-sm border border-white/20 top-6">
              <div className="p-6 border-b bg-gradient-to-r from-blue-50/60 to-indigo-50/60">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Available Shifts
                </h3>
                {!selectedDate ? (
                  <p className="text-sm text-slate-500 mt-2">
                    Select a date to choose shifts
                  </p>
                ) : isFutureDate(selectedDate) ? (
                  <p className="text-sm text-slate-500 mt-2">
                    Select your shifts for {formatDate(new Date(selectedDate))}
                  </p>
                ) : (
                  <p className="text-sm text-red-500 font-medium mt-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Cannot register shifts for past dates
                  </p>
                )}
              </div>

              <div className="p-6 space-y-6">
                {/* Available Shifts */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                    Select new shifts
                  </h4>
                  {shifts.map((shift) => {
                    const isRegistered = isShiftRegistered(shift.id);
                    const isSelected = isShiftSelected(shift.id);

                    return (
                      <button
                        key={shift.id}
                        onClick={() => toggleShift(shift.id)}
                        disabled={
                          !selectedDate ||
                          !isFutureDate(selectedDate) ||
                          isRegistered
                        }
                        className={` w-full p-4 rounded-xl font-medium text-sm transition-all duration-300 border-2 shadow-sm relative overflow-hidden
                          ${
                            isRegistered
                              ? `bg-gradient-to-r ${shift.color} text-white opacity-70 cursor-not-allowed`
                              : isSelected
                              ? `bg-gradient-to-r ${shift.color} text-white shadow-lg scale-105 border-transparent`
                              : `bg-white/60 text-slate-700 border-slate-200/60 hover:border-blue-300/60 hover:shadow-md hover:scale-102 ${
                                  !selectedDate || !isFutureDate(selectedDate)
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{shift.name}</div>
                            <div className="text-xs opacity-90 mt-1">
                              {shift.time}
                            </div>
                          </div>
                          {isSelected && <CheckCircle className="w-5 h-5" />}
                          {isRegistered && (
                            <span className="text-xs bg-white/30 px-2 py-1 rounded-full">
                              Registered
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Registered Shifts with Cancel Button */}
                {selectedDate && getRegisteredShiftsForDate().length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-slate-200">
                    <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      Registered ({getRegisteredShiftsForDate().length})
                    </h4>
                    <div className="space-y-2">
                      {getRegisteredShiftsForDate().map((reg) => (
                        <div
                          key={reg.id}
                          className={`group relative p-3 rounded-lg bg-gradient-to-r ${reg.color} text-white shadow-sm transition-all duration-300 hover:shadow-md`}
                        >
                          <div className="flex items-center justify-between pr-10">
                            <div>
                              <div className="font-medium text-sm">
                                {reg.name}
                              </div>
                              <div className="text-xs opacity-90">
                                {reg.time}
                              </div>
                            </div>
                            <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                              {formatDate(selectedDate)}
                            </div>
                          </div>

                          {/* Cancel Button - Hidden until hover or always visible */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelShift(reg.id);
                            }}
                            disabled={isSubmitting}
                            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-lg hover:scale-110"
                            title="Cancel shift"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="p-6 bg-gradient-to-r from-emerald-50/60 to-green-50/60 border-t">
                <button
                  onClick={handleSubmit}
                  disabled={selectedShifts.length === 0 || isSubmitting}
                  className={`
                    w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-sm uppercase tracking-wide transition-all duration-300 shadow-lg
                    ${
                      selectedShifts.length === 0 || isSubmitting
                        ? "bg-slate-200/60 text-slate-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:shadow-xl hover:scale-105 hover:from-emerald-700 hover:to-green-700"
                    }
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Register{" "}
                      {selectedShifts.length > 0 &&
                        `(${selectedShifts.length})`}{" "}
                      Shift{selectedShifts.length !== 1 ? "s" : ""}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Selected Shifts Summary */}
            {selectedShifts.length > 0 && (
              <div className="mt-6 bg-white/70 backdrop-blur-lg rounded-xl shadow-sm border border-white/20 p-6">
                <h4 className="font-semibold text-slate-700 flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Selected Shifts ({selectedShifts.length})
                </h4>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {selectedShifts.map((shift, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50/60 to-white/60 rounded-lg border border-slate-200/60"
                    >
                      <div>
                        <div className="font-medium text-sm">{shift.name}</div>
                        <div className="text-xs text-slate-500">
                          {shift.time}
                        </div>
                      </div>
                      <div className="text-xs font-medium text-green-600 bg-green-100/60 px-2 py-1 rounded-full">
                        {shift.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterShiftPage;
