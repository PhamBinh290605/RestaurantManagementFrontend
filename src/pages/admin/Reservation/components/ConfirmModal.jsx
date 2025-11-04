import React from "react";
import { motion } from "framer-motion";

export default function ConfirmModal({ booking, action, onClose, onConfirm }) {
  const isCancel = action === "Hủy";
  const isCheckin = action === "Check-in";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`rounded-2xl shadow-xl p-6 w-[420px] ${
          isCancel ? "bg-red-50 border border-red-200" : "bg-white"
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-3 ${
            isCancel ? "text-red-700" : "text-gray-800"
          }`}
        >
          {isCancel
            ? "⚠️ Cảnh báo hủy đơn đặt bàn"
            : `Xác nhận ${action}`}
        </h3>

        {isCheckin ? (
          <div className="text-sm text-gray-700 mb-4">
            <p><b>Họ tên:</b> {booking.name}</p>
            <p><b>Số điện thoại:</b> {booking.phone}</p>
            <p><b>Thời gian:</b> {booking.time}</p>
            <p><b>Số khách:</b> {booking.guests}</p>
            <p><b>Yêu cầu đặc biệt:</b> {booking.specialRequest || "Không"}</p>
            <p><b>Bàn:</b> {booking.table}</p>
          </div>
        ) : (
          <p className="text-gray-700 mb-4">
            Bạn có chắc muốn {action.toLowerCase()} đơn đặt bàn của{" "}
            <b>{booking.name}</b> không?
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Đóng
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white ${
              isCancel
                ? "bg-red-600 hover:bg-red-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            Xác nhận
          </button>
        </div>
      </motion.div>
    </div>
  );
}
