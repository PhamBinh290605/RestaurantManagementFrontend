import { Route, Routes } from "react-router-dom";
import { ROUTERS } from "./src/utils/router";
import LoginPage from "./src/pages/auth/pages/LoginPage";
import UserLayout from "./src/pages/user/theme/userLayout";
import AdminLayout from "./src/pages/admin/theme/adminLayout";
import { AuthProvider } from "./src/components/context/authContext";
import ProtectedRoute from "./src/components/context/protectedRoute";
import NotFound from "./src/components/notFound";
import StaffPage from "./src/pages/admin/staff";
import AddUser from "./src/pages/admin/staff/pages/AddUser";
import ShiftAssignmentPage from "./src/pages/admin/staff/pages/ShiftAssignment";
import RegisterShiftPage from "./src/pages/admin/staff/pages/RegisterShiftPage";
import UpdateUser from "./src/pages/admin/staff/pages/UpdateUser";
import AttendAssignment from "./src/pages/admin/staff/pages/AttendAssignment";
import Menu from "./src/pages/user/menu";
import Reservation from "./src/pages/user/Reservation";
import AboutPage from "./src/pages/user/aboutPage";
import Contact from "./src/pages/user/contact/Index";
import Album from "./src/pages/user/album";
import HomePage from "./src/pages/user/homePage";
import Payment from "./src/pages/admin/payment";
import PaymentResult from "./src/pages/admin/payment/pages/PaymentResult";
import CreateInventory from "./src/pages/admin/inventory/pages/CreateInventory";
import AddItemInventory from "./src/pages/admin/inventory/pages/AddItemInventory";
import ListInventory from "./src/pages/admin/inventory/pages/ListInventory";

const RouterCustom = () => {
  const authRoute = [
    {
      path: ROUTERS.AUTH.LOGIN,
      element: <LoginPage />,
    },
  ];
  const userRouters = [
    {
      path: ROUTERS.USER.HOME,
      element: <HomePage />,
    },
    {
      path: ROUTERS.USER.ABOUT,
      element: <AboutPage />,
    },
    {
      path: ROUTERS.USER.MENU,
      element: <Menu />,
    },
    {
      path: ROUTERS.USER.RESERVATION,
      element: <Reservation />,
    },
    {
      path: ROUTERS.USER.ALBUM,
      element: <Album />,
    },
    {
      path: ROUTERS.USER.CONTACT,
      element: <Contact />,
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
    {
      path: ROUTERS.ADMIN.STAFF_ADD,
      element: <AddUser />,
    },
    {
      path: ROUTERS.ADMIN.STAFF_ADD,
      element: <AddUser />,
    },
    {
      path: ROUTERS.ADMIN.STAFF_DELETED,
      element: <div>Hello, this is page deleted user!</div>,
    },
    {
      path: ROUTERS.ADMIN.STAFF_UPDATE,
      element: <UpdateUser />,
    },
    {
      path: ROUTERS.ADMIN.CATEGORY_MANAGEMENT,
      element: <div>Category Management</div>,
    },
    {
      path: ROUTERS.ADMIN.STAFF_SHIFT_ASSIGNMENTS,
      element: <ShiftAssignmentPage />,
    },
    {
      path: ROUTERS.ADMIN.STAFF_REGISTER_SHIFTS,
      element: <RegisterShiftPage />,
    },
    {
      path: ROUTERS.ADMIN.STAFF_ATTEND_ASSIGNMENT,
      element: <AttendAssignment />,
    },
    {
      path: ROUTERS.ADMIN.PAYMENT,
      element: <Payment />,
      path: ROUTERS.ADMIN.INVENTORY_CREATE,
      element: <CreateInventory />,
    },
    {
      path: ROUTERS.ADMIN.INVENTORY_ADD_ITEM,
      element: <AddItemInventory />,
    },
    {
      path: ROUTERS.ADMIN.INVENTORY_LIST,
      element: <ListInventory />,
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
          path={ROUTERS.RESULT.PAYMENT_RESULT}
          element={<PaymentResult />}
        />
        <Route
          path={ROUTERS.NOT_FOUND}
          element={<NotFound url="/" title="GO BACK HOME" />}
        />
      </Routes>
    </AuthProvider>
  );
};

export default RouterCustom;
