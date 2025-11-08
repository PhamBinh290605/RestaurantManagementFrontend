import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from './ImageUploader';
import { NotebookText, Settings, Save, XCircle } from 'lucide-react';

const Label = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
        {children}
    </label>
);

const RequiredIndicator = () => <span className="text-red-500 ml-1">*</span>;

const MenuItemForm = ({ initialData, onSubmit, isSaving, categories = [], isCategoriesLoading = false }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        productName: '',
        description: '',
        price: '',
        categoryName: '',
        isAvailable: true,
        images: []
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                productName: initialData.productName || '',
                description: initialData.description || '',
                price: initialData.price || '',
                categoryName: initialData.categoryName || '',
                isAvailable: initialData.isAvailable !== undefined ? initialData.isAvailable : true,
                images: initialData.images || []
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };
    
    const handleImageChange = (images) => {
        setFormData(prev => ({ ...prev, images }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.productName || !formData.price || !formData.categoryName) {
            toast.error("Please fill in all required fields: Name, Price, and Category.") ;
            return;
        }
        if (formData.images.length === 0) {
            toast.error("Please upload at least one image.");
            return;
        }
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* --- CỘT TRÁI: THÔNG TIN CHÍNH & HÌNH ẢNH --- */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Card chi tiết sản phẩm */}
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div className="flex items-center gap-3 border-b border-gray-200 p-4">
                            <NotebookText className="h-6 w-6 text-indigo-600" />
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Item Details</h3>
                        </div>
                        <div className="p-4 space-y-6">
                            <div>
                                <Label htmlFor="productName">Product Name <RequiredIndicator /></Label>
                                <input type="text" name="productName" id="productName" value={formData.productName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                                <p className="mt-2 text-xs text-gray-500">The public name of the menu item.</p>
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                                <p className="mt-2 text-xs text-gray-500">A brief description of the item. This will be shown on the menu.</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* SỬA LỖI: Truyền `initialImages` xuống ImageUploader */}
                    <ImageUploader onImagesChange={handleImageChange} initialImages={formData.images} />
                </div>
                
                {/* --- CỘT PHẢI: TỔ CHỨC & CÀI ĐẶT --- */}
                <div className="space-y-6 lg:col-span-1">
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div className="flex items-center gap-3 border-b border-gray-200 p-4">
                            <Settings className="h-6 w-6 text-indigo-600" />
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Organization</h3>
                        </div>
                        <div className="p-4 space-y-6">
                            <div>
                                <Label htmlFor="price">Price<RequiredIndicator /></Label>
                                <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required step="0.01" min="0"/>
                                <p className="mt-2 text-xs text-gray-500">Set the price for this item.</p>
                            </div>
                            <div>
                                <Label htmlFor="categoryName">Category<RequiredIndicator /></Label>
                                <select id="categoryName" name="categoryName" value={formData.categoryName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100" required disabled={isCategoriesLoading}>
                                    <option value="" disabled>{isCategoriesLoading ? 'Loading...' : 'Select a category'}</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.name}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="relative flex items-start pt-4">
                                <div className="flex h-5 items-center">
                                    <input id="isAvailable" name="isAvailable" type="checkbox" checked={formData.isAvailable} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600"/>
                                </div>
                                <div className="ml-3 text-sm">
                                    <Label htmlFor="isAvailable">Available for sale</Label>
                                    <p className="text-gray-500">When checked, this item will be visible on your menu.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- NÚT HÀNH ĐỘNG --- */}
            <div className="flex justify-end gap-4 border-t border-gray-200 pt-6">
                <button 
                    type="button" 
                    onClick={() => navigate(-1)} // Quay lại trang trước
                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                    <XCircle size={18} />
                    Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={isSaving} 
                    className="inline-flex items-center gap-2 justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                >
                    <Save size={18} />
                    {isSaving ? 'Saving...' : 'Save Product'}
                </button>
            </div>
        </form>
    );
};

export default MenuItemForm;