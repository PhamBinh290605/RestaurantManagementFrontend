// src/pages/admin/order/pages/OrderDetailPage.jsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, Search, ShoppingCart, Lock } from 'lucide-react';
import { ROUTERS } from '../../../../utils/router';
import axios from 'axios'; // Giả sử bạn dùng axios

// --- MOCK DATA ---
const mockMenu = [
  { id: 1, name: 'Beef Stir-fry with Morning Glory', price: 123.00, category: 'Main Course', isAvailable: true, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2080' },
  { id: 2, name: 'Steamed Red Tilapia with Soy Sauce', price: 246.00, category: 'Main Course', isAvailable: true, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2080' },
  { id: 3, name: 'Clay Pot Roasted Chicken', price: 350.00, category: 'Main Course', isAvailable: false, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2080' },
  { id: 4, name: 'Coca Cola', price: 20.00, category: 'Beverage', isAvailable: true, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=20800' },
  { id: 5, name: 'Crispy Spring Rolls', price: 60.00, category: 'Appetizer', isAvailable: true, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2080' },
  { id: 6, name: 'Caesar Salad', price: 90.00, category: 'Appetizer', isAvailable: true, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2080' },
];
const mockExistingOrders = {
  101: { id: 101, tableNumber: "A02", userName: "Le Thi Yen", status: "Pending", totalAmount: 369.00, items: [{ menuItemID: 2, productName: 'Steamed Red Tilapia with Soy Sauce', quantity: 1, price: 246.00, image: '...' }, { menuItemID: 1, productName: 'Beef Stir-fry with Morning Glory', quantity: 1, price: 123.00, image: '...' }] },
  102: { id: 102, tableNumber: "C01", userName: "Nguyen Van A", status: "Pending", totalAmount: 80.00, items: [{ menuItemID: 4, productName: 'Coca Cola', quantity: 4, price: 20.00, image: '...' }] },
};

const ITEMS_PER_PAGE = 6;

// TỐI ƯU HÓA: Bọc MenuItemCard trong React.memo.
// Component này sẽ chỉ render lại nếu props (item, onAddItem) của nó thực sự thay đổi.
const MenuItemCard = React.memo(({ item, onAddItem }) => {
  const [quantity, setQuantity] = useState(1);
  const isAvailable = item.isAvailable;

  const handleAddToCart = () => {
    if (!isAvailable) return;
    onAddItem(item, quantity);
    setQuantity(1); // Reset số lượng về 1 sau khi thêm
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${!isAvailable && 'opacity-60 bg-gray-50'}`}>
      <div className="relative">
        <img src={item.image} alt={item.name} className="w-full h-32 object-cover" />
        {!isAvailable && <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">Out of Stock</div>}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 text-md flex-grow">{item.name}</h3>
        <p className="text-blue-600 font-semibold my-2">${item.price.toFixed(2)}</p>
        <div className="flex items-center gap-2 mt-auto">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg" disabled={!isAvailable}>-</button>
            <input type="number" value={quantity} readOnly className="w-12 text-center font-bold text-gray-800 border-l border-r bg-white" disabled={!isAvailable} />
            <button onClick={() => setQuantity(q => q + 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg" disabled={!isAvailable}>+</button>
          </div>
          <button onClick={handleAddToCart} className="flex-grow bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-bold text-sm shadow-sm transition-all disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={!isAvailable}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
});

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchOrderAndMenuData = async () => {
      setLoading(true);
      try {
        // API CALL: Lấy thông tin chi tiết của đơn hàng.
        // const orderResponse = await axios.get(`/api/orders/${orderId}`);
        // setOrder(orderResponse.data);

        // --- Sử dụng Mock Data ---
        const existingOrder = mockExistingOrders[orderId];
        if (existingOrder) {
          setOrder(existingOrder);
        } else {
          setOrder({ id: parseInt(orderId), tableNumber: "New", userName: "New Customer", status: "Pending", totalAmount: 0, items: [] });
        }
        // -------------------------

        // API CALL: Lấy danh sách menu.
        // const menuResponse = await axios.get('/api/menu-items');
        // setMenu(menuResponse.data);

        // --- Sử dụng Mock Data ---
        setMenu(mockMenu);
        // -------------------------

      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Xử lý lỗi, ví dụ chuyển hướng về trang trước
      } finally {
        setLoading(false);
      }
    };

    fetchOrderAndMenuData();
  }, [orderId]);

  // Lọc và tìm kiếm menu, chỉ tính toán lại khi dependency thay đổi
  const filteredAndSearchedMenu = useMemo(() => {
    return menu
      .filter(item => selectedCategory === 'All' || item.category === selectedCategory)
      .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [menu, searchTerm, selectedCategory]);

  const categories = useMemo(() => ['All', ...new Set(menu.map(item => item.category))], [menu]);
  const totalPages = Math.ceil(filteredAndSearchedMenu.length / ITEMS_PER_PAGE);

  // Phân trang menu, chỉ tính toán lại khi dependency thay đổi
  const paginatedMenu = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSearchedMenu.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSearchedMenu, currentPage]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset về trang đầu khi đổi category
  };

  // TỐI ƯU HÓA: Bọc hàm bằng useCallback.
  // Hàm này sẽ không được tạo lại mỗi lần component render, trừ khi `orderId` thay đổi.
  // Điều này giúp `MenuItemCard` không bị render lại một cách không cần thiết.
  const handleAddItem = useCallback((menuItem, quantity) => {
    // API CALL: Gửi yêu cầu lên server để thêm/cập nhật món ăn trong đơn hàng.
    // await axios.post(`/api/orders/${orderId}/items`, { menuItemId: menuItem.id, quantity });
    console.log(`Adding ${quantity} of ${menuItem.name} (ID: ${menuItem.id}) to order ${orderId}`);

    setOrder(currentOrder => {
      const existingItem = currentOrder.items.find(i => i.menuItemID === menuItem.id);
      let newItems;
      if (existingItem) {
        newItems = currentOrder.items.map(i =>
          i.menuItemID === menuItem.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        newItems = [...currentOrder.items, {
          menuItemID: menuItem.id,
          productName: menuItem.name,
          quantity,
          price: menuItem.price,
          image: menuItem.image,
        }];
      }
      const newTotalAmount = newItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      return { ...currentOrder, items: newItems, totalAmount: newTotalAmount };
    });
  }, [orderId]);

  // TỐI ƯU HÓA: Tương tự, bọc hàm bằng useCallback.
  const handleRemoveItem = useCallback((menuItemIdToRemove) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      // API CALL: Gửi yêu cầu lên server để xóa một món ăn khỏi đơn hàng.
      // await axios.delete(`/api/orders/${orderId}/items/${menuItemIdToRemove}`);
      console.log(`Removing item ${menuItemIdToRemove} from order ${orderId}`);

      setOrder(currentOrder => {
        const newItems = currentOrder.items.filter(i => i.menuItemID !== menuItemIdToRemove);
        const newTotalAmount = newItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        return { ...currentOrder, items: newItems, totalAmount: newTotalAmount };
      });
    }
  }, [orderId]);

  const handleCheckout = async () => {
    if (!order || order.items.length === 0) {
      alert("Please add items before checking out.");
      return;
    }

    try {
      // API CALL: Gửi yêu cầu thanh toán/hoàn tất đơn hàng.
      // await axios.put(`/api/orders/${orderId}/checkout`, {
      //   totalAmount: order.totalAmount * 1.1 // Gửi tổng tiền cuối cùng
      // });

      console.log("Checking out order:", order);
      alert(`Checkout successful! Total: ${(order.totalAmount * 1.1).toFixed(2)}`);
      navigate(ROUTERS.ADMIN.ORDER);
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout failed. Please try again.");
    }
  };

  if (loading || !order) return <div className="flex justify-center items-center h-screen font-bold text-xl text-gray-600">Loading Order...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 font-sans">
      <div className="w-full md:w-3/5 lg:w-2/3 p-6 flex flex-col">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(ROUTERS.ADMIN.ORDER)} className="p-2 rounded-full hover:bg-gray-200 transition-colors mr-4">
            <ArrowLeft className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Menu</h1>
            <p className="text-gray-500">Select items to add to the order</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
            <input type="text" placeholder="Search item by name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow" />
          </div>
          <select value={selectedCategory} onChange={handleCategoryChange} className="border border-gray-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow">
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="flex-grow grid grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2">
          {paginatedMenu.length > 0 ? paginatedMenu.map(item => (
            <MenuItemCard key={item.id} item={item} onAddItem={handleAddItem} />
          )) : (
            <p className="col-span-full text-center text-gray-500 mt-10">No items match your search.</p>
          )}
        </div>

        <div className="flex justify-center items-center gap-4 mt-6">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled={currentPage === 1}>Prev</button>
          <span className="font-bold text-gray-600">Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>

      <div className="w-full md:w-2/5 lg:w-1/3 bg-white border-l border-gray-200 p-6 flex flex-col shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Current Order</h2>
          <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">#{order.id}</span>
        </div>
        <div className="text-lg font-semibold text-gray-600 mb-2">
          Table: <span className="text-gray-900 font-extrabold">{order.tableNumber || 'N/A'}</span>
        </div>

        <div className="flex-grow overflow-y-auto -mx-6 px-6 border-t border-b py-4 my-4">
          {order.items.length === 0 ? (
            <div className="text-center flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingCart size={48} className="mb-4" />
              <p className="font-semibold">This order is empty</p>
            </div>
          ) : (
            order.items.map(item => (
              <div key={item.menuItemID} className="flex items-center mb-4 transition-all duration-300">
                <img src={item.image} alt={item.productName} className="w-16 h-16 object-cover rounded-lg shadow-sm mr-4" />
                <div className="flex-grow">
                  <p className="font-bold text-gray-800">{item.productName}</p>
                  <p className="text-sm text-gray-500 font-medium">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-semibold text-gray-800 text-right">
                    <p>x {item.quantity}</p>
                    <p className="text-sm text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button onClick={() => handleRemoveItem(item.menuItemID)} className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-auto">
          <div className="space-y-2 text-md font-medium text-gray-600 mb-4">
            <div className="flex justify-between"><span>Subtotal</span> <span className="text-gray-800">${order.totalAmount.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax (10%)</span> <span className="text-gray-800">${(order.totalAmount * 0.1).toFixed(2)}</span></div>
            <div className="flex justify-between border-t pt-2 text-xl font-bold text-gray-900"><span>Total</span> <span>${(order.totalAmount * 1.1).toFixed(2)}</span></div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={order.items.length === 0}
            className="w-full flex items-center justify-center gap-3 py-4 bg-green-600 text-white font-extrabold text-lg rounded-xl shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100">
            <Lock size={20} />
            Secure Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;