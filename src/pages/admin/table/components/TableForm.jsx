import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function TableForm({ table, onSave, onClose }) {
  const [form, setForm] = useState({
    TableNumber: "",
    Capacity: "",
  });

  useEffect(() => {
    if (table) setForm(table);
  }, [table]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.TableNumber || !form.Capacity) return;
    onSave(form);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
    >
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {table ? "Edit Table" : "Add New Table"}
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Table Number</label>
            <input
              name="TableNumber"
              value={form.TableNumber}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-indigo-200"
              placeholder="E.g. T05"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Capacity</label>
            <input
              type="number"
              name="Capacity"
              value={form.Capacity}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-indigo-200"
              placeholder="Enter number of seats"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {table ? "Save Changes" : "Add Table"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
