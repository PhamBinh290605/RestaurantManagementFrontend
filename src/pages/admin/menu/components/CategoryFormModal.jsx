import React, { useState, useEffect } from 'react';

const CategoryFormModal = ({ isOpen, onClose, onSave, currentCategory }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (currentCategory) {
            setName(currentCategory.name || '');
            setDescription(currentCategory.description || '');
            setPreview(currentCategory.imageUrl || null);
        } else {
            setName('');
            setDescription('');
            setPreview(null);
        }
    }, [currentCategory, isOpen]); 

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        if (image) {
            formData.append('imageFile', image);
        }
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md z-50">
                <h2 className="text-2xl font-bold mb-4">{currentCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Tên danh mục</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">Mô tả</label>
                        <textarea
                            id="description"
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            required
                        />
                    </div>
                    <div className="mb-4">
                         <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900">Hình ảnh</label>
                         <input type="file" id="image" onChange={handleImageChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" accept="image/*" />
                         {preview && <img src={preview} alt="Xem trước" className="mt-4 w-24 h-24 object-cover rounded-lg"/>}
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">
                            Hủy
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryFormModal;