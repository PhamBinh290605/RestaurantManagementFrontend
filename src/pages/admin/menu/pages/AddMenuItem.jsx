import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you use react-router-dom
import { toast } from 'sonner';
import MenuItemForm from '../components/MenuItemForm';
import { ChefHat } from 'lucide-react';
import { ROUTERS } from '../../../../utils/router';
import api from '../../../../../api';

// Giả lập một hàm gọi API
const createMenuItemAPI = async (formData) => {
    console.log("Submitting to API:", formData);

    // Tách ảnh đại diện và ảnh thư viện
    const featuredImage = formData.images.find(img => img.isFeatured);
    const galleryImages = formData.images.filter(img => !img.isFeatured);

    console.log("Featured Image File:", featuredImage?.file);
    console.log("Gallery Image Files:", galleryImages.map(img => img.file));

    // Trong thực tế, bạn sẽ dùng FormData để gửi file lên server
    const apiFormData = new FormData();


    apiFormData.append('productName', formData.productName);
    apiFormData.append('description', formData.description);
    apiFormData.append('price', formData.price);
    apiFormData.append('categoryName', formData.categoryName);
    apiFormData.append('isAvailable', formData.isAvailable);

    if (featuredImage) {
        apiFormData.append('featuredImage', featuredImage.file);
    }
    galleryImages.forEach(img => {
        apiFormData.append('galleryImages', img.file);
    });

    const response = await api.post('/menuitems', apiFormData);


    // Giả lập thành công
    return response.data.result;
};

const fetchCategoriesAPI = async () => {
    const response = await api.get('/categories');
    console.log("Fetched categories:", response.data.result);
    return response.data.result;
}


const AddMenuItemPage = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

    const navigate = useNavigate();
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const fetchedCategories = await fetchCategoriesAPI();
                setCategories(fetchedCategories);
            } catch (error) {
                toast.error("Could not load categories. Please try again later.");
            } finally {
                setIsCategoriesLoading(false);
            }
        };
        loadCategories();
    }, []);


    const handleSave = async (formData) => {
        setIsSaving(true);
        const promise = createMenuItemAPI(formData);

        toast.promise(promise, {
            loading: 'Adding new item to the menu...',
            success: (res) => {
                // Giả sử API trả về dữ liệu món ăn đã tạo
                navigate(ROUTERS.ADMIN.MENU_MANAGEMENT); // Chuyển hướng về trang quản lý menu
                return `Successfully added "${res.data.productName}"!`;
            },
            error: 'Failed to add item. Please try again.',
            finally: () => {
                setIsSaving(false);
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-screen-xl">
                {/* Header */}
                <header className="mb-8 border-b border-gray-200 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                            <ChefHat className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Add New Menu Item</h1>
                            <p className="mt-1 text-sm text-gray-600">Fill in the details below to add a new item to your menu.</p>
                        </div>
                    </div>
                </header>

                {/* Form Component */}
                <MenuItemForm
                    onSubmit={handleSave}
                    isSaving={isSaving}
                    categories={categories}
                    isCategoriesLoading={isCategoriesLoading}
                // initialData không cần thiết cho trang Add
                />
            </div>
        </div>
    );
};

export default AddMenuItemPage;