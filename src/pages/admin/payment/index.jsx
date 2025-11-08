/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    OrderId: 1,
    Name: "AAAAA",
    Amount: 10000,
    OrderDescription: "Test payment with VNPay",
    OrderType: "bbb",
  });

  const handleOnClick = async () => {
    try {
      const response = await fetch("http://localhost:5268/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        console.log("Error fetching payment API");
        return;
      }

      const data = await response.json();
      console.log("Data", data.result);

      window.location.href = data.result;
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button
        onClick={handleOnClick}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Payment
      </button>
    </div>
  );
};

export default Payment;
