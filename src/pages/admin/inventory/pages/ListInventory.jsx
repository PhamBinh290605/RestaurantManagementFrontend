import React, { useState, useEffect } from "react";
// 1. Import icons và các hàm API
import { Boxes, List, Loader2, AlertTriangle, Package, Trash2, Pencil, Save } from "lucide-react"; 
import toast from 'react-hot-toast';
import { 
  apiGetInventories, 
  apiGetInventoryItems, 
  apiDeleteItemFromInventory,
  apiUpdateInventoryItem,
  apiDeleteInventory // API mới
} from "../../../../services/api"; // 5 cấp ../ để đi từ .../pages/ up to src/

// --- Các component Form (dùng cho modal) ---
const FormInput = ({ id, name, value, onChange, placeholder, type = "text", required = false, step = null, ...props }) => (
  <input type={type} id={id} name={name} value={value} onChange={onChange} placeholder={placeholder} step={step} required={required} {...props} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm bg-gray-50/50 text-gray-800 placeholder-gray-400 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#4A7B7A]/80 focus:border-transparent focus:bg-white hover:border-gray-300 disabled:bg-gray-200/50 disabled:cursor-not-allowed" />
);
const FormSelect = ({ id, name, value, onChange, children, required = false, ...props }) => (
  <select id={id} name={name} value={value} onChange={onChange} required={required} {...props} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-800 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#4A7B7A]/80 focus:border-transparent hover:border-gray-300 disabled:bg-gray-200/50 disabled:cursor-not-allowed">
    {children}
  </select>
);
const FormLabel = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-semibold text-gray-700 mb-2">{children}</label>
);
// --- Hết component Form ---

// --- 2. Component Modal Xóa (Đa dụng) ---
const ConfirmationModal = ({ title, message, onCancel, onConfirm, isDeleting }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
      <div className="flex items-center gap-3">
        <span className="p-2 bg-red-100 rounded-full">
          <AlertTriangle className="text-red-600" size={24} />
        </span>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>
      <p className="text-gray-600 mt-4">
        {message}
      </p>
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:bg-red-400 disabled:cursor-not-allowed"
        >
          {isDeleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
);

// --- 3. Component Modal Sửa ---
const unitOptions = ["kg", "g", "ml", "l", "pcs", "pack", "bottle"];

const EditItemModal = ({ item, onCancel, onSave, isSaving }) => {
  const [formData, setFormData] = useState({
    name: item.name,
    quantity: item.quantity,
    unit: item.unit,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full mx-4"
      >
        <div className="flex items-center gap-3">
          <span className="p-2 bg-blue-100 rounded-full">
            <Pencil className="text-blue-600" size={24} />
          </span>
          <h2 className="text-xl font-semibold text-gray-900">Edit Item: {item.name}</h2>
        </div>
        <div className="space-y-5 mt-6">
          <div>
            <FormLabel htmlFor="edit-name">Item Name</FormLabel>
            <FormInput
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSaving}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <FormLabel htmlFor="edit-quantity">Quantity</FormLabel>
              <FormInput
                type="number"
                id="edit-quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                disabled={isSaving}
                required
              />
            </div>
            <div>
              <FormLabel htmlFor="edit-unit">Unit</FormLabel>
              <FormSelect
                id="edit-unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                disabled={isSaving}
                required
              >
                {unitOptions.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </FormSelect>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-[#4A7B7A] text-white font-medium rounded-lg hover:bg-[#3A6B6A] transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};
// --- HẾT COMPONENT MODAL SỬA ---


export default function ListInventory() {
  const [inventories, setInventories] = useState([]);
  const [selectedInventoryId, setSelectedInventoryId] = useState("");
  const [inventoryItems, setInventoryItems] = useState([]);
  
  const [isLoadingInventories, setIsLoadingInventories] = useState(true);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  
  const [errorInventories, setErrorInventories] = useState(null);
  const [errorItems, setErrorItems] = useState(null);

  // --- 4. State quản lý Sửa & Xóa ---
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [inventoryToDelete, setInventoryToDelete] = useState(null);
  const [isDeletingInventory, setIsDeletingInventory] = useState(false);

  // Hàm tải danh sách kho
  const loadInventories = async () => {
    setIsLoadingInventories(true);
    setErrorInventories(null);
    try {
      const response = await apiGetInventories();
      setInventories(response.data);
      const currentSelectedStillExists = response.data.some(inv => inv.id == selectedInventoryId);
      if (!currentSelectedStillExists && response.data && response.data.length > 0) {
        setSelectedInventoryId(response.data[0].id);
      } else if (response.data.length === 0) {
        setSelectedInventoryId("");
        setInventoryItems([]);
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

  // useEffect: Tải danh sách kho (chỉ chạy 1 lần)
  useEffect(() => {
    loadInventories();
  }, []); 

  // useEffect: Tải danh sách items (thay đổi khi selectedInventoryId thay đổi)
  useEffect(() => {
    if (selectedInventoryId) {
      const loadItems = async () => {
        setIsLoadingItems(true);
        setErrorItems(null);
        setInventoryItems([]);
        try {
          const response = await apiGetInventoryItems(selectedInventoryId);
          setInventoryItems(response.data);
        } catch (err) {
          console.error(`Failed to load items for inventory ${selectedInventoryId}:`, err);
          let errorMessage = `Failed to load items.`;
          if (err.response?.status === 404) {
             errorMessage = "No items found for this inventory yet.";
          } else {
             errorMessage = err.response?.data || errorMessage;
             toast.error(errorMessage);
          }
          setErrorItems(errorMessage);
        } finally {
          setIsLoadingItems(false);
        }
      };
      loadItems();
    } else {
      setInventoryItems([]);
    }
  }, [selectedInventoryId]);

  // Hàm xử lý khi chọn kho
  const handleInventoryChange = (e) => {
    setSelectedInventoryId(e.target.value);
  };

  // --- 5. HÀM XỬ LÝ XÓA ITEM ---
  const handleDeleteClick = (item) => setItemToDelete(item);
  const handleCancelDelete = () => setItemToDelete(null);
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    const toastId = toast.loading('Deleting item...');
    try {
      await apiDeleteItemFromInventory(selectedInventoryId, itemToDelete.id);
      toast.success('Item deleted successfully!', { id: toastId });
      setInventoryItems(prevItems => 
        prevItems.filter(item => item.id !== itemToDelete.id)
      );
      setItemToDelete(null); 
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast.error(error.response?.data || "Failed to delete item.", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  // --- 6. HÀM XỬ LÝ SỬA ITEM ---
  const handleEditClick = (item) => {
    setItemToEdit(item);
  };

  const handleCancelEdit = () => {
    setItemToEdit(null);
  };

  const handleSaveEdit = async (updatedItemData) => {
    if (!itemToEdit) return;
    setIsSaving(true);
    const toastId = toast.loading('Saving changes...');
    try {
      await apiUpdateInventoryItem(selectedInventoryId, itemToEdit.id, updatedItemData);
      toast.success('Item updated successfully!', { id: toastId });
      setInventoryItems(prevItems => 
        prevItems.map(item => 
          item.id === itemToEdit.id 
            ? { ...item, ...updatedItemData, id: item.id }
            : item
        )
      );
      setItemToEdit(null);
    } catch (error) {
      console.error("Failed to update item:", error);
      const errorMessage = error.response?.data?.message || error.response?.data || "Failed to save changes.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  // --- 7. HÀM XỬ LÝ XÓA KHO ---
  const handleDeleteInventoryClick = () => {
    const inventory = inventories.find(inv => inv.id == selectedInventoryId);
    if (inventory) {
      setInventoryToDelete(inventory);
    } else {
      toast.error("Please select an inventory to delete.");
    }
  };

  const handleCancelDeleteInventory = () => {
    setInventoryToDelete(null);
  };

  const handleConfirmDeleteInventory = async () => {
    if (!inventoryToDelete) return;
    setIsDeletingInventory(true);
    const toastId = toast.loading(`Deleting inventory: ${inventoryToDelete.itemName}...`);
    try {
      await apiDeleteInventory(inventoryToDelete.id);
      toast.success('Inventory deleted successfully!', { id: toastId });
      setInventoryToDelete(null);
      await loadInventories(); 
    } catch (error) {
      console.error("Failed to delete inventory:", error);
      const errorMessage = error.response?.data || "Failed to delete inventory.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsDeletingInventory(false);
    }
  };

  // --- 8. HÀM RENDER BẢNG ---
  const renderItemsTable = () => {
    if (isLoadingItems) {
      return <div className="flex justify-center items-center h-48"><Loader2 className="animate-spin text-[#4A7B7A]" size={40} /></div>;
    }
    if (errorItems && !errorItems.startsWith("No items found")) {
      return <div className="flex flex-col items-center justify-center h-48 bg-red-50 p-6 rounded-lg text-red-700"><AlertTriangle className="mb-3" size={40} /><h2 className="text-lg font-semibold mb-1">Error Loading Items</h2><p>{typeof errorItems === 'string' ? errorItems : "An unexpected error occurred."}</p></div>;
D     }
    if (inventoryItems.length === 0) {
      return <div className="flex justify-center items-center h-48 text-gray-500"><p className="text-lg">{errorItems || "Select an inventory to view items."}</p></div>;
    }

    return (
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-100 mt-6">
        <table className="w-full text-left bg-white">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Item Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">Quantity</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Unit</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inventoryItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.unit}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                      title="Edit Item"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
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
              <List className="text-[#4A7B7A]" size={28} />
            </span>
            <h1 className="text-3xl font-bold text-gray-900">
              View Inventory Items
            </h1>
          </div>

          {/* --- 9. CẬP NHẬT: Dropdown Chọn Kho và Nút Xóa Kho --- */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label htmlFor="inventorySelector" className="sr-only">Select Inventory</label>
              {isLoadingInventories ? (
                <div className="w-full md:w-80 h-[46px] bg-gray-200 rounded-lg animate-pulse"></div>
              ) : errorInventories ? (
                 <div className="text-red-600 text-sm">Could not load inventories.</div>
              ) : (
                <FormSelect
                  id="inventorySelector"
                  name="inventorySelector"
                  value={selectedInventoryId}
                  onChange={handleInventoryChange}
                  disabled={isLoadingItems || isDeletingInventory}
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
            {/* Nút Xóa Kho */}
            <button
              onClick={handleDeleteInventoryClick}
              disabled={isLoadingInventories || isDeletingInventory || !selectedInventoryId}
              className="p-3 h-[46px] bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 transition-colors
                         disabled:bg-gray-400 disabled:cursor-not-allowed"
              title="Delete Selected Inventory"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Thẻ chứa bảng items */}
        <div className="bg-white p-8 md:p-10 rounded-xl shadow-xl border border-gray-100">
          {selectedInventoryId && inventories.find(inv => inv.id == selectedInventoryId) && !isLoadingInventories && (
            <div className="mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                 <Boxes size={22} className="text-[#4A7B7A]" />
                 Items in: {inventories.find(inv => inv.id == selectedInventoryId)?.itemName}
              </h2>
            </div>
          )}
          {renderItemsTable()}
        </div>

        {/* --- 10. HIỂN THỊ CÁC MODAL --- */}
        {/* Modal Xóa Item */}
        {itemToDelete && (
          <ConfirmationModal
            title="Confirm Item Deletion"
            message={<>Are you sure you want to delete <strong className="text-gray-800">{itemToDelete.name}</strong>? This action cannot be undone.</>}
            onCancel={handleCancelDelete}
            onConfirm={handleConfirmDelete}
            isDeleting={isDeleting}
          />
        )}
        {/* Modal Sửa Item */}
        {itemToEdit && (
          <EditItemModal
            item={itemToEdit}
            onCancel={handleCancelEdit}
            onSave={handleSaveEdit}
            isSaving={isSaving}
          />
        )}
        {/* Modal Xóa Inventory */}
        {inventoryToDelete && (
           <ConfirmationModal
            title="Confirm Inventory Deletion"
            message={<>Are you sure you want to delete the entire inventory: <strong className="text-gray-800">{inventoryToDelete.itemName}</strong>? All items inside will also be deleted. This action cannot be undone.</>}
            onCancel={handleCancelDeleteInventory}
            onConfirm={handleConfirmDeleteInventory}
            isDeleting={isDeletingInventory}
          />
        )}
      </div>
    </div>
  );
}