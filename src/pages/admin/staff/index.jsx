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
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";
import ReactPaginate from "react-paginate";

const StaffPage = () => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUser, setFilterUser] = useState({
    selectedRoleName: "",
    selectedStatus: "",
  });
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const itemsPerPage = 5;

  const handlePageChange = ({ selected }) => {
    setPage(selected);
  };

  const filteredStaff = staffData
    .filter(
      (staff) =>
        staff.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((staff) => {
      const matchRole =
        filterUser.selectedRoleName === "" ||
        staff.roleName === filterUser.selectedRoleName;
      const matchStatus =
        filterUser.selectedStatus === "" ||
        staff.status === filterUser.selectedStatus;
      return matchRole && matchStatus;
    });

  const currentPageItems = filteredStaff.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

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

  const onChangeFilter = (e) => {
    const { name, value } = e.target;
    setFilterUser((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(0); // Reset comeback page 1
  };

  // Delete
  const handleDelete = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5268/api/v1/users/delete/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        console.log("Fetch api fail!");
      }

      const data = await response.json();
      console.log("Data: ", data);
      getData();
    } catch (err) {
      console.log("Fetch api:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              List Staff
            </h1>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              Manage staff information easily
            </p>
          </div>
          <button
            onClick={() => navigate(ROUTERS.ADMIN.STAFF_ADD)}
            className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1 transition-all duration-300 font-medium max-w-max"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Add New Staff
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-sm border border-white/20 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="🔍 Search by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(0); // Reset page 1
                }}
                className="w-full pl-12 pr-6 py-3 bg-white/50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-slate-400 shadow-sm hover:shadow-md"
              />
            </div>

            <div className="relative flex-shrink-0 w-full sm:w-48">
              <select
                name="selectedRoleName"
                value={filterUser.selectedRoleName}
                onChange={onChangeFilter}
                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-slate-700 appearance-none shadow-sm hover:shadow-md"
              >
                <option value="">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
                <option value="Customer">Customer</option>
              </select>
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>

            <div className="relative flex-shrink-0 w-full sm:w-48">
              <select
                name="selectedStatus"
                value={filterUser.selectedStatus}
                onChange={onChangeFilter}
                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-none transition-all duration-300 text-slate-700 appearance-none shadow-sm hover:shadow-md"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-sm border border-white/20 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-slate-500">Loading staff list...</p>
              </div>
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <User className="w-20 h-20 text-slate-300 mx-auto mb-6" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">
                No staff found
              </h3>
              <p className="text-slate-500 max-w-sm">
                Please add your first staff member to start managing your team.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10">
                  <tr className="border-b border-slate-200/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Phone Number
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      <span>Status</span>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200/50">
                  {currentPageItems.map((staff, index) => (
                    <tr
                      key={staff.id || index}
                      className="hover:bg-slate-50/50 transition-colors duration-200"
                    >
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

                      <td className="px-6 py-4 w-[220px]">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="text-sm text-slate-900 truncate">
                            {staff.email || "No email"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 w-[160px]">
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="text-sm text-slate-900 truncate">
                            {staff.phone || "No Number"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 w-[120px]">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          {staff.roleName || "Undefine"}
                        </span>
                      </td>

                      <td className="px-6 py-4 w-[120px]">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${
                            staff.status === "ACTIVE"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {staff.status || "Không rõ"}
                        </span>
                      </td>

                      <td className="px-6 py-4 w-[120px]">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              navigate(
                                ROUTERS.ADMIN.STAFF_UPDATE.replace(
                                  ":id",
                                  staff.id
                                )
                              )
                            }
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg hover:scale-105 transition-all duration-200 flex-shrink-0"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(staff.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg hover:scale-105 transition-all duration-200 flex-shrink-0"
                          >
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
                  Showing{" "}
                  <span className="font-semibold">
                    {currentPageItems.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold">{filteredStaff.length}</span>{" "}
                  employees
                </div>
                <ReactPaginate
                  previousLabel={
                    <span className="flex items-center gap-1">
                      <ArrowLeft className="w-4 h-4" /> Previous
                    </span>
                  }
                  nextLabel={
                    <span className="flex items-center gap-1">
                      Next <ArrowRight className="w-4 h-4" />
                    </span>
                  }
                  pageCount={Math.ceil(filteredStaff.length / itemsPerPage)}
                  onPageChange={handlePageChange}
                  containerClassName="flex items-center justify-center gap-2 py-4"
                  pageClassName="flex items-center"
                  pageLinkClassName="flex items-center justify-center w-9 h-9 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700 transition-all duration-300"
                  activeLinkClassName="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 font-semibold"
                  previousClassName="flex items-center"
                  nextClassName="flex items-center"
                  previousLinkClassName="flex items-center px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-500 transition-all duration-300"
                  nextLinkClassName="flex items-center px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-500 transition-all duration-300"
                  disabledClassName="opacity-50 cursor-not-allowed"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
