import { useState } from "react";
import { Pencil, Trash2, RefreshCcw, RotateCcw, Search } from "lucide-react";

export default function TableList({ tables, onEdit, onDelete, onChangeStatus }) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    // console.log("TableList render with tables:", tables);

    const filtered = tables.filter((t) => {
        const matchSearch = t.tableNumber?.toLowerCase().includes(search.toLowerCase());
        const matchFilter =
            filter === "all"
                ? true
                : filter === "deleted"
                    ? t.isDeleted
                    : t.status.toLowerCase() === filter.toLowerCase() && !t.isDeleted;
        return matchSearch && matchFilter;
    });

    const getStatusColor = (status) => {
        if (status === "Available") return "bg-green-100 text-green-700";
        if (status === "Occupied") return "bg-yellow-100 text-yellow-700";
        return "";
    };

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <div className="flex flex-col md:flex-row justify-between mb-4 gap-3">
                <div className="flex items-center gap-2 border rounded-md px-3 py-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by table number..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="outline-none text-sm w-full"
                    />
                </div>

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border rounded-md px-3 py-2 text-sm"
                >
                    <option value="all">All</option>
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="deleted">Deleted</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="p-3 text-left">Table Number</th>
                            <th className="p-3 text-center">Capacity</th>
                            <th className="p-3 text-center">Status</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((t) => (
                            <tr
                                key={t.tableNumber}
                                className={`border-t ${t.isDeleted
                                    ? "bg-red-50 text-red-600"
                                    : "hover:bg-gray-50 transition"
                                    }`}
                            >
                                <td className="p-3 font-medium">{t.tableNumber}</td>
                                <td className="p-3 text-center">{t.capacity}</td>
                                <td className="p-3 text-center">
                                    {t.isDeleted ? (
                                        <span className="text-red-600 font-semibold">Deleted</span>
                                    ) : (
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                t.status
                                            )}`}
                                        >
                                            {t.status}
                                        </span>
                                    )}
                                </td>
                                <td className="p-3 text-center flex justify-center gap-3">
                                    {!t.isDeleted ? (
                                        <>
                                            <button
                                                onClick={() => onEdit(t)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => onChangeStatus(t)}
                                                className="text-indigo-600 hover:text-indigo-800"
                                            >
                                                <RefreshCcw size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(t)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => onDelete(t)}
                                            className="text-green-600 hover:text-green-800"
                                        >
                                            <RotateCcw size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filtered.length === 0 && (
                <p className="text-center text-gray-500 py-6">No tables found.</p>
            )}
        </div>
    );
}
