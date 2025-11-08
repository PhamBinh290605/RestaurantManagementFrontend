import React, { useState } from "react";
import { Boxes, Loader2, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { apiCreateInventory } from "../../../../services/api";

// --- Các component Form con ---
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
    {...props}
    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm bg-gray-50/50
               text-gray-800 placeholder-gray-400
               transition-all duration-200 ease-in-out
               focus:outline-none focus:ring-2 focus:ring-[#4A7B7A]/80 focus:border-transparent focus:bg-white
               hover:border-gray-300
               disabled:bg-gray-200/50 disabled:cursor-not-allowed"
  />
);
// --- Hết component Form con ---

// --- 1. THAY ĐỔI: Trạng thái ban đầu chỉ cần itemName ---
const initialFormState = {
  itemName: "",
};

export default function CreateInventory() {
  const navigate = useNavigate(); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  // --- 2. THAY ĐỔI: Sử dụng state mới ---
  const [formData, setFormData] = useState(initialFormState);

  // Hàm xử lý khi nhập liệu (đã đơn giản hóa)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm xử lý khi submit form, gọi API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading('Creating new inventory...');

    // --- 3. THAY ĐỔI: Tạo payload đầy đủ để gửi đi ---
    const payload = {
      itemName: formData.itemName, // Lấy tên từ form
      quantity: 1,                 // Gán giá trị mặc định
      unit: "kg",                  // Gán giá trị mặc định
      minThreshold: 0              // Gán giá trị mặc định
    };

    try {
      // 4. THAY ĐỔI: Gửi payload đã tạo
      await apiCreateInventory(payload); 
      
      toast.success('Inventory created successfully!', { id: toastId });
      setFormData(initialFormState); // Reset form

    } catch (error) {
      console.error("Failed to create inventory:", error);
      
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
      setIsSubmitting(false); 
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

        {/* Form (đã xóa các trường) */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 md:p-10 rounded-xl shadow-xl space-y-6 border border-gray-100"
t>
          {/* Tên kho (chỉ giữ lại trường này) */}
          <div>
            <FormLabel htmlFor="itemName">Inventory Name</FormLabel>
            <FormInput
              id="itemName"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              placeholder="e.g., Kho Đồ Khô, Kho Nguyên Liệu..."
              required
              disabled={isSubmitting}
            />
          </div>

          {/* --- 5. THAY ĐỔI: Đã xóa 2 khối div cho quantity, unit, và minThreshold --- */}

          {/* Nút Submit */}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
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
                {isSubmitting ? "Saving..." : "Create Inventory"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}