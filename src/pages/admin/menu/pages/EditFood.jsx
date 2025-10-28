import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import MenuItemForm from '../components/MenuItemForm';
import { Edit, AlertCircle } from 'lucide-react';
import api from '../../../../../api';

// --- GIẢ LẬP CÁC HÀM GỌI API ---

// Giả lập API để lấy chi tiết một món ăn
const fetchMenuItemAPI = async (itemId) => {
    console.log(`Fetching data for item ID: ${itemId}`);

    // Giả lập trường hợp không tìm thấy
    if (itemId === null || itemId === undefined || itemId === '0') {
        throw new Error('Item not found');
    }

    const response = await api.get(`/menuitems/${itemId}`);
    console.log("Fetched item data:", response.data.result);
    return response.data.result;

    // // Giả lập dữ liệu trả về thành công
    // return {
    //     productName: 'Spaghetti Carbonara (Fetched)',
    //     description: 'Classic Italian pasta with creamy egg sauce, pancetta, and parmesan cheese.',
    //     price: '145.00',
    //     categoryName: 'Món Ý',
    //     isAvailable: true,
    //     // Dữ liệu ảnh cần có định dạng mà ImageUploader có thể hiểu
    //     images: [
    //         { preview: 'https://images.unsplash.com/photo-1621996346565-e326b20f545c?q=80&w=800', isFeatured: true },
    //         { preview: 'https://images.unsplash.com/photo-1555949258-a2aa4d4e1bad?q=80&w=800', isFeatured: false },
    //     ]
    // };
};

// Giả lập API để cập nhật món ăn
const updateMenuItemAPI = async (itemId, formData) => {
    console.log(`Updating item ID: ${itemId} with data:`, formData);
    await new Promise(res => setTimeout(res, 1000));
    return { success: true, data: { id: itemId, ...formData } };
};



const EditMenuItemPage = () => {
    const { itemId } = useParams(); 
    const navigate = useNavigate();

    const [initialData, setInitialData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadMenuItem = async () => {
            try {
                setIsLoading(true);
                const data = await fetchMenuItemAPI(itemId);
                setInitialData(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch menu item data.');
                toast.error('Could not load item details.');
            } finally {
                setIsLoading(false);
            }
        };
        loadMenuItem();
    }, [itemId]);

    const handleUpdate = async (formData) => {
        setIsSaving(true);
        const promise = updateMenuItemAPI(itemId, formData);

        toast.promise(promise, {
            loading: 'Saving changes...',
            success: (res) => {
                navigate('/admin/menu'); // Chuyển hướng về trang danh sách
                return `Successfully updated "${res.data.productName}"!`;
            },
            error: 'Failed to save changes. Please try again.',
            finally: () => {
                setIsSaving(false);
            }
        });
    };
    
    const renderContent = () => {

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-red-300 bg-red-50 py-24 text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
                    <h3 className="mt-2 text-lg font-medium text-red-900">Error Loading Data</h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
            );
        }

        if (initialData) {
             return (
                <MenuItemForm
                    initialData={initialData}
                    onSubmit={handleUpdate}
                    isSaving={isSaving}
                />
            );
        }
        
        return null;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-screen-xl">
                {/* Header */}
                <header className="mb-8 border-b border-gray-200 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                            <Edit className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                {initialData?.productName ? `Edit: ${initialData.productName}` : 'Edit Menu Item'}
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">Update the details for this menu item below.</p>
                        </div>
                    </div>
                </header>
                
                {renderContent()}
            </div>
        </div>
    );
};

export default EditMenuItemPage;