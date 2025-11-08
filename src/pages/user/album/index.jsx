import { useTranslation } from "react-i18next";
import Section from "../../../components/Section";
import { useState } from "react";
import { X, ZoomIn } from "lucide-react";

const Album = () => {
  const { t } = useTranslation("common");

  const basePath = "/src/assets/images/gallery/";

  const galleryImages = [
    {
      id: 1,
      title: t("Gallery.images.img1"),
      category: "exterior",
      src: `${basePath}unnamed.jpg`,
    },
    {
      id: 2,
      title: t("Gallery.images.img2"),
      category: "food",
      src: `${basePath}img-2.jpg`,
    },
    {
      id: 3,
      title: t("Gallery.images.img3"),
      category: "event",
      src: `${basePath}img-3.jpg`,
    },
    {
      id: 4,
      title: t("Gallery.images.img4"),
      category: "event",
      src: `${basePath}img-4.jpg`,
    },
    {
      id: 5,
      title: t("Gallery.images.img5"),
      category: "interior",
      src: `${basePath}img-5.jpg`,
    },
    {
      id: 6,
      title: t("Gallery.images.img6"),
      category: "interior",
      src: `${basePath}img-6.jpg`,
    },
    {
      id: 7,
      title: t("Gallery.images.img7"),
      category: "interior",
      src: `${basePath}img-7.jpg`,
    },
    {
      id: 8,
      title: t("Gallery.images.img8"),
      category: "interior",
      src: `${basePath}img-8.jpg`,
    },
    {
      id: 9,
      title: t("Gallery.images.img9"),
      category: "interior",
      src: `${basePath}img-9.jpg`,
    },
  ];

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="min-h-screen bg-[#f5ebe0]">
      <Section title={t("Gallery.section")} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[200px]">
          {galleryImages.map((img, index) => (
            <div
              key={img.id}
              onClick={() => setSelectedImage(img)}
              className={`
                relative group overflow-hidden rounded-xl shadow-lg cursor-pointer
                transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]
                ${index % 5 === 0 ? "row-span-2" : ""}
                ${index % 3 === 0 ? "col-span-2" : ""}
              `}
            >
              <img
                src={img.src}
                alt={img.title}
                className="object-cover w-full h-full group-hover:brightness-90 transition"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-semibold text-lg drop-shadow-md">
                  {img.title}
                </h3>
                <p className="text-white/80 text-sm capitalize">
                  {t(`Gallery.categories.${img.category}`)}
                </p>
              </div>

              <span
                className={`
                  absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium text-white shadow-md
                  ${img.category === "exterior" && "bg-amber-600"}
                  ${img.category === "food" && "bg-red-600"}
                  ${img.category === "event" && "bg-indigo-600"}
                  ${img.category === "interior" && "bg-green-600"}

                `}
              >
                {t(`Gallery.categories.${img.category}`)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-all"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="w-full h-[60vh] object-contain bg-black"
            />

            <div className="p-6 bg-white">
              <h3 className="text-2xl font-bold text-[#5b3a29]">
                {selectedImage.title}
              </h3>
              <p className="text-[#8b5e3b] mt-1">
                {t(`Gallery.categories.${selectedImage.category}`)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Album;
