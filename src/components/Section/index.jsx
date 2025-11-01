import bottomTitle from "/public/bottom-title.png";

const Section = (props) => {
  const { title } = props;
  return (
    <>
      <div className="relative flex flex-col items-center justify-center py-16 ">
        <h2 className="text-4xl font-bold text-[#5b2d1b] relative z-10">
          {title}
        </h2>

        <img
          src={bottomTitle}
          alt="brush background"
          className="absolute w-64 md:w-96 -bottom-1"
        />
      </div>
    </>
  );
};

export default Section;
