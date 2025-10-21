import { Link } from "react-router-dom";

const NotFound = (props) => {
  const { url, title } = props;
  return (
    <div className="not__found my-[50px] flex flex-col items-center">
      <div className="text-[25px] font-bold">404</div>
      <div className="text-[18px] my-[10px]">
        OPPS... THIS PAGE YOU ARE LOOKING FOR ARE BEING INNOVATIVE
      </div>
      <div className="text-[12px] font-bold">PLEASE TRY AGAIN LATTER!!!</div>
      <div className="bg-[#7aa007] text-white my-[10px] py-[5px] px-[10px] text-[18px] font-medium rounded-full">
        <Link to={url}>{title}</Link>
      </div>
    </div>
  );
};

export default NotFound;
