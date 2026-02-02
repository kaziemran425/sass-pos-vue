const routes = [
  // ----------------------------------------------------------------------
  // 1. PUBLIC / LANDING PAGE
  // ----------------------------------------------------------------------
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "login", component: () => import("pages/Auth/Login.vue") },
      // Path corrected to use standard alias
      { path: "routing", component: () => import("pages/RoutingButton.vue") },
    ],
  },

  // ----------------------------------------------------------------------
  // 2. SAAS SUPER ADMIN PANEL (For SaaS Owner)
  // ----------------------------------------------------------------------
  {
    path: "/saas",
    component: () => import("layouts/SaasLayout.vue"),
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
    component: () => import("layouts/TenantLayout.vue"),
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

      // People (CRM) - Fixed paths to standard alias
      {
        path: "customers",
        component: () => import("pages/TenantPanel/Customers.vue"),
      },
      {
        path: "suppliers",
        component: () => import("pages/TenantPanel/Suppliers.vue"),
      },

      // Settings - Fixed filenames to match your current files
      {
        path: "settings/general",
        component: () => import("pages/TenantPanel/GeneralPage.vue"),
      },
      {
        path: "report/profit",
        component: () => import("src/pages/TenantPanel/Reports/ProfitLoss.vue"),
      },

      {
        path: "report/sales",
        component: () =>
          import("src/pages/TenantPanel/Reports/SalesReport.vue"),
      },

      {
        path: "settings/taxes",
        component: () => import("pages/TenantPanel/TaxesPage.vue"),
      },

      {
        path: "income",
        component: () => import("src/pages/TenantPanel/Finance/Income.vue"),
      },

      {
        path: "expenses",
        component: () => import("src/pages/TenantPanel/Finance/Expence.vue"),
      },
    ],
  },

  // ----------------------------------------------------------------------
  // 4. POS TERMINAL (For Cashiers)
  // ----------------------------------------------------------------------
  {
    path: "/pos",
    component: () => import("layouts/PosLayout.vue"),
    children: [
      // Default POS view
      {
        path: "Terminal",
        component: () => import("src/pages/POS/Terminal.vue"),
      },
      // Additional POS Utility routes

      {
        path: "Dashboard",
        component: () => import("src/pages/POS/DashBoard.vue"),
      },
      {
        path: "held-orders",
        component: () => import("pages/POS/HeldOrders.vue"),
      },
      {
        path: "shift",
        component: () => import("pages/POS/OpenCloseShift.vue"),
      },
    ],
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
