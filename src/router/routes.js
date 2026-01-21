const routes = [
  // ----------------------------------------------------------------------
  // 1. PUBLIC / LANDING PAGE
  // ----------------------------------------------------------------------
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"), // Your public website layout
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "login", component: () => import("pages/Auth/Login.vue") },
      { path: "routing", component: () => import("src/pages/RoutingButton.vue") }, // Assuming you have a login
      // Assuming you have a login
    ],
  },

  // ----------------------------------------------------------------------
  // 2. SAAS SUPER ADMIN PANEL (For You)
  // ----------------------------------------------------------------------
  {
    path: "/saas",
    component: () => import("layouts/SaasLayout.vue"), // Create this layout with your Admin Sidebar
    children: [
      {
        path: "dashboard",
        component: () => import("pages/SaasPanel/Dashboard.vue"),
      },
      {
        path: "tenants",
        component: () => import("pages/SaasPanel/Tenants.vue"),
      },
      {
        path: "subscriptions",
        component: () => import("pages/SaasPanel/Subscriptions.vue"),
      },
      {
        path: "settings",
        component: () => import("pages/SaasPanel/Settings.vue"),
      },
    ],
  },

  // ----------------------------------------------------------------------
  // 3. TENANT PANEL (For Shop Owners)
  // ----------------------------------------------------------------------
  {
    path: "/tenant",
    component: () => import("layouts/TenantLayout.vue"), // Layout with Inventory/HRM Sidebar
    children: [
      {
        path: "dashboard",
        component: () => import("pages/TenantPanel/Dashboard.vue"),
      },

      // Inventory Module
      {
        path: "inventory/products",
        component: () => import("pages/TenantPanel/Inventory/Products.vue"),
      },
      {
        path: "inventory/categories",
        component: () => import("pages/TenantPanel/Inventory/Categories.vue"),
      },
      {
        path: "inventory/brands",
        component: () => import("pages/TenantPanel/Inventory/Brands.vue"),
      },
      {
        path: "inventory/labels",
        component: () => import("pages/TenantPanel/Inventory/PrintLabels.vue"),
      },

      // HRM (Staff) Module
      {
        path: "hrm/employees",
        component: () => import("pages/TenantPanel/HRM/Employees.vue"),
      },
      {
        path: "hrm/roles",
        component: () => import("pages/TenantPanel/HRM/Roles.vue"),
      },
      {
        path: "hrm/attendance",
        component: () => import("pages/TenantPanel/HRM/Attendance.vue"),
      },

      // Sales & Returns
      {
        path: "sales/history",
        component: () => import("pages/TenantPanel/Sales/History.vue"),
      },
      {
        path: "sales/returns",
        component: () => import("pages/TenantPanel/Sales/Returns.vue"),
      },

      // People (CRM)
      {
        path: "customers",
        component: () => import("src/pages/TenantPanel/Customers.vue"),
      },
      {
        path: "suppliers",
        component: () => import("src/pages/TenantPanel/Suppliers.vue"),
      },

      // Settings
      {
        path: "settings/general",
        component: () => import("src/pages/TenantPanel/General.vue"),
      },
      {
        path: "settings/taxes",
        component: () => import("src/pages/TenantPanel/Taxes.vue"),
      },
    ],
  },

  // ----------------------------------------------------------------------
  // 4. POS TERMINAL (For Cashiers)
  // ----------------------------------------------------------------------
  {
    path: "/pos",
    // We use a specific layout that usually has NO sidebar (fullscreen mode)
    component: () => import("layouts/PosLayout.vue"),
    children: [{ path: "", component: () => import("pages/POS/Terminal.vue") }],
  },

  // ----------------------------------------------------------------------
  // 404 ERROR PAGE
  // ----------------------------------------------------------------------
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
