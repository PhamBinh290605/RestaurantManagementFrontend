import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const responseCode = searchParams.get("vnp_ResponseCode");
    const transactionStatus = searchParams.get("vnp_TransactionStatus");

    if (responseCode === "00" && transactionStatus === "00") {
      setStatus("success");
    } else {
      setStatus("fail");
    }
  }, [searchParams]);

  if (status === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {status === "success" ? (
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            Payment Successful! 🎉
          </h2>
          <p>Transaction code: {searchParams.get("vnp_TransactionNo")}</p>
          <p>Amount: {Number(searchParams.get("vnp_Amount")) / 100} VND</p>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Come back admin page
          </button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-4">
            Payment Failed!i ❌
          </h2>
          <p>Please try again or contact help.</p>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Come back admin page
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentResult;
