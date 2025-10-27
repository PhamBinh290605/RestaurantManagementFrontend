import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ROUTERS } from "../../../../utils/router";

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    Status: "",
    Phone: "",
    RoleId: null,
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const mockRoles = [
      {
        id: 1,
        name: "Admin",
      },
      {
        id: 2,
        name: "Manager",
      },
      {
        id: 3,
        name: "Staff",
      },
      {
        id: 4,
        name: "Customer",
      },
    ];
    setRoles(mockRoles);
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5268/api/v1/users/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        const user = data.result || {};

        // Find roleId by roleName
        const matchedRole = roles.find((r) => r.name === user.roleName);

        setFormData({
          FullName: user.fullName || "",
          Email: user.email || "",
          Phone: user.phone || "",
          Status: user.status || "Undefined",
          RoleId: matchedRole ? matchedRole.id : null,
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, roles]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `http://localhost:5268/api/v1/users/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const data = await response.json();
      console.log("Update success:", data);
      navigate(ROUTERS.ADMIN.STAFF);
    } catch (err) {
      setError(err.message);
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white/80 backdrop-blur-lg p-8 rounded-xl shadow-lg flex flex-col items-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
          Update an Account
        </h2>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg w-full">
            {error}
          </div>
        )}

        {!loading && (
          <form className="w-full space-y-6" onSubmit={handleSubmit}>
            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="FullName"
                required
                value={formData.FullName}
                onChange={handleOnChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 shadow-sm hover:shadow-md"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="Email"
                required
                value={formData.Email}
                onChange={handleOnChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 shadow-sm hover:shadow-md"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="Phone"
                value={formData.Phone}
                onChange={handleOnChange}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 shadow-sm hover:shadow-md"
              />
            </div>

            {/* Status */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-gray-700">
                Status:
              </label>
              <select
                name="Status"
                value={formData.Status}
                onChange={handleOnChange}
                className="border rounded-lg px-3 py-2"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role:
              </label>
              <div className="flex flex-col gap-2">
                {roles.map((r) => (
                  <label key={r.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="RoleId"
                      value={r.id}
                      checked={formData.RoleId === r.id}
                      onChange={() =>
                        setFormData((prev) => ({ ...prev, RoleId: r.id }))
                      }
                    />
                    <span>{r.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Update Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateUser;
