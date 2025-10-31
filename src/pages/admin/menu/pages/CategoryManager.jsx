// src/pages/CategoryManager.js
import React, { Component } from 'react';
import axios from 'axios';
import { Edit, Trash2, Plus, Search } from 'lucide-react'; // Sử dụng icon từ lucide-react
import CategoryFormModal from '../components/CategoryFormModal';
import api from '../../../../../api';

class CategoryManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            loading: true,
            searchTerm: '',
            isModalOpen: false,
            currentCategory: null, // null = thêm mới, object = chỉnh sửa
        };
    }

    // --- Lifecycle Methods ---
    componentDidMount() {
        this.loadCategories();
    }

    // --- API Interaction Methods ---
    loadCategories = async () => {
        this.setState({ loading: true });
        try {
            const response = await api.get('/categories');
            this.setState({ categories: response.data.result || [], loading: false });
        } catch (error) {
            console.error("Lỗi khi tải danh mục:", error);
            this.setState({ loading: false });
            // Cân nhắc hiển thị thông báo lỗi cho người dùng
        }
    };

    handleSave = async (formData) => {
        const { currentCategory } = this.state;
        try {
            if (currentCategory) {
                await api.put(`/categories/${currentCategory.id}`, formData);
            } else {
                await api.post('/categories', formData);
                
            }
            this.closeModal();
            this.loadCategories(); // Tải lại dữ liệu sau khi lưu
        } catch (error) {
            console.error("Lỗi khi lưu danh mục:", error);
        }
    };

    handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            try {
                await api.delete(`/categories/${id}`);
                this.loadCategories(); // Tải lại dữ liệu sau khi xóa
            } catch (error) {
                console.error("Lỗi khi xóa danh mục:", error);
            }
        }
    };

    // --- UI Event Handlers ---
    handleAddNew = () => {
        this.setState({ currentCategory: null, isModalOpen: true });
    };

    handleEdit = (category) => {
        this.setState({ currentCategory: category, isModalOpen: true });
    };

    closeModal = () => {
        this.setState({ isModalOpen: false, currentCategory: null });
    };
    
    handleSearchChange = (event) => {
        this.setState({ searchTerm: event.target.value });
    };
    
    // --- Render Method ---
    render() {
        const { categories, loading, searchTerm, isModalOpen, currentCategory } = this.state;
        
        const filteredCategories = categories.filter(cat =>
            cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý danh mục</h1>

                {/* Thanh chức năng */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="relative w-full md:w-1/3">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="text-gray-400 h-5 w-5" />
                        </span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm danh mục..."
                            value={searchTerm}
                            onChange={this.handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={this.handleAddNew}
                        className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 w-full md:w-auto"
                    >
                        <Plus className="h-5 w-5" />
                        Thêm mới
                    </button>
                </div>

                {/* Bảng dữ liệu */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3">ID</th>
                                    <th scope="col" className="px-6 py-3">Hình ảnh</th>
                                    <th scope="col" className="px-6 py-3">Tên danh mục</th>
                                    <th scope="col" className="px-6 py-3">Mô tả</th>
                                    <th scope="col" className="px-6 py-3 text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center p-8">Đang tải dữ liệu...</td></tr>
                                ) : filteredCategories.length > 0 ? (
                                    filteredCategories.map((cat) => (
                                        <tr key={cat.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{cat.id}</td>
                                            <td className="px-6 py-4">
                                                <img src={cat.imageUrl} alt={cat.name} className="w-16 h-16 object-cover rounded-md" />
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-800">{cat.name}</td>
                                            <td className="px-6 py-4">{cat.description}</td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center items-center gap-4">
                                                    <button onClick={() => this.handleEdit(cat)} className="text-blue-600 hover:text-blue-800">
                                                        <Edit className="h-5 w-5" />
                                                    </button>
                                                    <button onClick={() => this.handleDelete(cat.id)} className="text-red-600 hover:text-red-800">
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5" className="text-center p-8">Không tìm thấy danh mục nào.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal Form */}
                <CategoryFormModal 
                    isOpen={isModalOpen} 
                    onClose={this.closeModal} 
                    onSave={this.handleSave} 
                    currentCategory={currentCategory} 
                />
            </div>
        );
    }
}

export default CategoryManager;