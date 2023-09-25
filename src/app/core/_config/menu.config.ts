export class MenuConfig {
  public defaults: any = {
    minisiteHeader: {
      self: {},
      items: [
        {
          title: "Company Info",
          root: true,
          fragment: "info",
        },
        {
          title: "Products",
          root: true,
          fragment: "products",
        },
        {
          title: "Videos",
          root: true,
          fragment: "videos",
        },
        {
          title: "Image Gallery",
          root: true,
          fragment: "gallery",
        },
        {
          title: "Documents",
          root: true,
          fragment: "documents",
        },
      ],
    },
    header: {
      self: {},
      items: [
        {
          title: "Home",
          root: true,
          translate: "MENU.DASHBOARD",
          page: "/pages/home",
        },
        {
          title: "Trade posts",
          root: true,
          translate: "MENU.DASHBOARD",
          page: "/pages/trade-posts",
        },
        {
          title: "Offerings",
          root: true,
          translate: "MENU.DASHBOARD",
          page: "/pages/packages",
        },
        {
          title: "Dashboard",
          root: true,
          translate: "MENU.DASHBOARD",
          page: "/dashboard/business/home",
        },
        {
          title: "Dashboard",
          root: true,
          translate: "MENU.DASHBOARD",
          page: "/dashboard/partner/home",
        },
        {
          title: "Dashboard",
          root: true,
          translate: "MENU.DASHBOARD",
          page: "/dashboard/admin/home",
        },
        {
          title: "Groups",
          root: true,
          fragment: "group",
        },
        {
          title: "Support",
          root: true,
          translate: "MENU.DASHBOARD",
          page: "/pages/support",
        },
      ],
    },
    aside: {
      self: {},
      items: [
        {
          title: "Dashboard",
          root: true,
          icon: "flaticon2-architecture-and-city",
          page: "/dashboard",
          translate: "MENU.DASHBOARD",
          bullet: "dot",
        },
        {
          title: "Layout Builder",
          root: true,
          icon: "flaticon2-expand",
          page: "/builder",
        },
        { section: "Applications" },
        {
          title: "eCommerce",
          bullet: "dot",
          icon: "flaticon2-list-2",
          root: true,
          permission: "accessToECommerceModule",
          submenu: [
            {
              title: "Customers",
              page: "/ecommerce/customers",
            },
            {
              title: "Products",
              page: "/ecommerce/products",
            },
          ],
        },
        {
          title: "User Management",
          root: true,
          bullet: "dot",
          icon: "flaticon2-user-outline-symbol",
          submenu: [
            {
              title: "Users",
              page: "/user-management/users",
            },
            {
              title: "Roles",
              page: "/user-management/roles",
            },
          ],
        },
      ],
    },
  };

  public get configs(): any {
    return this.defaults;
  }
}
