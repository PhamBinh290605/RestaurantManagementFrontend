import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const HeaderAssignmentShift = (props) => {
  const {
    weekStart,
    weekEnd,
    moveWeek,
    setShowCalendar,
    showCalendar,
    formatDate,
  } = props;
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Work Shift Schedule
          </h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Register work shifts for employees
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => moveWeek(-1)}
            className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-all duration-200 hover:scale-105 shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="group flex items-center gap-3 px-6 py-3 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-medium min-w-[220px]"
          >
            <CalendarDays className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            <div className="text-left flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-500 truncate">
                Week
              </p>
              <p className="font-semibold text-slate-900 truncate">
                {formatDate(weekStart, "dd/MM")} -{" "}
                {formatDate(weekEnd, "dd/MM")}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>

          <button
            onClick={() => moveWeek(1)}
            className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-all duration-200 hover:scale-105 shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
};

export default HeaderAssignmentShift;
