import React, { useState, useEffect } from "react";
import { PackagePlus, Loader2, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { apiGetInventories, apiAddItemToInventory } from "../../../../services/api";

// --- Các component Form con ---
const FormInput = ({ id, name, value, onChange, placeholder, type = "text", required = false, step = null, min = null, ...props }) => ( // Thêm min prop
  <input type={type} id={id} name={name} value={value} onChange={onChange} placeholder={placeholder} step={step} min={min} required={required} {...props} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm bg-gray-50/50 text-gray-800 placeholder-gray-400 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#4A7B7A]/80 focus:border-transparent focus:bg-white hover:border-gray-300 disabled:bg-gray-200/50 disabled:cursor-not-allowed" />
);
const FormSelect = ({ id, name, value, onChange, children, required = false, ...props }) => (
  <select id={id} name={name} value={value} onChange={onChange} required={required} {...props} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm bg-gray-50/50 text-gray-800 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#4A7B7A]/80 focus:border-transparent focus:bg-white hover:border-gray-300 disabled:bg-gray-200/50 disabled:cursor-not-allowed">
    {children}
  </select>
);
const FormLabel = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-semibold text-gray-700 mb-2">{children}</label>
);
// --- Hết component Form con ---

const availableUnits = ["kg", "g", "ml", "l", "pcs", "pack"];

const initialItemState = {
  name: "",
  quantity: 0, // Đã là số nguyên
  unit: availableUnits[0],
};

export default function AddItemInventory() {
  const navigate = useNavigate();
  const [inventories, setInventories] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    inventoryId: "",
    ...initialItemState,
  });

  useEffect(() => {
    const loadInventories = async () => {
      setIsLoadingList(true);
      try {
        const response = await apiGetInventories();
        setInventories(response.data); 
        if (response.data.length > 0) {
          setFormData(prev => ({ ...prev, inventoryId: response.data[0].id }));
        }
      } catch (error) {
        console.error("Failed to load inventories:", error);
        toast.error("Failed to load inventory list.");
      } finally {
        setIsLoadingList(false);
      }
    };
    loadInventories();
  }, []); 

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      // --- THAY ĐỔI: Dùng parseInt cho quantity ---
      [name]: name === 'quantity' ? parseInt(value, 10) || 0 : (type === "number" ? parseFloat(value) || 0 : value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const itemData = {
      name: formData.name,
      quantity: formData.quantity, // Đã là số nguyên do hàm handleChange
      unit: formData.unit,
    };

    const toastId = toast.loading('Adding item...');

    try {
      await apiAddItemToInventory(formData.inventoryId, itemData);
      toast.success('Item added successfully!', { id: toastId }); 
      
      setFormData(prev => ({
        ...prev,
        ...initialItemState
      }));

    } catch (error) {
      console.error("Failed to add item:", error);
      let errorMessage = "An unexpected error occurred.";
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-full">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-gradient-to-r from-[#E8F3F2] to-[#D9EFEE] rounded-xl shadow-sm">
              <PackagePlus className="text-[#4A7B7A]" size={28} />
            </span>
            <h1 className="text-3xl font-bold text-gray-900">
              Add Item to Inventory
            </h1>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 md:p-10 rounded-xl shadow-xl space-y-6 border border-gray-100"
        >
          {/* --- Phần Select Inventory --- */}
          <div>
            <FormLabel htmlFor="inventoryId">Select Inventory</FormLabel>
            {isLoadingList ? (
              <div className="w-full h-[46px] bg-gray-200 rounded-lg animate-pulse"></div>
            ) : (
              <FormSelect
                id="inventoryId"
                name="inventoryId"
                value={formData.inventoryId}
                onChange={handleChange}
                required
                disabled={isSubmitting} 
              >
                <option value="" disabled>-- Choose an inventory --</option>
                {inventories.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.itemName}
                  </option>
                ))}
              </FormSelect>
            )}
          </div>

          {/* --- Phần Item Name --- */}
          <div>
            <FormLabel htmlFor="name">Item Name</FormLabel>
            <FormInput
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Thịt Bò, Cà Chua..."
              required
              disabled={isSubmitting}
            />
          </div>

          {/* --- Phần Quantity & Unit --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormLabel htmlFor="quantity">Quantity</FormLabel>
              <FormInput
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0" // Đổi placeholder
                // --- THAY ĐỔI: Xóa step và thêm min ---
                min="0" // Ngăn số âm
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <FormLabel htmlFor="unit">Unit</FormLabel>
              <FormSelect
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              >
                {availableUnits.map((unitOption) => (
                  <option key={unitOption} value={unitOption}>
                    {unitOption}
                  </option>
                ))}
              </FormSelect>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 -mt-2 pb-2">
            Nếu tên vật phẩm đã tồn tại, hệ thống sẽ tự động cộng dồn số lượng.
          </p>

          {/* --- Nút Submit --- */}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting || isLoadingList} 
              className="px-8 py-3 flex items-center justify-center gap-2.5 bg-[#4A7B7A] text-white font-semibold rounded-lg shadow-md 
                         hover:bg-[#3A6B6A] hover:shadow-lg
                         focus:outline-none focus:ring-2 focus:ring-[#4A7B7A] focus:ring-offset-2 
                         transition-all duration-300 ease-in-out
                         disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Save size={20} />
              )}
              <span>
                {isSubmitting ? "Saving..." : "Save Item"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}