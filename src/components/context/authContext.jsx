/* eslint-disable react-refresh/only-export-components */
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { ROUTERS } from "../../utils/router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    UserId: "",
    username: "",
    isAdmin: false,
    isStaff: false,
    token: null,
  });

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      try {
        const decodedToken = jwtDecode(savedToken);

        const exp = decodedToken.exp;

        if (exp && Date.now() >= exp * 1000) {
          console.log("Token has expired");
          localStorage.removeItem("token");
          Navigate(ROUTERS.AUTH.LOGIN);
        }
        const role = decodedToken.Role || decodedToken.role;

        let isAdmin = false;
        let isStaff = false;
        if (role) {
          if (role === "Admin") isAdmin = true;
          else if (role === "Staff") isStaff = true;
        }

        setUser({
          UserId: decodedToken.UserId,
          username: decodedToken.Role || "",
          isAdmin,
          isStaff,
          token: savedToken,
        });
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = async (formData) => {
    try {
      const response = await fetch("http://localhost:5268/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        console.log("Error fetching API");
        return;
      }

      const data = await response.json();
      const token = data.result.token;

      // Decode token to get user roles
      const decodedToken = jwtDecode(token);
      // console.log("Decoded Token:", decodedToken);

      const userInfo = {
        UserId: decodedToken.UserId,
        username: decodedToken.Username || "",
        isAdmin: decodedToken.Role.includes("Admin"),
        isStaff: decodedToken.Role.includes("Staff"),
        token: token,
      };
      localStorage.setItem("token", token);

      setUser(userInfo);
      return userInfo;
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const loginGoogle = async (credentialResponse) => {
    try {
      const IdToken = credentialResponse.credential;

      const res = await fetch(
        "http://localhost:5268/api/v1/auth/google-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ IdToken: IdToken }),
        }
      );

      if (!res.ok) {
        console.error("Google login failed - fetch error");
        alert("Google login failed!");
        return;
      }

      const data = await res.json();
      const token = data.result.token;

      // Decode token to get user roles
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);
      localStorage.setItem("token", token);

      setUser({
        UserId: decodedToken.UserId,
        username: decodedToken.Role || "",
        isAdmin: decodedToken.Role.includes("Admin"),
        isStaff: decodedToken.Role.includes("Staff"),
        token: token,
      });
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const response = await fetch("http://localhost:5268/api/v1/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        console.log("Error during logout API call");
      }

      setUser({
        isAdmin: false,
        isStaff: false,
        token: null,
      });
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, loginGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
