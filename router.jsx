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
import AddUser from "./src/pages/admin/staff/pages/AddUser";
import ShiftAssignmentPage from "./src/pages/admin/staff/pages/ShiftAssignment";
import RegisterShiftPage from "./src/pages/admin/staff/pages/RegisterShiftPage";
import MenuPage from "./src/pages/admin/menu";
import AddMenuItemPage from "./src/pages/admin/menu/pages/AddMenuItem";
import EditMenuItemPage from "./src/pages/admin/menu/pages/EditFood";
import CategoryManager from "./src/pages/admin/menu/pages/CategoryManager";
import OrderManagerPage from "./src/pages/admin/order-manager";
import OrderFeature from "./src/pages/admin/order";
import TableSelectionPage from "./src/pages/admin/order/pages/TableSelectionPage";
import OrderDetailPage from "./src/pages/admin/order/pages/OrderDetail";
import ReservationPage from "./src/pages/admin/Reservation";
import ManageTables from "./src/pages/admin/table";

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
      element: <MenuPage />,
    },
    {
      path: ROUTERS.ADMIN.ADD_MENU_ITEM,
      element: <AddMenuItemPage />,
    },
    {
      path: ROUTERS.ADMIN.EDIT_MENU_ITEM,
      element: <EditMenuItemPage />,
    },
    {
      path: ROUTERS.ADMIN.ORDER,
      element: <TableSelectionPage />,
    },
    {
      path: ROUTERS.ADMIN.ORDER_MANAGER,
      element: <OrderManagerPage />,
    },
    {
      path: ROUTERS.ADMIN.ORDER_DETAIL,
      element: <OrderDetailPage />,
    },
    // {
    //   path: ROUTERS.ADMIN.TABLE,
    //   element: <div>Table</div>,
    // },
    {
      path: ROUTERS.ADMIN.MANAGE_TABLES,
      element: <ManageTables />,
    },
    // {
    //   path: ROUTERS.ADMIN.SERVING_TABLES,
    //   element: <ServingTablesPage />,
    // },
    {
      path: ROUTERS.ADMIN.RESERVATION,
      element: <ReservationPage />,
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
    {
      path: ROUTERS.ADMIN.STAFF_ADD,
      element: <AddUser />,
    },
    {
      path: ROUTERS.ADMIN.CATEGORY_MANAGEMENT,
      element: <CategoryManager />,
    },
    {
      path: ROUTERS.ADMIN.STAFF_SHIFT_ASSIGNMENTS,
      element: <ShiftAssignmentPage />,
    },
    {
      path: ROUTERS.ADMIN.STAFF_REGISTER_SHIFTS,
      element: <RegisterShiftPage />,
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
