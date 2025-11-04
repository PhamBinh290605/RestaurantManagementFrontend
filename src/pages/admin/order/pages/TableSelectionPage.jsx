// src/pages/admin/order/pages/TableSelectionPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Giả sử bạn dùng axios
import TableIcon from '../components/TableIcon';
import { Zap, UtensilsCrossed, CalendarClock } from 'lucide-react';
import { ROUTERS } from '../../../../utils/router';

// --- MOCK DATA ---
// Trong thực tế, dữ liệu này sẽ được lấy từ API
const mockTables = [
    { id: 1, tableNumber: "A01", status: "Available", orderId: null },
    { id: 2, tableNumber: "A02", status: "Occupied", orderId: 101 },
    { id: 3, tableNumber: "B01", status: "Reserved", orderId: null },
    { id: 4, tableNumber: "B02", status: "Available", orderId: null },
    { id: 5, tableNumber: "C01", status: "Occupied", orderId: 102 },
    { id: 6, tableNumber: "C02", status: "Available", orderId: null },
];

const TableSelectionPage = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTable, setSelectedTable] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTables = async () => {
            setLoading(true);
            try {
                // API CALL: Lấy danh sách tất cả các bàn từ server.
                // const response = await axios.get('/api/tables');
                // setTables(response.data);

                // --- Sử dụng Mock Data ---
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
                setTables(mockTables);
                // -------------------------

            } catch (error) {
                console.error("Failed to fetch tables:", error);
                // Xử lý lỗi, ví dụ: hiển thị thông báo
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, []);

    const handleSelectTable = (table) => {
        if (table.status !== 'Reserved') {
            setSelectedTable(prev => (prev?.tableNumber === table.tableNumber ? null : table));
        }
    };

    const handleNavigateToOrder = async () => {
        if (!selectedTable) return;

        try {
            if (selectedTable.status === 'Available') {
                // API CALL: Khi chọn bàn trống, gửi yêu cầu tạo một đơn hàng mới cho bàn này.
                // Server sẽ trả về thông tin đơn hàng mới, bao gồm cả ID.
                // const response = await axios.post('/api/orders', { tableId: selectedTable.id });
                // const newOrder = response.data;
                // const newOrderId = newOrder.id;

                // --- Sử dụng Mock Data ---
                const newOrderId = Math.floor(Math.random() * 1000) + 200;
                console.log(`Creating new order for table ${selectedTable.tableNumber}, new Order ID: ${newOrderId}`);
                // -------------------------

                const detailPath = ROUTERS.ADMIN.ORDER_DETAIL.replace(':orderId', newOrderId);
                navigate(detailPath);

            } else if (selectedTable.status === 'Occupied') {
                // Chuyển hướng đến đơn hàng đã tồn tại của bàn.
                const existingOrderId = selectedTable.orderId;
                if (existingOrderId) {
                    console.log(`Navigating to existing order for table ${selectedTable.tableNumber}, Order ID: ${existingOrderId}`);
                    const detailPath = ROUTERS.ADMIN.ORDER_DETAIL.replace(':orderId', existingOrderId);
                    navigate(detailPath);
                } else {
                    // Xử lý trường hợp bàn "Occupied" nhưng không có orderId
                    console.error(`Table ${selectedTable.tableNumber} is occupied but has no associated orderId.`);
                }
            }
        } catch (error) {
            console.error("Failed to create or navigate to order:", error);
            // Hiển thị thông báo lỗi cho người dùng
        }
    };

    const getTableCardClasses = (table) => {
        const baseClasses = 'relative p-4 rounded-lg shadow-lg flex flex-col items-center justify-center transition-all duration-300 aspect-square';
        const statusClasses = {
            Available: 'bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 hover:-translate-y-1',
            Occupied: 'bg-green-100 text-green-800 cursor-pointer hover:bg-green-200 hover:-translate-y-1',
            Reserved: 'bg-purple-100 text-purple-800 cursor-not-allowed opacity-70',
        };

        let finalClasses = `${baseClasses} ${statusClasses[table.status] || 'bg-gray-200'}`;

        if (selectedTable?.tableNumber === table.tableNumber) {
            finalClasses += ' ring-4 ring-offset-2 ring-yellow-400';
        }
        return finalClasses;
    };

    const renderActionButton = () => {
        if (!selectedTable) return null;

        const buttonText = selectedTable.status === 'Available' ? 'Create New Order' : 'View / Edit Order';

        return (
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] flex justify-center items-center z-10">
                <div className="text-center">
                    <p className="text-lg font-medium text-gray-700">Selected: <span className="font-bold text-blue-600">{selectedTable.tableNumber}</span></p>
                    <button onClick={handleNavigateToOrder} className="mt-2 px-10 py-3 bg-green-600 text-white font-bold rounded-full shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105">
                        {buttonText}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen pb-32">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Select a Table</h1>
                <p className="text-gray-500 mt-2">Choose a table to start or manage an order.</p>
            </div>

            <div className="flex justify-center flex-wrap items-center gap-6 mb-8 text-sm font-medium">
                <div className="flex items-center gap-2"><Zap className="text-blue-500 h-5 w-5" /><span>Available</span></div>
                <div className="flex items-center gap-2"><UtensilsCrossed className="text-green-500 h-5 w-5" /><span>Occupied</span></div>
                <div className="flex items-center gap-2"><CalendarClock className="text-purple-500 h-5 w-5" /><span>Reserved</span></div>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading tables...</div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {tables.map((table) => (
                        <div key={table.id} onClick={() => handleSelectTable(table)} className={getTableCardClasses(table)}>
                            <TableIcon className="w-16 h-16 sm:w-20 sm:h-20 mb-2" />
                            <span className="font-bold text-lg">{table.tableNumber}</span>
                        </div>
                    ))}
                </div>
            )}

            {renderActionButton()}
        </div>
    );
};

export default TableSelectionPage;