import React, { useState } from "react";
import { Boxes, Loader2, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { apiCreateInventory } from "../../../../services/api";

// --- Các component Form con để tái sử dụng ---
const FormLabel = ({ htmlFor, children }) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-semibold text-gray-700 mb-2"
  >
    {children}
  </label>
);

const FormInput = ({ id, name, value, onChange, placeholder, type = "text", required = false, step = null, ...props }) => (
  <input
    type={type}
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    step={step}
    required={required}
    {...props} // Truyền các props khác như 'disabled'
    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm bg-gray-50/50
               text-gray-800 placeholder-gray-400
               transition-all duration-200 ease-in-out
               focus:outline-none focus:ring-2 focus:ring-[#4A7B7A]/80 focus:border-transparent focus:bg-white
               hover:border-gray-300
               disabled:bg-gray-200/50 disabled:cursor-not-allowed"
  />
);
// --- Hết component Form con ---

// --- 1. THAY ĐỔI: Tạo một biến chứa trạng thái ban đầu của form ---
const initialFormState = {
  itemName: "",
  quantity: 0,
  unit: "",
  minThreshold: 0,
};

export default function CreateInventory() {
  const navigate = useNavigate(); // Vẫn giữ navigate nếu bạn cần dùng ở chỗ khác
  const [isSubmitting, setIsSubmitting] = useState(false);
  // --- 2. THAY ĐỔI: Sử dụng biến trạng thái ban đầu ---
  const [formData, setFormData] = useState(initialFormState);

  // Hàm xử lý khi nhập liệu
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Chuyển đổi giá trị sang số nếu type là 'number'
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  // Hàm xử lý khi submit form, gọi API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading('Creating new inventory...');

    try {
      // 1. Gọi hàm API từ file api.js
      await apiCreateInventory(formData);
      
      // 2. Thông báo thành công
      toast.success('Inventory created successfully!', { id: toastId });

      // --- 3. THAY ĐỔI: Reset form về trạng thái ban đầu thay vì chuyển trang ---
      setFormData(initialFormState);

      /* (Đã vô hiệu hóa đoạn code chuyển trang)
      setTimeout(() => {
        navigate('/admin/inventory'); 
      }, 1000);
      */

    } catch (error) {
      console.error("Failed to create inventory:", error);
      
      // Xử lý lỗi (hiển thị lỗi từ backend nếu có)
      let errorMessage = "An unexpected error occurred.";
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } 
        else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      toast.error(errorMessage, { id: toastId });
      
    } finally {
      setIsSubmitting(false); // Luôn dừng loading
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-full">
      <div className="max-w-4xl mx-auto">
        
        {/* Tiêu đề trang */}
        <div className="flex items-center gap-3 mb-8">
          <span className="p-2.5 bg-gradient-to-r from-[#E8F3F2] to-[#D9EFEE] rounded-xl shadow-sm">
            <Boxes className="text-[#4A7B7A]" size={28} />
          </span>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Inventory
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 md:p-10 rounded-xl shadow-xl space-y-6 border border-gray-100"
        >
          {/* Tên kho */}
          <div>
            <FormLabel htmlFor="itemName">Inventory Name</FormLabel>
            <FormInput
              id="itemName"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              placeholder="e.g., Kho Đồ Khô, Kho Nguyên Liệu..."
              required
              disabled={isSubmitting} // Vô hiệu hóa khi đang submit
            />
          </div>

          {/* Số lượng & Đơn vị */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormLabel htmlFor="quantity">Initial Quantity</FormLabel>
              <FormInput
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                step="0.01"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <FormLabel htmlFor="unit">Unit</FormLabel>
              <FormInput
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="e.g., kg, pcs, liter"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Ngưỡng tối thiểu */}
          <div>
            <FormLabel htmlFor="minThreshold">Minimum Threshold</FormLabel>
            <FormInput
              type="number"
              id="minThreshold"
              name="minThreshold"
              value={formData.minThreshold}
              onChange={handleChange}
              step="0.01"
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
SỐ lượng tối thiểu để hệ thống cảnh báo bạn nhập hàng.
            </p>
          </div>

          {/* Nút Submit */}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting} // Nút bị vô hiệu hóa khi đang submit
              className="px-8 py-3 flex items-center justify-center gap-2.5 bg-[#4A7B7A] text-white font-semibold rounded-lg shadow-md 
          C            hover:bg-[#3A6B6A] hover:shadow-lg
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
                {isSubmitting ? "Saving..." : "Create Inventory"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
