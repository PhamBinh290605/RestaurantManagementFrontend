// src/pages/OrderDetailPage.js
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react';

// --- MOCK DATA & API SIMULATION ---
const mockMenu = [
    { id: 101, name: 'Phở Bò Tái', price: 50000, category: 'Món chính', image: 'https://via.placeholder.com/150/FFC107/000000?Text=Pho' },
    { id: 102, name: 'Bún Chả Hà Nội', price: 45000, category: 'Món chính', image: 'https://via.placeholder.com/150/F44336/FFFFFF?Text=BunCha' },
    { id: 103, name: 'Nem Rán', price: 30000, category: 'Khai vị', image: 'https://via.placeholder.com/150/4CAF50/FFFFFF?Text=Nem' },
    { id: 104, name: 'Trà Đá', price: 5000, category: 'Đồ uống', image: 'https://via.placeholder.com/150/03A9F4/FFFFFF?Text=TraDa' },
    { id: 105, name: 'Nước Cam', price: 20000, category: 'Đồ uống', image: 'https://via.placeholder.com/150/FF9800/FFFFFF?Text=Cam' },
];
// Lấy lại mockTables để tìm thông tin bàn
const mockTables = [
    { id: 1, name: 'Bàn 1', status: 'available' }, { id: 2, name: 'Bàn 2', status: 'occupied' }, { id: 3, name: 'Bàn 3', status: 'reserved' }, { id: 4, name: 'Bàn 4', status: 'available' }, { id: 5, name: 'Bàn 5', status: 'available' }, { id: 6, name: 'Bàn 6', status: 'occupied' }, { id: 7, name: 'Bàn 7', status: 'available' }, { id: 8, name: 'Bàn 8', status: 'reserved' },
];

const OrderDetailPage = () => {
    const { tableId } = useParams();
    const navigate = useNavigate();

    const [tableInfo, setTableInfo] = useState(null);
    const [menu, setMenu] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- API LOGIC (bên trong component) ---
    const fetchOrderData = async (id) => {
        setLoading(true);
        try {
            // Trong thực tế:
            // const tableResponse = await axios.get(`/api/tables/${id}`);
            // const menuResponse = await axios.get('/api/menu');

            // Giả lập API call
            await new Promise(resolve => setTimeout(resolve, 500));
            const foundTable = mockTables.find(t => t.id === parseInt(id));
            if (!foundTable) throw new Error("Không tìm thấy bàn!");

            setTableInfo(foundTable);
            setMenu(mockMenu);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu đơn hàng:", error);
            // Có thể điều hướng về trang chủ nếu không tìm thấy bàn
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderData(tableId);
    }, [tableId]);

    const handleAddItem = (item) => {
        setOrderItems(prevItems => {
            const existingItem = prevItems.find(i => i.id === item.id);
            if (existingItem) {
                return prevItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prevItems, { ...item, quantity: 1 }];
        });
    };

    const handleUpdateQuantity = (itemId, amount) => {
        setOrderItems(prevItems => {
            const updatedItems = prevItems.map(item => {
                if (item.id === itemId) {
                    return { ...item, quantity: Math.max(0, item.quantity + amount) };
                }
                return item;
            });
            // Lọc bỏ những món có số lượng bằng 0
            return updatedItems.filter(item => item.quantity > 0);
        });
    };

    const totalBill = useMemo(() => {
        return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [orderItems]);

    const handleCheckout = async () => {
        if (orderItems.length === 0) {
            alert("Vui lòng chọn món trước khi thanh toán!");
            return;
        }
        const confirmation = window.confirm(`Xác nhận thanh toán cho ${tableInfo.name} với tổng số tiền ${totalBill.toLocaleString('vi-VN')} VNĐ?`);
        if (confirmation) {
            // Trong thực tế, bạn sẽ gửi yêu cầu POST đến API để lưu đơn hàng và thanh toán
            // await axios.post('/api/orders/checkout', { tableId, items: orderItems, total: totalBill });
            alert("Thanh toán thành công!");
            navigate('/'); // Quay về trang chọn bàn
        }
    };


    if (loading || !tableInfo) {
        return <div className="flex justify-center items-center h-screen">Đang tải thông tin đơn hàng...</div>;
    }

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-100">
            {/* Cột Menu (bên trái) */}
            <div className="w-full md:w-2/3 p-4 overflow-y-auto">
                <div className="flex items-center mb-6">
                    <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-gray-200 mr-4">
                        <ArrowLeft />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Thực đơn</h1>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {menu.map(item => (
                        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                            <img src={item.image} alt={item.name} className="w-full h-32 object-cover" />
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="font-semibold text-md flex-grow">{item.name}</h3>
                                <p className="text-gray-600 text-sm mb-2">{item.price.toLocaleString('vi-VN')} VNĐ</p>
                                <button onClick={() => handleAddItem(item)} className="w-full mt-auto bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-bold">
                                    Thêm
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cột Đơn hàng (bên phải) */}
            <div className="w-full md:w-1/3 bg-white p-6 shadow-lg flex flex-col">
                <h2 className="text-2xl font-bold mb-4">Đơn hàng: <span className="text-blue-600">{tableInfo.name}</span></h2>
                <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                    {orderItems.length === 0 ? (
                        <p className="text-gray-500 text-center mt-10">Chưa có món nào được chọn.</p>
                    ) : (
                        orderItems.map(item => (
                            <div key={item.id} className="flex items-center mb-4">
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                                <div className="flex-grow">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-gray-500">{(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleUpdateQuantity(item.id, -1)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300">
                                        {item.quantity === 1 ? <Trash2 className="h-4 w-4 text-red-500" /> : <Minus className="h-4 w-4" />}
                                    </button>
                                    <span className="font-bold w-6 text-center">{item.quantity}</span>
                                    <button onClick={() => handleUpdateQuantity(item.id, 1)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300">
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-medium text-gray-600">Tổng cộng</span>
                        <span className="text-2xl font-bold text-gray-900">{totalBill.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={orderItems.length === 0}
                        className="w-full py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                        Thanh toán
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;