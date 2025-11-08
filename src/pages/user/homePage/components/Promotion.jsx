import { Tag, Clock, Gift } from "lucide-react";

const promotions = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    title: "Giảm 20% cho khách hàng mới",
    description:
      "Tận hưởng ưu đãi 20% cho hóa đơn đầu tiên của bạn tại Vị An. Áp dụng cho tất cả món ăn trong menu.",
    valid: "Từ 01/11/2025 đến 30/11/2025",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    title: "Combo trưa chỉ 99.000đ",
    description:
      "Thưởng thức bữa trưa trọn vị với combo đặc biệt gồm 1 món chính, canh và tráng miệng.",
    valid: "Từ 01/11/2025 đến 31/12/2025",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    title: "Tặng món tráng miệng khi đặt bàn online",
    description:
      "Đặt bàn trước qua website, bạn sẽ được tặng 1 món tráng miệng miễn phí khi đến dùng bữa.",
    valid: "Từ 01/11/2025 đến 31/12/2025",
  },
];

const Promotion = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-[1200px] m-auto py-16">
      {promotions.map((promo) => (
        <div
          key={promo.id}
          className="bg-[#FFF8EF] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
        >
          <img
            src={promo.image}
            alt={promo.title}
            className="w-full h-[250px] object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="p-6">
            <div className="flex items-center gap-2 text-[#9C7E63] mb-2">
              <Tag size={18} />
              <span className="text-sm">{promo.valid}</span>
            </div>
            <h3 className="text-2xl font-semibold text-[#6B4A3A] mb-3">
              {promo.title}
            </h3>
            <p className="text-[#5C3A21] text-sm leading-relaxed mb-4">
              {promo.description}
            </p>
            <div className="flex items-center justify-between border-t pt-3">
              <div className="flex items-center gap-2 text-[#9C7E63] text-sm">
                <Clock size={16} />
                <span>Áp dụng có thời hạn</span>
              </div>
              <button className="flex items-center gap-2 bg-[#6B4A3A] text-white px-4 py-2 rounded-full hover:bg-[#5C3A21] transition-all">
                <Gift size={18} />
                Nhận ưu đãi
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Promotion;
