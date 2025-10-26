import React, { useState, useEffect } from "react";
import { Boxes, List, Loader2, AlertTriangle, Package } from "lucide-react"; // Thêm icon List, Package
import toast from 'react-hot-toast';
// Import cả hai hàm API cần thiết
import { apiGetInventories, apiGetInventoryItems } from "../../../../services/api";

// --- Component FormSelect (tái sử dụng từ AddItemInventory) ---
const FormSelect = ({ id, name, value, onChange, children, required = false, ...props }) => (
  <select id={id} name={name} value={value} onChange={onChange} required={required} {...props} className="w-full md:w-80 px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-800 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#4A7B7A]/80 focus:border-transparent hover:border-gray-300 disabled:bg-gray-200/50 disabled:cursor-not-allowed">
    {children}
  </select>
);
// --- Hết component FormSelect ---

export default function ListInventory() {
  const [inventories, setInventories] = useState([]); // Danh sách kho cho dropdown
  const [selectedInventoryId, setSelectedInventoryId] = useState(""); // ID kho đang được chọn
  const [inventoryItems, setInventoryItems] = useState([]); // Danh sách item của kho được chọn
  
  const [isLoadingInventories, setIsLoadingInventories] = useState(true); // Loading cho dropdown
  const [isLoadingItems, setIsLoadingItems] = useState(false); // Loading cho bảng item
  
  const [errorInventories, setErrorInventories] = useState(null); // Lỗi khi tải danh sách kho
  const [errorItems, setErrorItems] = useState(null); // Lỗi khi tải danh sách item

  // 1. useEffect: Tải danh sách kho hàng (chỉ chạy 1 lần)
  useEffect(() => {
    const loadInventories = async () => {
      setIsLoadingInventories(true);
      setErrorInventories(null);
      try {
        const response = await apiGetInventories();
        setInventories(response.data);
        // Tự động chọn kho đầu tiên nếu có
        if (response.data && response.data.length > 0) {
          setSelectedInventoryId(response.data[0].id);
        }
      } catch (err) {
        console.error("Failed to load inventories:", err);
        const errorMessage = err.response?.data || "Failed to load inventory list.";
        setErrorInventories(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoadingInventories(false);
      }
    };
    loadInventories();
  }, []); // [] đảm bảo chỉ chạy 1 lần

  // 2. useEffect: Tải danh sách items mỗi khi selectedInventoryId thay đổi
  useEffect(() => {
    // Chỉ tải khi có ID hợp lệ được chọn
    if (selectedInventoryId) {
      const loadItems = async () => {
        setIsLoadingItems(true);
        setErrorItems(null);
        setInventoryItems([]); // Xóa list cũ trước khi tải list mới
        try {
          const response = await apiGetInventoryItems(selectedInventoryId);
          setInventoryItems(response.data); // Lưu danh sách item
        } catch (err) {
          console.error(`Failed to load items for inventory ${selectedInventoryId}:`, err);
          let errorMessage = `Failed to load items.`;
          // Kiểm tra lỗi 404 (Not Found) - có thể kho đó chưa có item nào
          if (err.response?.status === 404) {
             errorMessage = "No items found for this inventory yet.";
             // Không hiển thị toast lỗi cho trường hợp 404 này
          } else {
             errorMessage = err.response?.data || errorMessage;
             toast.error(errorMessage);
          }
          setErrorItems(errorMessage); // Lưu lỗi để hiển thị thông báo
        } finally {
          setIsLoadingItems(false);
        }
      };
      loadItems();
    } else {
      // Nếu không có kho nào được chọn (ví dụ lúc đầu chưa load xong list kho)
      setInventoryItems([]); // Đảm bảo bảng trống
    }
  }, [selectedInventoryId]); // Phụ thuộc vào selectedInventoryId

  // Hàm xử lý khi người dùng chọn kho khác từ dropdown
  const handleInventoryChange = (e) => {
    setSelectedInventoryId(e.target.value);
  };

  // --- Hàm render bảng items ---
  const renderItemsTable = () => {
    // A. Đang tải items
    if (isLoadingItems) {
      return (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="animate-spin text-[#4A7B7A]" size={40} />
        </div>
      );
    }

    // B. Lỗi khi tải items (nhưng không phải lỗi 404)
    if (errorItems && !errorItems.startsWith("No items found")) {
      return (
        <div className="flex flex-col items-center justify-center h-48 bg-red-50 p-6 rounded-lg text-red-700">
          <AlertTriangle className="mb-3" size={40} />
          <h2 className="text-lg font-semibold mb-1">Error Loading Items</h2>
          <p>{typeof errorItems === 'string' ? errorItems : "An unexpected error occurred."}</p>
        </div>
      );
    }

    // C. Không có items nào (do lỗi 404 hoặc list rỗng)
    if (inventoryItems.length === 0) {
      return (
        <div className="flex justify-center items-center h-48 text-gray-500">
          <p className="text-lg">{errorItems || "Select an inventory to view items."}</p>
        </div>
      );
    }

    // D. Hiển thị bảng items
    return (
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-100 mt-6">
        <table className="w-full text-left bg-white">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Item Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">Quantity</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Unit</th>
              {/* Thêm các cột khác nếu cần, ví dụ: Actions */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inventoryItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.unit}</td>
                {/* Thêm ô actions nếu cần */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };


  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-full">
      <div className="max-w-7xl mx-auto">
        
        {/* Tiêu đề trang */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-gradient-to-r from-[#E8F3F2] to-[#D9EFEE] rounded-xl shadow-sm">
              <List className="text-[#4A7B7A]" size={28} /> {/* Đổi Icon */}
            </span>
            <h1 className="text-3xl font-bold text-gray-900">
              View Inventory Items
            </h1>
          </div>

          {/* --- Dropdown Chọn Kho --- */}
          <div>
            <label htmlFor="inventorySelector" className="sr-only">Select Inventory</label> {/* Label ẩn cho accessibility */}
            {isLoadingInventories ? (
              // Skeleton loading cho dropdown
              <div className="w-full md:w-80 h-[46px] bg-gray-200 rounded-lg animate-pulse"></div>
            ) : errorInventories ? (
              // Thông báo lỗi nếu không tải được list kho
               <div className="text-red-600 text-sm">Could not load inventories.</div>
            ) : (
              <FormSelect
                id="inventorySelector"
                name="inventorySelector"
                value={selectedInventoryId}
                onChange={handleInventoryChange}
                disabled={isLoadingItems} // Vô hiệu hóa khi đang tải items
              >
                {inventories.length === 0 && <option value="">No inventories available</option>}
                {inventories.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.itemName} (ID: {inv.id})
                  </option>
                ))}
              </FormSelect>
            )}
          </div>
        </div>

        {/* Thẻ chứa bảng items */}
        <div className="bg-white p-8 md:p-10 rounded-xl shadow-xl border border-gray-100">
          {/* Thông tin kho đang chọn (nếu có) */}
          {selectedInventoryId && inventories.find(inv => inv.id == selectedInventoryId) && !isLoadingInventories && (
            <div className="mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                 <Boxes size={22} className="text-[#4A7B7A]" />
                 Items in: {inventories.find(inv => inv.id == selectedInventoryId)?.itemName}
              </h2>
            </div>
          )}
          
          {/* Render bảng hoặc thông báo loading/lỗi */}
          {renderItemsTable()}
        </div>
      </div>
    </div>
  );
}