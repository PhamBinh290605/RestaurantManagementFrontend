import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import toast from "react-hot-toast";

const SelectTableModal = ({ booking, onClose }) => {
  const [selectedTables, setSelectedTables] = useState([booking.table]);

  const tables = ["Bàn 1", "Bàn 2", "Bàn 3", "Bàn 4", "Bàn 5", "Bàn 6", "Bàn 7"];

  const toggleTable = (table) => {
    if (selectedTables.includes(table)) {
      setSelectedTables(selectedTables.filter((t) => t !== table));
    } else {
      setSelectedTables([...selectedTables, table]);
    }
  };

  const handleConfirm = () => {
    toast.success(`Đã chọn ${selectedTables.join(", ")}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-xl shadow-lg w-96"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Chọn bàn cho {booking.name}</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {tables.map((t) => (
            <button
              key={t}
              onClick={() => toggleTable(t)}
              className={`p-3 rounded-lg border text-sm font-medium transition ${
                selectedTables.includes(t)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" /> Xác nhận bàn
        </button>
      </motion.div>
    </div>
  );
};

export default SelectTableModal;
