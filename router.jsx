import { Route, Routes } from "react-router-dom";
import { ROUTERS } from "./src/utils/router";
import LoginPage from "./src/pages/auth/pages/LoginPage";
import RegisterPage from "./src/pages/auth/pages/Register";
import UserLayout from "./src/pages/user/theme/userLayout";
import AdminLayout from "./src/pages/admin/theme/adminLayout";
import { AuthProvider } from "./src/components/context/authContext";
import ProtectedRoute from "./src/components/context/protectedRoute";
import NotFound from "./src/components/notFound";
import StaffPage from "./src/pages/admin/staff";

const RouterCustom = () => {
  const authRoute = [
    {
      path: ROUTERS.AUTH.LOGIN,
      element: <LoginPage />,
    },
    {
      path: ROUTERS.AUTH.REGISTER,
      element: <RegisterPage />,
    },
  ];
  const userRouters = [
    {
      path: ROUTERS.USER.HOME,
      element: <div>Hello</div>,
    },
    {
      path: ROUTERS.USER.ABOUT,
      element: <div>Hiii</div>,
    },
  ];
  const adminRouters = [
    {
      path: ROUTERS.ADMIN.DASHBOARD,
      element: <div>Admin Dashboard</div>,
    },
    {
      path: ROUTERS.ADMIN.MENU_MANAGEMENT,
      element: <div>Menu Management</div>,
    },
    {
      path: ROUTERS.ADMIN.ORDER,
      element: <div>Order</div>,
    },
    {
      path: ROUTERS.ADMIN.TABLE,
      element: <div>Table</div>,
    },
    {
      path: ROUTERS.ADMIN.INVENTORY,
      element: <div>Inventory</div>,
    },
    {
      path: ROUTERS.ADMIN.STAFF,
      element: <StaffPage />,
    },
    {
      path: ROUTERS.ADMIN.REPORT,
      element: <div>Report</div>,
    },
    {
      path: ROUTERS.ADMIN.SETTING,
      element: <div>Setting</div>,
    },
  ];

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          {userRouters.map((item, index) => (
            <Route key={index} path={item.path} element={item.element} />
          ))}
        </Route>
        {authRoute.map((item, index) => (
          <Route key={index} path={item.path} element={item.element} />
        ))}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {adminRouters.map((item, index) => (
            <Route key={index} path={item.path} element={item.element} />
          ))}
        </Route>
        <Route
          path={ROUTERS.NOT_FOUND}
          element={<NotFound url="/" title="GO BACK HOME" />}
        />
      </Routes>
    </AuthProvider>
  );
};

export default RouterCustom;
