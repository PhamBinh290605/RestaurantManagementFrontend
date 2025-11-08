import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

const BannerSwiper = ({ listImage }) => {
  return (
    <div className="h-[550px] w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={10}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        className="mySwiper"
      >
        {listImage.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="h-[550px] w-full">
              <img
                src={item}
                alt={`banner-${index}`}
                className="w-full h-full object-cover object-top rounded-lg"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSwiper;
