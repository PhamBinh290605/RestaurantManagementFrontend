/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, Users } from "lucide-react";
import { useAuth } from "../../../../components/context/authContext";

const AttendAssignment = () => {
  const [shifts, setShifts] = useState([]);
  const [registeredShifts, setRegisteredShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

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

  // Get shift registered today
  const getAllAssignment = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5268/api/v1/shiftAssignment/${user.UserId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        console.log("Fail to fetch api:", response.status, response.statusText);
        setRegisteredShifts([]);
      } else {
        const data = await response.json();
        setRegisteredShifts(data.result || []);
      }
    } catch (err) {
      console.log("Error", err);
      setRegisteredShifts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllAssignment();
  }, []);

  //check-in
  const handleCheckIn = async (shiftAssignmentId) => {
    try {
      const response = await fetch(
        `http://localhost:5268/api/v1/shiftAssignment/check-in/${shiftAssignmentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        getAllAssignment();
      } else {
        console.error("Check-in failed:", response.status, response.statusText);
      }
    } catch (err) {
      console.error("Check-in error:", err);
    }
  };

  //check-out
  const handleCheckOut = async (shiftAssignmentId) => {
    try {
      const response = await fetch(
        `http://localhost:5268/api/v1/shiftAssignment/check-out/${shiftAssignmentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        getAllAssignment();
      } else {
        console.error(
          "Check-out failed:",
          response.status,
          response.statusText
        );
      }
    } catch (err) {
      console.error("Check-out error:", err);
    }
  };

  const isWithinShiftTime = (shiftId) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const shift = shifts.find((s) => s.id === shiftId);
    if (!shift) return false;

    const [startTime, endTime] = shift.time.split(" - ");
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    const currentTotalMinutes = currentHour * 60 + currentMinute;

    return (
      currentTotalMinutes >= startTotalMinutes &&
      currentTotalMinutes <= endTotalMinutes
    );
  };

  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
    today.getMonth() + 1
  ).padStart(2, "0")}/${today.getFullYear()}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 border-4 border-blue-200/60 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading shifts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-sm border border-white/20 p-6 mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            Check-in/Check-out - Today ({formattedDate})
          </h1>
        </div>

        {/* Legend */}
        <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-sm border border-white/20 p-6 mb-8">
          <h3 className="font-semibold text-slate-700 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Available Shifts
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

        {/* Today's Shifts */}
        <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-sm border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10">
                <tr className="border-b border-slate-200/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Shift
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Check-in
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Check-out
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50">
                {registeredShifts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 font-medium">
                        No shifts found for today
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        No shifts scheduled for {formattedDate}
                      </p>
                    </td>
                  </tr>
                ) : (
                  registeredShifts.map((shiftAssignment) => {
                    const shift = shifts.find(
                      (s) => s.id === shiftAssignment.shiftId
                    );
                    return (
                      <tr
                        key={shiftAssignment.id}
                        className="hover:bg-slate-50/50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${shift?.color} text-white text-xs font-medium`}
                          >
                            {shift?.name || "Unknown Shift"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {shift?.time || "-"}
                        </td>
                        <td className="px-6 py-4">
                          {shiftAssignment.actualStartTime ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm">
                                {new Date(
                                  shiftAssignment.actualStartTime
                                ).toLocaleTimeString()}
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleCheckIn(shiftAssignment.id)}
                              disabled={
                                !isWithinShiftTime(shiftAssignment.shiftId)
                              }
                              className={`px-4 py-2 rounded-lg font-medium text-sm text-white transition-all duration-200 border-2 ${
                                isWithinShiftTime(shiftAssignment.shiftId)
                                  ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:scale-105 border-transparent"
                                  : "bg-gray-400 cursor-not-allowed border-gray-400"
                              }`}
                            >
                              Check-in
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {shiftAssignment.actualEndTime ? (
                            <div className="flex items-center gap-2 text-red-600">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm">
                                {new Date(
                                  shiftAssignment.actualEndTime
                                ).toLocaleTimeString()}
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleCheckOut(shiftAssignment.id)}
                              disabled={!shiftAssignment.actualStartTime}
                              className={`px-4 py-2 rounded-lg font-medium text-sm text-white transition-all duration-200 border-2 ${
                                shiftAssignment.actualStartTime
                                  ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:scale-105 border-transparent"
                                  : "bg-gray-400 cursor-not-allowed border-gray-400"
                              }`}
                            >
                              Check-out
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendAssignment;
