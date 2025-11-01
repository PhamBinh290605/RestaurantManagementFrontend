import { useState } from "react";
import Section from "../../../components/Section";
import { useTranslation } from "react-i18next";

const Reservation = () => {
  const { t } = useTranslation();
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const increaseGuests = () => setGuests((prev) => prev + 1);
  const decreaseGuests = () =>
    setGuests((prev) => (prev > 1 ? prev - 1 : prev));

  //   "Booking": {
  //   "title": "Đặt bàn",
  //   "form": {
  //     "title": {
  //       "t1": "THỜI GIAN ĐẶT BÀN",
  //       "t2": "THÔNG TIN NGƯỜI ĐẶT"
  //     },
  //     "name": {
  //       "n1": "Số lượng khách",
  //       "n2": "Ngày đặt",
  //       "n3": "Giờ đến"
  //     },
  //     "placeholder": {
  //       "pl1": "Họ tên",
  //       "pl2": "Số điện thoại",
  //       "pl3": "Lưu ý (tuỳ chọn)"
  //     },
  //     "button": "Đặt bàn ngay",
  //     "p": {
  //       "p1": "Quý khách vui lòng đến trước thời gian đặt 15 phút để nhà hàng phục vụ quý khách được tốt nhất.",
  //       "p2": "Cảm ơn quý khách!"
  //     }
  //   }
  // }

  return (
    <div className="bg-[#f5ebe0]">
      <Section title={t("Booking.title")} />

      <div className="min-h-screen flex justify-center items-center py-10 px-4">
        <div className="bg-[#fffaf3] shadow-lg rounded-2xl p-8 border border-[#e6d5c3]/60 w-[1200px]">
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-[#5b3a29] mb-6 border-b pb-2 border-[#d8bfa3]">
              {t("Booking.form.title.t1")}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-[#5b3a29] mb-2 font-medium">
                  {t("Booking.form.name.n1")}
                </label>
                <div className="flex items-center border border-[#d8bfa3] rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={decreaseGuests}
                    className="px-3 py-2 hover:bg-[#e6d5c3]/40 text-[#5b3a29] text-lg font-bold"
                  >
                    −
                  </button>
                  <span className="px-5 py-2 text-[#5b3a29] font-semibold">
                    {guests}
                  </span>
                  <button
                    onClick={increaseGuests}
                    className="px-3 py-2 hover:bg-[#e6d5c3]/40 text-[#5b3a29] text-lg font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[#5b3a29] mb-2 font-medium">
                  {t("Booking.form.name.n2")}
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="px-4 py-2 border border-[#d8bfa3] rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#b08968] text-[#5b3a29]"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[#5b3a29] mb-2 font-medium">
                  {t("Booking.form.name.n3")}
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="px-4 py-2 border border-[#d8bfa3] rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#b08968] text-[#5b3a29]"
                >
                  <option value="">Chọn giờ</option>
                  <option value="11:00">11:00</option>
                  <option value="11:30">11:30</option>
                  <option value="12:00">12:00</option>
                  <option value="18:00">18:00</option>
                  <option value="18:30">18:30</option>
                  <option value="19:00">19:00</option>
                  <option value="19:30">19:30</option>
                  <option value="20:00">20:00</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#5b3a29] mb-4 border-b pb-2 border-[#d8bfa3]">
              {t("Booking.form.title.t1")}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder={t("Booking.form.placeholder.pl1")}
                className="w-full px-4 py-2 border border-[#d8bfa3] rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#b08968] placeholder:text-[#a17c5f]"
              />
              <input
                type="text"
                placeholder={t("Booking.form.placeholder.pl2")}
                className="w-full px-4 py-2 border border-[#d8bfa3] rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#b08968] placeholder:text-[#a17c5f]"
              />
            </div>

            <textarea
              placeholder={t("Booking.form.placeholder.pl3")}
              rows="3"
              className="w-full px-4 py-2 border border-[#d8bfa3] rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#b08968] placeholder:text-[#a17c5f]"
            ></textarea>
          </div>

          <div className="mt-8 text-center">
            <button className="bg-[#8b5e3b] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#744b2f] transition-all duration-300 shadow-md">
              {t("Booking.form.button")}
            </button>

            <div className="flex justify-center items-center flex-col space-y-2 mt-6text-[#5b3a29] mt-12 ">
              <p className="font-semibold text-center leading-relaxed">
                {t("Booking.form.p.p1")}
              </p>
              <p className="font-bold text-[#8b5e3b]">
                {" "}
                {t("Booking.form.p.p2")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
