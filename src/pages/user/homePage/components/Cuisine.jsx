import { useTranslation } from "react-i18next";
import Section from "../../../../components/Section";

const Cuisine = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* "Cuisine": {
    "title": {
      "t1": "THỊT RANG CHÁY CẠNH",
      "t2": "CÁ BỐNG CHIÊN GIÒN",
      "t3": "THỊT KHO TRỨNG CÚT",
      "t4": "CANH CUA MÙNG TƠI"
    },
    "p": {
      "p1": "Từng miếng thịt được thái vừa vặn, đảo qua lớp lửa để các mặt xém cạnh, khi lên được màu vàng nâu đẹp mắt cùng lớp bì giòn hấp dẫn, ấy là lúc món thịt rang cháy cạnh gần hoàn tất.",
      "p2": "Căn chỉnh ở nhiệt đồ dầu sôi vừa phải, từng miếng cá bống nhỏ được ướp vừa vặn, tắm mình đến khi cho ra được màu vàng đẹp mắt nhất.",
      "p3": "Từng miếng thịt ba chỉ được chọn lọc, tẩm ướp theo đúng hương vị chuẩn miền Bắc cùng nước hàng đặc trưng sẽ làm bạn lưu luyến món cơm nhà đậm đà đầy thương nhớ.",
      "p4": "Bát canh cua nóng nẩy, thơm mùi gạch cua đem lại một cảm giác đồng quê quen thuộc, cảm giác của hương vị quê hương."
    }
  } */}

      <div className="flex gap-10 w-[1200px] m-auto pt-16">
        <div className="flex flex-col items-center text-center">
          <img
            className="h-[330px] object-cover mb-4"
            src="/src/assets/images/Cuisine/not-found.png"
            alt=""
          />
          <p className="text-lg font-bold text-[#6B4A3A] uppercase tracking-wide">
            {t("Cuisine.title.t1")}
          </p>
          <p className="mt-2 text-sm text-[#5C3A21] leading-relaxed">
            {t("Cuisine.p.p1")}
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <p className="text-lg font-bold text-[#6B4A3A] uppercase tracking-wide mb-2">
            {t("Cuisine.title.t2")}
          </p>
          <p className="text-sm text-[#5C3A21] leading-relaxed mb-4">
            {t("Cuisine.p.p2")}
          </p>
          <img
            className="h-[330px] object-cover mb-4"
            src="/src/assets/images/Cuisine/not-found.png"
            alt=""
          />
        </div>

        <div className="flex flex-col items-center text-center">
          <img
            className="h-[330px] object-cover mb-4"
            src="/src/assets/images/Cuisine/not-found.png"
            alt=""
          />
          <p className="text-lg font-bold text-[#6B4A3A] uppercase tracking-wide">
            {t("Cuisine.title.t3")}
          </p>
          <p className="mt-2 text-sm text-[#5C3A21] leading-relaxed">
            {t("Cuisine.p.p3")}
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <p className="text-lg font-bold text-[#6B4A3A] uppercase tracking-wide mb-2">
            {t("Cuisine.title.t4")}
          </p>
          <p className="text-sm text-[#5C3A21] leading-relaxed mb-4">
            {t("Cuisine.p.p4")}
          </p>
          <img
            className="h-[330px] object-cover mb-4"
            src="/src/assets/images/Cuisine/not-found.png"
            alt=""
          />
        </div>
      </div>
    </>
  );
};

export default Cuisine;
