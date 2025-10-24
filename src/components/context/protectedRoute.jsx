import { useLocation } from "react-router-dom";
import { ROUTERS } from "../../utils/router";
import { useAuth } from "./authContext";
import NotFound from "../notFound";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  const staffAllowedPaths = [
    ROUTERS.ADMIN.ORDER,
    ROUTERS.ADMIN.INVENTORY,
    ROUTERS.ADMIN.STAFF,
    ROUTERS.ADMIN.STAFF_REGISTER_SHIFTS,
    ROUTERS.ADMIN.SETTING,
  ];
  if (user.isAdmin) {
    return children;
  } else if (user.isStaff) {
    const currentPath = location.pathname;
    if (!staffAllowedPaths.includes(currentPath)) {
      return <NotFound url={ROUTERS.AUTH.LOGIN} title="COME BACK" />;
    }
    return children;
  } else {
    return <NotFound url={ROUTERS.AUTH.LOGIN} title="COME BACK" />;
  }
};

export default ProtectedRoute;
