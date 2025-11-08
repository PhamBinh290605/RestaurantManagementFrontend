/* eslint-disable no-unused-vars */
import { useState } from "react";
import Section from "../../../components/Section";
import { useTranslation } from "react-i18next";

const Reservation = () => {
  const { t } = useTranslation();

  const [guests, setGuests] = useState(1);
  const [guestInput, setGuestInput] = useState("1");
  const [guestError, setGuestError] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const MIN_GUESTS = 1;
  const MAX_GUESTS = 50;

  const handleGuestInputChange = (e) => {
    const value = e.target.value;

    if (value === "" || /^[0-9]+$/.test(value)) {
      setGuestInput(value);
      setGuestError("");

      if (value !== "") {
        const num = parseInt(value, 10);
        if (num >= MIN_GUESTS && num <= MAX_GUESTS) {
          setGuests(num);
        } else if (num > MAX_GUESTS) {
          setGuestError(`Tối đa ${MAX_GUESTS} khách`);
        }
      }
    }
  };

  const handleGuestInputBlur = () => {
    let num = parseInt(guestInput, 10);

    if (isNaN(num) || num < MIN_GUESTS) {
      num = MIN_GUESTS;
    } else if (num > MAX_GUESTS) {
      num = MAX_GUESTS;
      setGuestError(`Đã điều chỉnh về tối đa ${MAX_GUESTS} khách`);
    }

    setGuests(num);
    setGuestInput(num.toString());
    setTimeout(() => setGuestError(""), 3000);
  };

  const increaseGuests = () => {
    setGuests((prev) => {
      const next = prev + 1;
      if (next > MAX_GUESTS) {
        setGuestError(`Tối đa ${MAX_GUESTS} khách`);
        setTimeout(() => setGuestError(""), 3000);
        return prev;
      }
      setGuestInput(next.toString());
      return next;
    });
  };

  const decreaseGuests = () => {
    setGuests((prev) => {
      const next = prev - 1;
      if (next < MIN_GUESTS) return prev;
      setGuestInput(next.toString());
      return next;
    });
  };

  return (
    <div className="bg-[#f5ebe0]">
      <Section title={t("Booking.title")} />

      <div className="min-h-screen flex justify-center items-center py-10 px-4">
        <div className="bg-[#fffaf3] shadow-lg rounded-2xl p-8 border border-[#e6d5c3]/60 w-full max-w-[1200px]">
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-[#5b3a29] mb-6 border-b pb-2 border-[#d8bfa3]">
              {t("Booking.form.title.t1")}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <label className="text-[#5b3a29] mb-2 font-medium">
                  {t("Booking.form.name.n1")}
                </label>
                <div className="flex items-center border border-[#d8bfa3] rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={decreaseGuests}
                    className="px-3 py-2 hover:bg-[#e6d5c3]/40 text-[#5b3a29] text-lg font-bold transition-colors"
                    aria-label="Giảm số lượng khách"
                  >
                    −
                  </button>

                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={guestInput}
                    onChange={handleGuestInputChange}
                    onBlur={handleGuestInputBlur}
                    className="w-20 px-2 py-2 text-center text-[#5b3a29] font-semibold bg-transparent focus:outline-none focus:bg-[#e6d5c3]/20 border-x border-[#d8bfa3]/40"
                    placeholder="1"
                  />

                  <button
                    onClick={increaseGuests}
                    className="px-3 py-2 hover:bg-[#e6d5c3]/40 text-[#5b3a29] text-lg font-bold transition-colors"
                    aria-label="Tăng số lượng khách"
                  >
                    +
                  </button>
                </div>
                {guestError && (
                  <p className="text-red-600 text-xs mt-1 animate-fade-in">
                    {guestError}
                  </p>
                )}
              </div>

              {/* NGÀY */}
              <div className="flex flex-col">
                <label className="text-[#5b3a29] mb-2 font-medium">
                  {t("Booking.form.name.n2")}
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="px-4 py-2 border border-[#d8bfa3] rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#b08968] text-[#5b3a29]"
                />
              </div>

              {/* GIỜ */}
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

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#5b3a29] mb-4 border-b pb-2 border-[#d8bfa3]">
              {t("Booking.form.title.t2") || "Thông tin liên hệ"}
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
            <button className="bg-[#8b5e3b] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#744b2f] transition-all duration-300 shadow-md transform hover:scale-105">
              {t("Booking.form.button")}
            </button>

            <div className="mt-8 text-[#5b3a29]">
              <p className="font-semibold leading-relaxed">
                {t("Booking.form.p.p1")}
              </p>
              <p className="font-bold text-[#8b5e3b] mt-1">
                {t("Booking.form.p.p2")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Reservation;
