export const ROUTERS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  USER: {
    HOME: "/",
    ABOUT: "about",
    MENU: "menu",
    NEWS: "news",
  },
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    MENU_MANAGEMENT: "/admin/menu-management",
    ORDER: "/admin/order",
    TABLE: "/admin/table",
    INVENTORY: "/admin/inventory",
    STAFF: "/admin/staffs",
    STAFF_ADD: "/admin/staff/add",
    STAFF_UPDATE: "/admin/staff/update/:id",
    STAFF_SHIFT_ASSIGNMENTS: "/admin/staff/shift-assignments",
    STAFF_REGISTER_SHIFTS: "/staff/register-shift",
    REPORT: "/admin/report",
    SETTING: "/admin/setting",
    CATEGORY_MANAGEMENT: "/admin/category-management",
  },
  NOT_FOUND: "*",
};
