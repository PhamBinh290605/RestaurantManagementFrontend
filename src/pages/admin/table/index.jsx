import { useEffect, useState } from "react";
import TableForm from "./components/TableForm";
import TableList from "./components/TableList";
import ConfirmModal from "./components/ConfirmModal";
import toast, { Toaster } from "react-hot-toast";
import { Plus } from "lucide-react";
import api from "../../../../api";

export default function ManageTables() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [confirmData, setConfirmData] = useState(null);
  const fetchTables = async () => {
    try {
      const response = await api.get("/tables");
      console.log("Fetched tables:", response.data.result);
      setTables(response.data.result);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(response.data.message || "Failed to fetch tables!");
    }
  };
  // 🟡 Fetch data from backend when component mounts
  useEffect(() => {

    fetchTables();
  }, []);

  // 🟡 Add new table (backend: POST /tables)
  const handleAdd = async (table) => {
    try {
      const response = await api.post("/tables", table);
      const created = response.data.result;
      setTables((prev) => [...prev, created]);
      toast.success("Table added successfully!");
      setIsFormOpen(false);
      fetchTables();
    } catch (error) {
      toast.error("Failed to add table!");
    }
  };

  // 🟡 Edit table info (backend: PUT /tables/:id)
  const handleSaveEdit = async (updatedTable) => {
    try {
      console.log("Updating table:", updatedTable);
      await api.put(`/tables/${updatedTable.id}`, updatedTable);

      setTables((prev) =>
        prev.map((t) =>
          t.id === updatedTable.id ? { ...t, ...updatedTable } : t
        )
      );
      toast.success("Table updated successfully!");
      setIsFormOpen(false);
      setSelectedTable(null);
      fetchTables();
    } catch (error) {
      toast.error("Failed to update table!");
    }
  };

  // 🟡 Change table status (backend: PATCH /tables/:id/status)
  const handleStatusChange = (table) => {
    setConfirmData({
      title: "Change Table Status",
      message: `Do you want to change the status of ${table.TableNumber}?`,
      onConfirm: async () => {
        try {
          const nextStatus = table.Status === "Available" ? "Occupied" : "Available";
          await api.put(`/tables/${table.TableNumber}/status`, { status: nextStatus });
          setTables((prev) =>
            prev.map((t) =>
              t.TableNumber === table.TableNumber ? { ...t, Status: nextStatus } : t
            )
          );
          toast.success("Table status updated!");
        } catch (error) {
          toast.error("Failed to change status!");
        }
      },
    });
  };

  // 🟡 Delete or restore (backend: PATCH /tables/:id/delete)
  const handleDelete = (table) => {
    setConfirmData({
      title: table.IsDeleted ? "Restore Table" : "Delete Table",
      message: table.IsDeleted
        ? `Do you want to restore ${table.TableNumber}?`
        : `Are you sure you want to delete ${table.TableNumber}?`,
      onConfirm: async () => {
        try {
          // console.log("TCL: handleDelete -> table", table);
          await api.delete(`/tables/delete/${table.id}`);
          setTables((prev) =>
            prev.map((t) =>
              t.id === table.id
                ? { ...t, IsDeleted: !t.IsDeleted }
                : t
            )
          );
          toast.success(
            table.IsDeleted ? "Table restored successfully!" : "Table deleted!"
          );
        } catch (error) {
          toast.error("Action failed!");
        }
      },
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Table Management
        </h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-all"
        >
          <Plus size={18} /> Add Table
        </button>
      </div>

      <TableList
        tables={tables}
        onEdit={(t) => {
          setSelectedTable(t);
          setIsFormOpen(true);
        }}
        onDelete={handleDelete}
        onChangeStatus={handleStatusChange}
      />

      {isFormOpen && (
        <TableForm
          table={selectedTable}
          onSave={selectedTable ? handleSaveEdit : handleAdd}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedTable(null);
          }}
        />
      )}

      {confirmData && (
        <ConfirmModal
          title={confirmData.title}
          message={confirmData.message}
          onConfirm={() => {
            confirmData.onConfirm();
            setConfirmData(null);
          }}
          onCancel={() => setConfirmData(null)}
        />
      )}
    </div>
  );
}
