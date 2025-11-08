import { MessageCircle } from "lucide-react";

const PostNew = () => {
  return (
    <div className="w-[1200px] mx-auto py-16 px-6 grid md:grid-cols-2 gap-10">
      <div className="bg-[#FFF8EF] rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <img
          src="/src/assets/images/post-1.jpg"
          alt="Post 1"
          className="w-full h-[260px] object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="p-6 border-b border-[#E5D3B3]">
          <p className="text-2xl font-bold text-[#6B4A3A] mb-2">Libero Lorem</p>
          <p className="text-sm text-[#9C7E63] mb-4">
            By <label className="text-blue-500">admin / October 31, 2025</label>
          </p>
          <p className="text-[#5C3A21] text-sm leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae non
            nobis quas ullam culpa odit possimus, illum temporibus perspiciatis
            a consectetur vel ut maiores, labore est itaque soluta qui natus?
          </p>
        </div>
        <div className="flex items-center justify-between px-6 py-4">
          <a
            href=""
            className="text-[#6B4A3A] font-semibold text-sm hover:text-[#B17B4B] transition-colors duration-300"
          >
            Continue reading →
          </a>
          <div className="flex items-center gap-2 text-[#9C7E63]">
            <MessageCircle size={18} strokeWidth={2} />
            <span className="text-sm font-medium">0</span>
          </div>
        </div>
      </div>

      <div className="bg-[#FFF8EF] rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <img
          src="/src/assets/images/post-2.jpg"
          alt="Post 2"
          className="w-full h-[260px] object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="p-6 border-b border-[#E5D3B3]">
          <p className="text-2xl font-bold text-[#6B4A3A] mb-2">Libero Lorem</p>
          <p className="text-sm text-[#9C7E63] mb-4">
            By <label className="text-blue-500">admin / October 31, 2025</label>
          </p>
          <p className="text-[#5C3A21] text-sm leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae non
            nobis quas ullam culpa odit possimus, illum temporibus perspiciatis
            a consectetur vel ut maiores, labore est itaque soluta qui natus?
          </p>
        </div>

        <div className="flex items-center justify-between px-6 py-4">
          <a
            href=""
            className="text-[#6B4A3A] font-semibold text-sm hover:text-[#B17B4B] transition-colors duration-300"
          >
            Continue reading →
          </a>
          <div className="flex items-center gap-2 text-[#9C7E63]">
            <MessageCircle size={18} strokeWidth={2} />
            <span className="text-sm font-medium">0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostNew;
