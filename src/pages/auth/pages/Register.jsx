/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { ROUTERS } from "../../../utils/router";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Username: "",
    Password: "",
    ConfirmPassword: "",
    FullName: "",
    Email: "",
    PhoneNumber: "",
  });

  const [accept, setAccept] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    if (!accept) {
      alert(
        "You must accept the Privacy Policy and Terms before creating an account."
      );
      return;
    }
    try {
      const res = await fetch("http://localhost:5268/api/v1/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        console.log("Error fetch api");
      }

      const data = await res.json();
      console.log(data);
      navigate(ROUTERS.AUTH.LOGIN);
    } catch (error) {
      console.error("Create account error:", error);
    }
  };

  return (
    <div className="min-h-screen flex  justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Create an Account</h2>
        <p className="mb-6">
          Already have an account?{" "}
          <a href={ROUTERS.AUTH.LOGIN} className="text-blue-500 underline">
            Log in
          </a>
        </p>
        <form className="w-full space-y-4" onSubmit={handleCreateAccount}>
          <div className="w-full">
            <span className="font-bold opacity-70">Full Name</span>
            <input
              type="text"
              name="FullName"
              required
              onChange={handleOnChange}
              value={formData.FullName}
              placeholder="Enter your full name"
              className="border border-gray-300 p-2 rounded-md w-full mt-2 focus:outline-none"
            />
          </div>
          <div>
            <span className="font-bold opacity-70">Username</span>
            <input
              type="text"
              name="Username"
              required
              onChange={handleOnChange}
              value={formData.Username}
              placeholder="Enter your user name"
              className="border border-gray-300 p-2 rounded-md w-full mt-2 focus:outline-none"
            />
          </div>
          <div>
            <span className="font-bold opacity-70">Password</span>
            <input
              type="text"
              name="Password"
              onChange={handleOnChange}
              value={formData.Password}
              placeholder="Enter your password"
              className="border border-gray-300 p-2 rounded-md w-full mt-2 focus:outline-none"
            />
          </div>
          <div>
            <span className="font-bold opacity-70">Confirm Password</span>
            <input
              type="text"
              name="ConfirmPassword"
              onChange={handleOnChange}
              value={formData.ConfirmPassword}
              placeholder="Enter your confirm password"
              className="border border-gray-300 p-2 rounded-md w-full mt-2 focus:outline-none"
            />
          </div>
          <div>
            <span className="font-bold opacity-70">Email</span>
            <input
              type="email"
              name="Email"
              onChange={handleOnChange}
              value={formData.Email}
              placeholder="Enter your email"
              className="border border-gray-300 p-2 rounded-md w-full mt-2 focus:outline-none"
            />
          </div>
          <div>
            <span className="font-bold opacity-70">Phone Number</span>
            <input
              type="tel"
              name="PhoneNumber"
              onChange={handleOnChange}
              value={formData.PhoneNumber}
              placeholder="Enter your phone number"
              className="border border-gray-300 p-2 rounded-md w-full mt-2 focus:outline-none"
            />
          </div>
          <div>
            <input
              type="checkbox"
              onChange={() => {
                setAccept(!accept);
              }}
              value={accept}
            />
            <span className="mx-2">
              I accept{" "}
              <a href="" className="text-purple-500 underline">
                {" "}
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="" className="text-purple-500 underline">
                Terms
              </a>{" "}
            </span>
          </div>
          <button
            type="submit"
            className="mt-6 bg-purple-500 text-white py-3 px-6 rounded-xl hover:bg-purple-600"
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
