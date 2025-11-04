import React, { useEffect, useState } from "react";
import {
    Search,
    Plus,
    User,
    Phone,
    Clock,
    Users,
    MapPin,
    Check,
    X,
    Edit,
    CheckSquare,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import api from "../../../../api";


/* DANH SÁCH BÀN (ví dụ) */
const ALL_TABLES = [
    "Bàn 1",
    "Bàn 2",
    "Bàn 3",
    "Bàn 4",
    "Bàn 5",
    "Bàn 6",
    "Bàn VIP 1",
    "Bàn VIP 2",
];

export default function BookingManagement() {
    const [bookings, setBookings] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [filterStatus, setFilterStatus] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [showTableModalFor, setShowTableModalFor] = useState(null); // booking object
    const [showCheckinModalFor, setShowCheckinModalFor] = useState(null);
    const [showCancelModalFor, setShowCancelModalFor] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [availableTables, setAvailableTables] = useState([]);

    useEffect(() => {
        loadBookings();
    }, []);

    const fetchAvailableTables = async (arrivalTime) => {
        try {
            const res = await api.get("/tables/available", { params: { datetime: arrivalTime } });

            const tableNumbers = res.data?.result?.map((t) => t.tableNumber) || [];

            setAvailableTables(tableNumbers);
            console.log("Danh sách bàn khả dụng:", tableNumbers);
        } catch (err) {
            console.error(err);
            toast.error("Tải danh sách bàn trống thất bại");
        }
    };

    // =========== Fetch data (mock) ===========
    const loadBookings = async () => {
        try {
            const res = await api.get("/reservations");
            console.log("Fetched bookings:", res.data.result);
            setBookings(res.data.result);
            setFiltered(res.data.result);
        } catch (err) {
            console.error(err);
            toast.error("Tải danh sách đặt bàn thất bại");
        }
    };

    // =========== search & filter ===========
    useEffect(() => {
        let data = [...bookings];
        if (filterStatus !== "All") {
            data = data.filter((b) => b.status === filterStatus);
        }
        if (searchTerm.trim()) {
            data = data.filter(
                (b) =>
                    b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    b.customerPhone.includes(searchTerm)
            );
        }
        setFiltered(data);
    }, [searchTerm, filterStatus, bookings]);

    // =========== update booking status (mock + API TODO) ===========
    const patchBookingStatus = async (id, newStatus) => {
        const loader = toast.loading(`Cập nhật trạng thái...`);
        try {
            // TODO: uncomment when API ready
            // await axios.patch(`/bookings/${id}`, { status: newStatus });

            // mock update local state
            setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));

            toast.success(`Cập nhật thành công`, { id: loader });
        } catch (err) {
            console.error(err);
            toast.error("Có lỗi xảy ra", { id: loader });
        }
    };

    const confirmBooking = async (id, data) => {
        try {
            console.log("Confirming booking with data:", data);
            await api.post(`/reservations/confirm/${id}`, { ...data });
            toast.success("Booking confirmed successfully");
            setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "Confirmed" } : b)));

        } catch (error) {
            console.error("Error confirming booking:", error);
        }


    };

    // =========== update tables for a booking ===========
    const patchBookingTables = async (booking) => {
    const loader = toast.loading("Cập nhật bàn...");
    try {
        console.log("Updating tables for booking:", booking);
        await api.put(`/reservations/update-tables/${booking.id}`, booking);
        setBookings((prev) =>
            prev.map((b) => (b.id === booking.id ? booking : b))
        );
        toast.success("Cập nhật bàn thành công", { id: loader });
    } catch (err) {
        console.error(err);
        toast.error("Cập nhật bàn thất bại", { id: loader });
    }
};


    // =========== create booking ===========
    const createBooking = async (payload) => {
        const loader = toast.loading("Tạo đơn...");
        try {
            // TODO: const res = await axios.post('/bookings', payload); setBookings(prev => [res.data, ...prev]);
            const newBooking = { id: Date.now(), ...payload };
            setBookings((prev) => [newBooking, ...prev]);
            toast.success("Tạo đơn thành công", { id: loader });
        } catch (err) {
            console.error(err);
            toast.error("Tạo đơn thất bại", { id: loader });
        }
    };

    // UI helpers
    const statusClass = (s) =>
        s === "Pending"
            ? "bg-yellow-100 text-yellow-800"
            : s === "Confirmed"
                ? "bg-green-100 text-green-800"
                : s === "Occupied"
                    ? "bg-blue-100 text-blue-800"
                    : s === "Canceled"
                        ? "bg-red-100 text-red-800"
                        : "";

    // Filter buttons
    const FILTERS = ["All", "Pending", "Confirmed", "Occupied", "Canceled"];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 p-8">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-sky-600">Quản lý Đặt bàn</h2>
                    <p className="text-sm text-slate-500 mt-1">Quản lý yêu cầu đặt bàn — tìm kiếm, chọn bàn, check-in, hủy</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow"
                    >
                        <Plus size={16} /> Tạo đơn đặt bàn
                    </button>
                </div>
            </div>

            {/* Search + Filters */}
            <div className="bg-white rounded-2xl shadow p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="p-3 bg-slate-100 rounded-lg">
                            <Search size={18} className="text-slate-400" />
                        </div>
                        <input
                            className="flex-1 border-none outline-none text-sm"
                            placeholder="Tìm theo tên hoặc số điện thoại..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="hidden md:block text-sm text-slate-400">Tìm kiếm nhanh</div>
                    </div>

                    <div className="flex gap-2 items-center">
                        {FILTERS.map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilterStatus(f)}
                                className={`px-3 py-2 rounded-lg text-sm ${filterStatus === f ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table list */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
                <div className="px-6 py-4 border-b">
                    <div className="text-sm text-slate-500">Danh sách đơn đặt bàn</div>
                </div>

                <div className="p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="text-slate-500 text-sm uppercase">
                                    <th className="py-3 px-4 text-left">Khách hàng</th>
                                    <th className="py-3 px-4 text-left">SĐT</th>
                                    <th className="py-3 px-4 text-left">Thời gian</th>
                                    <th className="py-3 px-4 text-left">Số khách</th>
                                    <th className="py-3 px-4 text-left">Yêu cầu</th>
                                    <th className="py-3 px-4 text-left">Bàn</th>
                                    <th className="py-3 px-4 text-left">Trạng thái</th>
                                    <th className="py-3 px-4 text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((b) => (
                                    <motion.tr
                                        key={b.id}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.18 }}
                                        className="border-t hover:bg-slate-50"
                                    >
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                                    {b.customerName.split(" ").slice(-1)[0][0] || "U"}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-800 flex items-center gap-2">
                                                        <User size={14} className="text-slate-400" /> {b.customerName}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* FIX: Bọc nội dung mỗi <td> vào div để đảm bảo cấu trúc ô riêng biệt */}
                                        <td className="py-4 px-4 text-slate-700">
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} className="text-slate-400" /> {b.customerPhone}
                                            </div>
                                        </td>

                                        <td className="py-4 px-4 text-slate-700">
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-slate-400" /> {b.arriveAt}
                                            </div>
                                        </td>

                                        <td className="py-4 px-4 text-slate-700">
                                            <div className="flex items-center gap-2">
                                                <Users size={14} className="text-slate-400" /> {b.numberOfPeople}
                                            </div>
                                        </td>

                                        <td className="py-4 px-4 text-slate-700">{b.note || "-"}</td>

                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="text-sm text-indigo-600 font-medium">{b.tableNumbers.join(", ")}</div>
                                                <button
                                                    onClick={() => {
                                                        fetchAvailableTables(b.arriveAt);
                                                        setShowTableModalFor(b);
                                                    }}
                                                    className="ml-2 px-2 py-1 text-xs bg-slate-100 rounded-md hover:bg-slate-200 flex items-center gap-1"
                                                >
                                                    <Edit size={14} /> Chọn bàn
                                                </button>
                                            </div>
                                        </td>

                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-sm ${statusClass(b.status)}`}>
                                                {b.status}
                                            </span>
                                        </td>

                                        <td className="py-4 px-4 text-center">
                                            <div className="inline-flex gap-2">
                                                {/* FIX: Logic và màu nút "Xác nhận" */}
                                                {b.status === "Pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => confirmBooking(b.id, b)}
                                                            className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 flex items-center gap-2"
                                                        >
                                                            <CheckSquare size={14} /> Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => setShowCancelModalFor(b)}
                                                            className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 flex items-center gap-2"
                                                        >
                                                            <X size={14} /> Cancel
                                                        </button>
                                                    </>
                                                )}

                                                {/* FIX: Logic nút "Check-in" chỉ dành cho trạng thái "Confirmed" */}
                                                {b.status === "Confirmed" && (
                                                    <>
                                                        <button
                                                            onClick={() => setShowCheckinModalFor(b)}
                                                            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center gap-2"
                                                        >
                                                            <Check size={14} /> Check-in
                                                        </button>
                                                        <button
                                                            onClick={() => setShowCancelModalFor(b)}
                                                            className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 flex items-center gap-2"
                                                        >
                                                            <X size={14} /> Cancel
                                                        </button>
                                                    </>
                                                )}

                                                {b.status === "Occupied" && (
                                                    <>
                                                        <button
                                                            onClick={() => setShowCheckinModalFor(b)}
                                                            className="px-3 py-1 bg-slate-200 text-slate-700 rounded-md text-sm hover:bg-slate-300 flex items-center gap-2"
                                                        >
                                                            <MapPin size={14} /> Information
                                                        </button>
                                                        {/* Optional: You may want to hide the cancel button after check-in */}
                                                        {/* <button
                                                            onClick={() => setShowCancelModalFor(b)}
                                                            className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 flex items-center gap-2"
                                                        >
                                                            <X size={14} /> Hủy
                                                        </button> */}
                                                    </>
                                                )}

                                                {b.status === "Canceled" && (
                                                    <div className="text-sm text-slate-400 italic">—</div>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}

                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="py-6 text-center text-slate-500">
                                            Không có đơn phù hợp
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ========== Modals ========== */}

            {/* SelectTableModal (Chọn nhiều bàn) */}
            {showTableModalFor && (
                <SelectTableModal
                    booking={showTableModalFor}
                    allTables={availableTables}
                    onClose={() => setShowTableModalFor(null)}
                    onSave={(selectedTables) => {
                        patchBookingTables({
                        ...showTableModalFor,
                        tableNumbers: selectedTables,
                    });
                        setShowTableModalFor(null);
                    }}
                />
            )}

            {/* Check-in modal (hiển thị đầy đủ thông tin, xác nhận check-in) */}
            {showCheckinModalFor && (
                <CheckinModal
                    booking={showCheckinModalFor}
                    onClose={() => setShowCheckinModalFor(null)}
                    onConfirm={() => {
                        // Chỉ cho phép check-in nếu trạng thái là "Confirmed"
                        if (showCheckinModalFor.status === 'Confirmed') {
                            patchBookingStatus(showCheckinModalFor.id, "Occupied");
                        }
                        setShowCheckinModalFor(null);
                    }}
                />
            )}

            {/* Cancel modal (cảnh báo đỏ) */}
            {showCancelModalFor && (
                <CancelModal
                    booking={showCancelModalFor}
                    onClose={() => setShowCancelModalFor(null)}
                    onConfirm={() => {
                        patchBookingStatus(showCancelModalFor.id, "Canceled");
                        setShowCancelModalFor(null);
                    }}
                />
            )}

            {/* Create booking modal */}
            {showCreateModal && (
                <CreateBookingModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={(payload) => {
                        createBooking(payload);
                        setShowCreateModal(false);
                    }}
                />
            )}
        </div>
    );
}

/* ===========================
   SelectTableModal: chọn nhiều bàn (checkbox),
   mặc định chọn những bàn đã có trong booking.tableNumbers
   =========================== */
function SelectTableModal({ booking, allTables, onClose, onSave }) {
    const [selected, setSelected] = useState(booking?.tableNumbers || []);

    const toggle = (t) =>
        setSelected((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Chọn bàn cho: <span className="text-indigo-600">{booking.customerName}</span></h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700">Đóng</button>
                </div>

                <p className="text-sm text-slate-500 mb-4">Chọn một hoặc nhiều bàn. Bàn đã chọn mặc định sẽ được đánh dấu.</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    {allTables.map((t) => {
                        const active = selected.includes(t);
                        return (
                            <button
                                key={t}
                                onClick={() => toggle(t)}
                                className={`flex items-center gap-2 p-3 border rounded-lg text-sm font-medium ${active ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "bg-white border-slate-200 hover:bg-slate-50"
                                    }`}
                            >
                                <input type="checkbox" checked={active} readOnly className="w-4 h-4" />
                                <div>{t}</div>
                            </button>
                        );
                    })}
                </div>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Hủy</button>
                    <button onClick={() => onSave(selected)} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Lưu chọn</button>
                </div>
            </motion.div>
        </div>
    );
}

/* ===========================
   CheckinModal: hiển thị thông tin đầy đủ để xác nhận check-in
   =========================== */
function CheckinModal({ booking, onClose, onConfirm }) {
    // Nút xác nhận sẽ bị vô hiệu hóa nếu trạng thái không phải là "Confirmed"
    const canCheckin = booking.status === 'Confirmed';
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold">
                        {canCheckin ? "Xác nhận Check-in" : "Thông tin đặt bàn"}
                    </h3>
                    <button onClick={onClose} className="text-slate-500">Đóng</button>
                </div>
                console.log("tableNumbers:", booking.tableNumbers);
                <div className="space-y-2 text-sm text-slate-700 mb-4">
                    <div className="flex items-center gap-3"><User size={14} className="text-slate-400" /> <b>Họ tên:</b> <span>{booking.customerName}</span></div>
                    <div className="flex items-center gap-3"><Phone size={14} className="text-slate-400" /> <b>Số điện thoại:</b> <span>{booking.customerPhone}</span></div>
                    <div className="flex items-center gap-3"><Clock size={14} className="text-slate-400" /> <b>Thời gian:</b> <span>{booking.arriveAt}</span></div>
                    <div className="flex items-center gap-3"><Users size={14} className="text-slate-400" /> <b>Số khách:</b> <span>{booking.numberOfPeople}</span></div>
                    console.log("tableNumbers:", booking.tableNumbers);
                    <div className="flex items-center gap-3"><MapPin size={14} className="text-slate-400" /> <b>Bàn:</b> <span>{booking.tableNumbers?.join(", ") || "Chưa chọn bàn"}</span></div>
                    <div><b>Yêu cầu đặc biệt:</b> <span className="text-slate-600">{booking.note || "Không"}</span></div>
                </div>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Quay lại</button>
                    {/* Chỉ hiển thị nút check-in khi trạng thái cho phép */}
                    {canCheckin && (
                        <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                            Xác nhận Check-in
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

/* ===========================
   CancelModal: cảnh báo hủy
   =========================== */
function CancelModal({ booking, onClose, onConfirm }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-red-50 border border-red-200 rounded-2xl shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-red-700">⚠️ Xác nhận hủy đơn</h3>
                    <button onClick={onClose} className="text-red-600">Đóng</button>
                </div>

                <p className="text-sm text-red-700 mb-4">
                    Bạn sắp hủy đơn đặt bàn của <b>{booking.name}</b> — thao tác này sẽ đánh dấu đơn là <b>Đã hủy</b>.
                </p>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-white border hover:bg-gray-50">Quay lại</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">Xác nhận hủy</button>
                </div>
            </motion.div>
        </div>
    );
}

/* ===========================
   CreateBookingModal: form tạo đơn (các trường cơ bản)
   =========================== */
function CreateBookingModal({ onClose, onCreate }) {
    const [payload, setPayload] = useState({
        name: "",
        phone: "",
        time: "",
        numberOfPeople: 2,
        note: "",
        tableNumbers: [],
        status: "Chờ",
    });

    const canCreate = payload.name.trim() && payload.phone.trim() && payload.time.trim();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Tạo đơn đặt bàn mới</h3>
                    <button onClick={onClose} className="text-slate-500">Đóng</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="text-sm">
                        <div className="text-slate-600 text-xs">Họ tên</div>
                        <input className="mt-1 w-full border rounded px-3 py-2" value={payload.name} onChange={(e) => setPayload({ ...payload, name: e.target.value })} />
                    </label>

                    <label className="text-sm">
                        <div className="text-slate-600 text-xs">Số điện thoại</div>
                        <input className="mt-1 w-full border rounded px-3 py-2" value={payload.phone} onChange={(e) => setPayload({ ...payload, phone: e.target.value })} />
                    </label>

                    <label className="text-sm col-span-1 md:col-span-2">
                        <div className="text-slate-600 text-xs">Thời gian</div>
                        <input type="datetime-local" className="mt-1 w-full border rounded px-3 py-2" value={payload.time} onChange={(e) => setPayload({ ...payload, time: e.target.value })} />
                    </label>

                    <label className="text-sm">
                        <div className="text-slate-600 text-xs">Số khách</div>
                        <input type="number" min="1" className="mt-1 w-full border rounded px-3 py-2" value={payload.numberOfPeople} onChange={(e) => setPayload({ ...payload, numberOfPeople: Number(e.target.value) })} />
                    </label>

                    <label className="text-sm col-span-1 md:col-span-2">
                        <div className="text-slate-600 text-xs">Yêu cầu đặc biệt</div>
                        <input className="mt-1 w-full border rounded px-3 py-2" value={payload.note} onChange={(e) => setPayload({ ...payload, note: e.target.value })} />
                    </label>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Hủy</button>
                    <button onClick={() => canCreate && onCreate(payload)} disabled={!canCreate} className={`px-4 py-2 rounded-lg text-white ${canCreate ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}>
                        Tạo đơn
                    </button>
                </div>
            </motion.div>
        </div>
    );
}