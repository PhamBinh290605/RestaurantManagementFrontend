import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, UtensilsCrossed, Search, X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../utils/router';
import api from '../../../../api';

// --- CẤU HÌNH ---
const ITEMS_PER_PAGE = 8; // Đặt số lượng sản phẩm hiển thị trên mỗi trang

// const getMockData = () => ({
//     result: [
//         { id: 1, productName: "Salad Rau Củ Tươi", description: "Salad trộn với dầu giấm và các loại rau củ tươi ngon.", price: 89.00, isAvailable: true, categoryName: "Món khai vị", imageUrls: [{ url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800" }] },
//         { id: 2, productName: "Bít tết bò Mỹ", description: "Bít tết bò Mỹ hảo hạng dùng kèm khoai tây chiên.", price: 250.00, isAvailable: true, categoryName: "Món chính", imageUrls: [{ url: "https://images.unsplash.com/photo-1546964124-0cce460f38ef?q=80&w=800" }] },
//         { id: 3, productName: "Cá hồi áp chảo", description: "Cá hồi Na-uy tươi ngon áp chảo, ăn kèm măng tây.", price: 180.00, isAvailable: false, categoryName: "Món chính", imageUrls: [{ url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800" }] },
//         { id: 4, productName: "Pizza Hải Sản", description: "Pizza đế mỏng giòn rụm với tôm, mực, và phô mai.", price: 155.00, isAvailable: true, categoryName: "Món Ý", imageUrls: [{ url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800" }] },
//         { id: 5, productName: "Tiramisu", description: "Bánh tráng miệng Tiramisu cổ điển của Ý.", price: 75.00, isAvailable: true, categoryName: "Tráng miệng", imageUrls: [{ url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=800" }] },
//         { id: 6, productName: "Trà Chanh", description: "Thức uống giải nhiệt sảng khoái từ trà và chanh tươi.", price: 30.00, isAvailable: false, categoryName: "Thức uống", imageUrls: [{ url: "https://images.unsplash.com/photo-1556745753-b2904692b3cd?q=80&w=800" }] },
//         { id: 7, productName: "Spaghetti Carbonara", description: "Mỳ Ý sốt kem trứng và thịt heo xông khói.", price: 125.00, isAvailable: true, categoryName: "Món Ý", imageUrls: [{ url: "https://images.unsplash.com/photo-1621996346565-e326b20f545c?q=80&w=800" }] },
//         { id: 8, productName: "Cà Phê Sữa Đá", description: "Hương vị cà phê đậm đà hòa quyện với sữa đặc.", price: 25.00, isAvailable: true, categoryName: "Thức uống", imageUrls: [{ url: "https://images.unsplash.com/photo-1551030173-1a29ab268945?q=80&w=800" }] },
//         { id: 9, productName: "Gỏi cuốn tôm thịt", description: "Món khai vị truyền thống Việt Nam, tươi mát và bổ dưỡng.", price: 60.00, isAvailable: true, categoryName: "Món khai vị", imageUrls: [{ url: "https://images.unsplash.com/photo-1625944230153-a58f09076044?q=80&w=800" }] },
//         { id: 10, productName: "Phở Bò", description: "Món ăn quốc hồn quốc túy của Việt Nam với nước dùng đậm đà.", price: 50.00, isAvailable: true, categoryName: "Món chính", imageUrls: [{ url: "https://images.unsplash.com/photo-1583218965038-532a79472344?q=80&w=800" }] },
//         { id: 11, productName: "Bánh Mì Kẹp", description: "Bánh mì giòn rụm kẹp thịt, pate và rau thơm.", price: 20.00, isAvailable: false, categoryName: "Món chính", imageUrls: [{ url: "https://images.unsplash.com/photo-1592415486689-86f768ce3723?q=80&w=800" }] },
//         { id: 12, productName: "Panna Cotta", description: "Món tráng miệng mềm mịn, béo ngậy từ Ý.", price: 65.00, isAvailable: true, categoryName: "Tráng miệng", imageUrls: [{ url: "https://images.unsplash.com/photo-1542383232-243365825310?q=80&w=800" }] },
//     ]
// });


// --- COMPONENT CON: CARD SKELETON (HIỆU ỨNG CHỜ TẢI) ---
const CardSkeleton = () => (
    <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md">
        <div className="aspect-video w-full animate-pulse bg-gray-200"></div>
        <div className="p-4">
            <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200"></div>
            <div className="mt-2 h-4 w-full animate-pulse rounded bg-gray-200"></div>
            <div className="mt-1 h-4 w-5/6 animate-pulse rounded bg-gray-200"></div>
            <div className="mt-4 flex items-center justify-between">
                <div className="h-8 w-1/3 animate-pulse rounded bg-gray-200"></div>
                <div className="h-6 w-1/4 animate-pulse rounded bg-gray-200"></div>
            </div>
        </div>
        <div className="h-12 animate-pulse bg-gray-50 border-t border-gray-200"></div>
    </div>
);

// --- COMPONENT CON: CARD MÓN ĂN ---
const MenuItemCard = ({ item }) => {
    const navigate = useNavigate();
    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value * 1000);

    const handleEdit = () => {
        const editUrl = ROUTERS.ADMIN.EDIT_MENU_ITEM.replace(':itemId', item.id);
        navigate(editUrl);
    }

    return (
        <div className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative">
                <img
                    src={item.images[0]?.url || 'https://placehold.co/600x400?text=No+Image'}
                    alt={item.productName}
                    className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-3 right-3 rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-800">
                    {item.categoryName}
                </span>
            </div>
            <div className="flex flex-1 flex-col p-4">
                <h3 className="text-lg font-bold text-gray-800">{item.productName}</h3>
                <p className="mt-1 flex-grow text-sm text-gray-600 line-clamp-2">{item.description}</p>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-extrabold text-indigo-600">{formatCurrency(item.price)}</span>
                    <span className={`rounded-md px-2 py-1 text-xs font-bold uppercase tracking-wider ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.isAvailable ? 'Còn hàng' : 'Hết hàng'}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-px border-t border-gray-200 bg-gray-50">
                <button onClick={handleEdit} className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600">
                    <Pencil size={16} /> Edit
                </button>
                <button className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600">
                    <Trash2 size={16} /> Delete
                </button>
            </div>
        </div>
    );
};

// --- COMPONENT CON: TRẠNG THÁI TRỐNG ---
const EmptyState = ({ onClearFilters }) => (
    <div className="col-span-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-24 text-center">
        <UtensilsCrossed className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Không tìm thấy món ăn nào</h3>
        <p className="mt-1 text-sm text-gray-500">Hãy thử thay đổi từ khoá tìm kiếm hoặc bộ lọc.</p>
        <button
            onClick={onClearFilters}
            type="button"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
            <X size={18} />
            Xoá bộ lọc
        </button>
    </div>
);

// --- COMPONENT MỚI: THANH LỌC ---
const FilterBar = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, categoryFilter, setCategoryFilter, uniqueCategories }) => {
    return (
        <div className="mb-6 space-y-4 md:flex md:items-center md:justify-between md:space-y-0 md:space-x-4">
            {/* Search Input */}
            <div className="relative flex-grow">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Tìm theo tên món..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full rounded-md border-gray-300 py-2 pl-10 pr-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                )}
            </div>
            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:flex md:items-center md:gap-4">
                <div className="relative w-full md:w-48">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full appearance-none rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                        <option value="all">Tất cả trạng thái</option>
                        <option value="available">Còn hàng</option>
                        <option value="unavailable">Hết hàng</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>
                <div className="relative w-full md:w-48">
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full appearance-none rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                        {uniqueCategories.map(category => (
                            <option key={category} value={category}>{category === 'all' ? 'Tất cả danh mục' : category}</option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>
            </div>
        </div>
    );
}

// --- COMPONENT MỚI: PHÂN TRANG ---
const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-700">
                Đang hiển thị <span className="font-medium">{startItem}</span> - <span className="font-medium">{endItem}</span> trên <span className="font-medium">{totalItems}</span> kết quả
            </p>
            <div className="inline-flex items-center -space-x-px rounded-md text-sm">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-2 rounded-l-md border border-gray-300 bg-white px-3 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <ChevronLeft size={16} />
                    <span>Trước</span>
                </button>
                <span className="border-y border-gray-300 bg-white px-4 py-2 font-medium text-gray-700">
                    Trang {currentPage} / {totalPages}
                </span>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-2 rounded-r-md border border-gray-300 bg-white px-3 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <span>Tiếp</span>
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};


// --- COMPONENT CHÍNH: TRANG QUẢN LÝ MENU ---
const MenuPage = () => {
    const [allMenuItems, setAllMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1); // State cho trang hiện tại
    const navigate = useNavigate();
    

    // --- Data Fetching ---
    useEffect(() => {
        const fetchMenuItems = async () => {
            setLoading(true);
            try {
                // --- CHỖ ĐỂ TÍCH HỢP API THẬT ---
                const res = await api.get('/menuitems');
                setAllMenuItems(res.data.result);

                // const data = getMockData();
                // setAllMenuItems(res.data.result);

            } catch (error) {
                toast.error("Tải dữ liệu thất bại.");
            } finally {
                setLoading(false);
            }
        };
        fetchMenuItems();
    }, []);

    // --- Lọc và tìm kiếm dữ liệu (Tối ưu bằng useMemo) ---
    const filteredMenuItems = useMemo(() => {
        return allMenuItems.filter(item => {
            const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || (statusFilter === 'available' ? item.isAvailable : !item.isAvailable);
            const matchesCategory = categoryFilter === 'all' || item.categoryName === categoryFilter;
            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [allMenuItems, searchTerm, statusFilter, categoryFilter]);

    // --- Lấy danh sách danh mục duy nhất ---
    const uniqueCategories = useMemo(() => ['all', ...new Set(allMenuItems.map(item => item.categoryName))], [allMenuItems]);

    // --- Tự động reset về trang 1 khi bộ lọc thay đổi ---
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, categoryFilter]);

    // --- Logic Phân trang (Tối ưu bằng useMemo) ---
    const totalPages = Math.ceil(filteredMenuItems.length / ITEMS_PER_PAGE);
    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredMenuItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, filteredMenuItems]);


    const handleClearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setCategoryFilter('all');
    };

    // --- Render Logic ---
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-screen-xl">
                {/* Header */}
                <header className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Menu</h1>
                        <p className="mt-1 text-sm text-gray-600">Quản lý các món ăn trong thực đơn của bạn.</p>
                    </div>
                    <button onClick={() => navigate(ROUTERS.ADMIN.ADD_MENU_ITEM)} type="button" className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700">
                        <Plus size={18} /> Thêm món mới
                    </button>
                </header>

                <FilterBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                    uniqueCategories={uniqueCategories}
                />

                {/* Main Content Grid */}
                <main>
                    {loading ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <CardSkeleton key={i} />)}
                        </div>
                    ) : paginatedItems.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {paginatedItems.map(item => <MenuItemCard key={item.id} item={item} />)}
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                totalItems={filteredMenuItems.length}
                                itemsPerPage={ITEMS_PER_PAGE}
                            />
                        </>
                    ) : (
                        <EmptyState onClearFilters={handleClearFilters} />
                    )}
                </main>
            </div>
        </div>
    );
};


export default MenuPage;