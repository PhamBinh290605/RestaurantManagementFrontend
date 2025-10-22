import { useEffect, useState } from "react";
import {
  Search,
  Loader2,
  User,
  Mail,
  Phone,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";

const StaffPage = () => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
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
      setStaffData(data.result || []);
    } catch (err) {
      console.error("Fetch api fail:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staffData.filter(
    (staff) =>
      staff.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Danh Sách Nhân Viên
            </h1>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              Quản lý thông tin nhân viên một cách dễ dàng
            </p>
          </div>
          <button
            onClick={() => navigate(ROUTERS.ADMIN.STAFF_ADD)}
            className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1 transition-all duration-300 font-medium max-w-max"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Thêm Nhân Viên
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-sm border border-white/20 p-6 mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-white/50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-sm border border-white/20 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-slate-500">
                  Đang tải danh sách nhân viên...
                </p>
              </div>
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <User className="w-20 h-20 text-slate-300 mx-auto mb-6" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">
                Chưa có nhân viên nào
              </h3>
              <p className="text-slate-500 max-w-sm">
                Hãy thêm nhân viên đầu tiên để bắt đầu quản lý đội ngũ của bạn
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10">
                  <tr className="border-b border-slate-200/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Thông Tin
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Số Điện Thoại
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Vai Trò
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Trạng Thái
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Thao Tác
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200/50">
                  {filteredStaff.map((staff, index) => (
                    <tr
                      key={staff.id || index}
                      className="hover:bg-slate-50/50 transition-colors duration-200"
                    >
                      {/* Cột thông tin - Fixed width */}
                      <td className="px-6 py-4 w-[280px]">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                            {staff.fullName?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm text-slate-900 truncate">
                              {staff.fullName || "N/A"}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              ID: {staff.id || index + 1}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email - Fixed width */}
                      <td className="px-6 py-4 w-[220px]">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="text-sm text-slate-900 truncate">
                            {staff.email || "Chưa có email"}
                          </span>
                        </div>
                      </td>

                      {/* Số điện thoại - Fixed width */}
                      <td className="px-6 py-4 w-[160px]">
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="text-sm text-slate-900 truncate">
                            {staff.phone || "Chưa có số"}
                          </span>
                        </div>
                      </td>

                      {/* Vai trò - Fixed width */}
                      <td className="px-6 py-4 w-[120px]">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          {staff.role || "Nhân viên"}
                        </span>
                      </td>

                      {/* Trạng thái - Fixed width */}
                      <td className="px-6 py-4 w-[120px]">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${
                            staff.status === "Active"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {staff.status || "Không rõ"}
                        </span>
                      </td>

                      {/* Thao tác - Fixed width */}
                      <td className="px-6 py-4 w-[120px]">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg hover:scale-105 transition-all duration-200 flex-shrink-0">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg hover:scale-105 transition-all duration-200 flex-shrink-0">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination & Stats */}
          {!loading && filteredStaff.length > 0 && (
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 border-t border-slate-200/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-slate-600">
                  Hiển thị{" "}
                  <span className="font-semibold">{filteredStaff.length}</span>{" "}
                  nhân viên
                </div>
                <div className="flex items-center justify-center sm:justify-end gap-2">
                  <button className="px-4 py-2 text-sm text-slate-600 bg-white rounded-lg hover:bg-slate-100 transition-colors font-medium">
                    Trước
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold text-slate-900 bg-white rounded-lg shadow-sm">
                    1
                  </span>
                  <button className="px-4 py-2 text-sm text-slate-600 bg-white rounded-lg hover:bg-slate-100 transition-colors font-medium">
                    Sau
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
