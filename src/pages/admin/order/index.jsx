// src/pages/OrderPage .js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UtensilsCrossed, Zap, CalendarClock } from 'lucide-react';
import TableIcon from './components/TableIcon';

// --- MOCK DATA & API SIMULATION ---
const mockTables = [
  { id: 1, name: 'Bàn 1', status: 'available' },
  { id: 2, name: 'Bàn 2', status: 'occupied' },
  { id: 3, name: 'Bàn 3', status: 'reserved' },
  { id: 4, name: 'Bàn 4', status: 'available' },
  { id: 5, name: 'Bàn 5', status: 'available' },
  { id: 6, name: 'Bàn 6', status: 'occupied' },
  { id: 7, name: 'Bàn 7', status: 'available' },
  { id: 8, name: 'Bàn 8', status: 'reserved' },
];

const API_URL = '/api/tables'; // URL API giả

const OrderPage  = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const navigate = useNavigate();

  // --- API LOGIC (bên trong component) ---
  const fetchTables = async () => {
    console.log("Fetching tables...");
    setLoading(true);
    try {
      // Trong thực tế: const response = await axios.get(API_URL);
      // Giả lập API call:
      await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập độ trễ mạng
      setTables(mockTables);
    } catch (error) {
      console.error("Lỗi khi tải danh sách bàn:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleSelectTable = (table) => {
    if (table.status === 'available') {
      setSelectedTable(table.id === selectedTable?.id ? null : table);
    }
  };

  const handleCreateOrder = () => {
    if (selectedTable) {
      // Chuyển hướng đến trang gọi món với ID của bàn
      navigate(`/admin/order/${selectedTable.id}`);
    }
  };

  const getTableCardClasses = (table) => {
    const baseClasses = 'relative p-4 rounded-lg shadow-lg flex flex-col items-center justify-center transition-all duration-300 aspect-square';
    const statusClasses = {
      available: 'bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 hover:-translate-y-1',
      occupied: 'bg-green-100 text-green-800 cursor-not-allowed opacity-70',
      reserved: 'bg-purple-100 text-purple-800 cursor-not-allowed opacity-70',
    };
    
    let finalClasses = `${baseClasses} ${statusClasses[table.status]}`;
    
    if (selectedTable?.id === table.id) {
        finalClasses += ' ring-4 ring-offset-2 ring-yellow-400';
    }

    return finalClasses;
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-100 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Sơ đồ bàn</h1>
        <p className="text-gray-600 mt-2">Chọn một bàn còn trống để tạo đơn hàng mới.</p>
      </div>

      <div className="flex justify-center items-center gap-6 mb-8 text-sm font-medium">
          <div className="flex items-center gap-2"><Zap className="text-blue-500 h-5 w-5" /><span>Khả dụng</span></div>
          <div className="flex items-center gap-2"><UtensilsCrossed className="text-green-500 h-5 w-5" /><span>Đang phục vụ</span></div>
          <div className="flex items-center gap-2"><CalendarClock className="text-purple-500 h-5 w-5" /><span>Đã đặt trước</span></div>
      </div>

      {loading ? (
        <div className="text-center">Đang tải sơ đồ bàn...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {tables.map((table) => (
            <div key={table.id} onClick={() => handleSelectTable(table)} className={getTableCardClasses(table)}>
              <TableIcon className="w-16 h-16 sm:w-20 sm:h-20 mb-2" />
              <span className="font-bold text-lg">{table.name}</span>
            </div>
          ))}
        </div>
      )}
      
      {selectedTable && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] flex justify-center items-center">
            <div className="text-center">
                <p className="text-lg font-medium text-gray-700">
                    Đã chọn: <span className="font-bold text-blue-600">{selectedTable.name}</span>
                </p>
                <button onClick={handleCreateOrder} className="mt-2 px-10 py-3 bg-green-600 text-white font-bold rounded-full shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105">
                    Tạo đơn hàng
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage ;