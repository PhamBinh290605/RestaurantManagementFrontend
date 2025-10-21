import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../../components/context/authContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { user } = useAuth();

  const { login, loginGoogle } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      await login(formData);
      if (user.isAdmin) {
        navigate(ROUTERS.ADMIN.DASHBOARD);
      } else if (user.isStaff) {
        navigate(ROUTERS.ADMIN.STAFF);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await loginGoogle(credentialResponse);
      navigate(ROUTERS.ADMIN.STAFF);
    } catch (error) {
      console.error("Google login error:", error);
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-8 bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Welcome Back
          </h2>
          <p className="text-gray-600 mb-8">Please sign in to your account</p>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Username/ Email
              </label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                type="text"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="username or email"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="text-lg"
                  />
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleLogin(formData)}
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-center gap-4">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log("Google login failed")}
              />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href={ROUTERS.AUTH.REGISTER}
              className="text-indigo-600 hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
        {/* Right Section: Image */}
        <div className="w-full md:w-1/2 h-72 md:h-[450px] lg:h-[620px]">
          <img
            src="/src/assets/images/auth.jpg"
            alt="Authentication"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
