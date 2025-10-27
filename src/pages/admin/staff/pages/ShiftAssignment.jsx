/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react";
import HeaderAssignmentShift from "../components/HeaderAssignmentShift";

const ShiftAssignmentPage = () => {
  const [shifts, setShifts] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [loading, setLoading] = useState(true);
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

  // Get all staff assignment
  const getStaffs = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5268/api/v1/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch staff data");
      }

      const data = await response.json();
      const staffWithAvatar = (data.result || []).map((staff) => ({
        ...staff,
        avatar: staff.fullName ? staff.fullName.charAt(0).toUpperCase() : "U",
        displayName: staff.fullName || staff.email || "Unknown User",
      }));
      setStaffList(staffWithAvatar);
      // console.log("Info Staff: ", staffWithAvatar);
    } catch (err) {
      console.error("Fetch API fail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStaffs();
  }, []);

  // Get assignment
  useEffect(() => {
    getAllAssignment();
  }, []);

  const getAllAssignment = async () => {
    try {
      const response = await fetch(
        `http://localhost:5268/api/v1/shiftAssignment/getAll`,
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

      // console.log("Data", data);
    } catch (err) {
      console.log("Errol", err);
    }
  };

  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const addDaysCustom = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const formatDate = (date, formatType) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    switch (formatType) {
      case "dd":
        return day;
      case "dd/MM":
        return `${day}/${month}`;
      case "dd/MM/yyyy":
        return `${day}/${month}/${year}`;
      case "yyyy-MM-dd HH:mm:ss":
        return `${year}-${month}-${day} 00:00:00`;
      case "MMM yyyy":
        return `${d.toLocaleDateString("en-US", { month: "short" })} ${year}`;
      case "EEE":
        return days[d.getDay()];
      default:
        return day;
    }
  };

  const getYearRange = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  };

  const getMonthNames = () => [
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

  const weekStart = getWeekStart(currentWeek);
  const weekEnd = addDaysCustom(weekStart, 6);
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDaysCustom(weekStart, i)
  );

  const filteredStaff = staffList.filter((staff) =>
    staff.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isShiftRegistered = (staffId, day, shiftId) => {
    const targetDate = new Date(day).toISOString().split("T")[0];
    return registeredShifts.some((s) => {
      const workDate = new Date(s.workDate).toISOString().split("T")[0];
      return (
        s.userId === staffId && s.shiftId === shiftId && workDate === targetDate
      );
    });
  };

  const moveWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + direction * 7);
    setCurrentWeek(newWeek);
    setShowCalendar(false);
  };

  const handleMonthYearSelect = (monthIndex, year) => {
    const firstDayOfMonth = new Date(year, monthIndex, 1);
    const weekStartOfMonth = getWeekStart(firstDayOfMonth);
    setCurrentWeek(weekStartOfMonth);
    setSelectedMonth(monthIndex);
    setSelectedYear(year);
    setShowCalendar(false);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    const firstDayOfYear = new Date(year, selectedMonth, 1);
    const weekStartOfYear = getWeekStart(firstDayOfYear);
    setCurrentWeek(weekStartOfYear);
    setShowCalendar(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 border-4 border-blue-200/60 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <HeaderAssignmentShift
          weekStart={weekStart}
          weekEnd={weekEnd}
          moveWeek={moveWeek}
          setShowCalendar={setShowCalendar}
          showCalendar={showCalendar}
          formatDate={formatDate}
        />

        {/* Calendar Popup */}
        {showCalendar && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
              <div className="p-6 border-b bg-gradient-to-r from-blue-50/60 to-indigo-50/60">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Select Month & Year
                  </h3>
                  <button
                    onClick={() => setShowCalendar(false)}
                    className="p-2 text-slate-400 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 border-b">
                <h4 className="font-semibold text-slate-700 mb-4">
                  Select Year
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {getYearRange().map((year) => (
                    <button
                      key={year}
                      onClick={() => handleYearChange(year)}
                      className={`
                        px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 border-2
                        ${
                          selectedYear === year
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105 border-transparent"
                            : "bg-white/60 text-slate-700 border-slate-200/60 hover:bg-white/80 hover:border-blue-300/60 hover:shadow-sm hover:scale-102"
                        }
                      `}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <h4 className="font-semibold text-slate-700 mb-4">
                  Select Month
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {getMonthNames().map((monthName, index) => (
                    <button
                      key={index}
                      onClick={() => handleMonthYearSelect(index, selectedYear)}
                      className={`
                        px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 border-2
                        ${
                          selectedMonth === index
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105 border-transparent"
                            : "bg-white/60 text-slate-700 border-slate-200/60 hover:bg-white/80 hover:border-green-300/60 hover:shadow-sm hover:scale-102"
                        }
                      `}
                    >
                      {monthName}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-sm border border-white/20 p-6 mb-8">
          <h3 className="font-semibold text-slate-700 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Note shifts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shifts.map((shift) => (
              <div
                key={shift.id}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100/60 rounded-lg border border-slate-200/60"
              >
                <div
                  className={`w-4 h-4 rounded-full bg-gradient-to-r ${shift.color}`}
                />
                <div>
                  <p className="font-medium text-sm text-slate-700">
                    {shift.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{shift.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-sm border border-white/20 p-6 mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="🔍 Search employees by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-white/50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-300 placeholder-slate-400"
            />
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-sm border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10">
                <tr className="border-b border-slate-200/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-[220px]">
                    Employee
                  </th>
                  {weekDays.map((day, index) => (
                    <th
                      key={index}
                      className="px-3 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider min-w-[100px]"
                    >
                      <div className="space-y-1">
                        <p className="font-semibold text-sm">
                          {formatDate(day, "dd")}
                        </p>
                        <p className="text-slate-500 text-[11px] font-medium">
                          {formatDate(day, "EEE")}
                        </p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50">
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 font-medium">
                        No employees found
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        {searchTerm
                          ? "Try adjusting your search terms"
                          : "Loading employees..."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredStaff
                    .filter((staff) => staff.roleName === "Staff")
                    .map((staff) => (
                      <tr
                        key={staff.id}
                        className="hover:bg-slate-50/50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-sm">
                              {staff.avatar}
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="font-medium text-sm text-slate-900 block truncate max-w-[140px]">
                                {staff.displayName}
                              </span>
                              <span className="text-xs text-slate-500 block truncate">
                                {staff.email}
                              </span>
                            </div>
                          </div>
                        </td>
                        {weekDays.map((day, dayIndex) => (
                          <td key={dayIndex} className="px-1 py-4">
                            <div className="space-y-2">
                              {shifts.map((shift) => (
                                <button
                                  key={shift.id}
                                  className={`
            w-full px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-300 border-2
            ${
              isShiftRegistered(staff.id, day, shift.id)
                ? `bg-gradient-to-r ${shift.color} text-white shadow-lg scale-105 border-transparent`
                : "bg-white/60 hover:bg-white/80 text-slate-700 border-slate-200/60 hover:border-slate-300/80 hover:shadow-sm hover:scale-102"
            }
          `}
                                >
                                  {shift.name}
                                </button>
                              ))}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="px-6 py-6 bg-gradient-to-r from-green-50/60 to-blue-50/60 border-t border-slate-200/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-4 p-4 bg-white/70 rounded-lg shadow-sm border border-green-200/60">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Shifts This Week
                  </p>
                  <p className="text-xl font-bold text-slate-900">
                    {
                      registeredShifts.filter((s) => {
                        const workDate = new Date(s.workDate)
                          .toISOString()
                          .split("T")[0];
                        const weekDates = weekDays.map(
                          (d) => new Date(d).toISOString().split("T")[0]
                        );
                        return weekDates.includes(workDate);
                      }).length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftAssignmentPage;
