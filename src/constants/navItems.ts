export const defaultAdminMenuItems = [
  {
    id: 0,
    header: 'Dashboard',
    key: 'dashboard',
    path: '/ ',
    icon: 'Shape',
    isDropdown: false,
    category: [
      {
        name: 'Dashboard',
        path: '/dashboard',
        icon: 'Shapes',
      },
    ],
  },
  {
    id: 1,
    header: 'Accounts',
    key: 'accounts',
    path: '/accounts',
    icon: 'Accounts',
    isDropdown: false,
    category: [
      {
        name: 'Accounts',
        path: '/accounts',
        icon: 'Users',
      },
    ],
  },
  {
    id: 2,
    header: 'Manager',
    key: 'manager',
    isDropdown: true,
    icon: 'Transaction',
    category: [
      {
        name: 'Private Equity',
        path: '/privateequity',
        icon: 'Users',
      },
      {
        name: 'Private Credit',
        path: '/privatecredit',
        icon: 'Users',
      },
      {
        name: 'Delivery',
        path: '/delivery-journey',
        icon: 'Users',
      },
      {
        name: 'PC Delivery',
        path: '/pc-delivery-journey',
        icon: 'Transaction',
      },
    ],
  },
  {
    id: 3,
    header: 'Journey',
    key: 'journey',
    isDropdown: true,
    icon: 'Route',
    category: [
      {
        name: 'Acquisition',
        path: '/acquisition',
        icon: 'Users',
      },
      {
        name: 'Activation',
        path: '/activation_analytics',
        icon: 'Users',
      },
      {
        name: 'Order',
        path: '/order-analytics',
        icon: 'Transaction',
      },
      {
        name: 'Delivery',
        path: '/delivery_journey',
        icon: 'Transaction',
      },
    ],
  },
  {
    id: 4,
    header: 'Orders',
    key: 'orders',
    isDropdown: true,
    icon: 'Users',
    category: [
      {
        name: 'Buy',
        path: '/orders',
        icon: 'Transaction',
      },
      {
        name: 'Sell',
        path: '/sell-orders',
        icon: 'Transaction',
      },
      {
        name: 'PC Orders',
        path: '/pc-orders',
        icon: 'Transaction',
      },
    ],
  },
  {
    id: 5,
    header: 'Transactions',
    key: 'transactions',
    isDropdown: true,
    icon: 'Transaction',
    category: [
      {
        name: 'Buy',
        path: '/transactions',
        icon: 'Transaction',
      },
      {
        name: 'Wallet',
        path: '/wallet-transactions',
        icon: 'Transaction',
      },
      {
        name: 'BulkPe Transactions',
        path: '/bulkPe-transactions',
        icon: 'Transaction',
      },
      {
        name: 'Coin',
        path: '/coin-transactions',
        icon: 'Transaction',
      },
      {
        name: 'PennyDrop',
        path: '/pennydrop-transactions',
        icon: 'Transaction',
      },
    ],
  },
  {
    id: 6,
    header: 'Accounting',
    key: 'accounting',
    path: '/accounting',
    icon: 'Transaction',
    isDropdown: false,
    category: [
      {
        name: 'Accounting',
        path: '/accounting',
        icon: 'Transaction',
      },
    ],
  },
  {
    id: 7,
    header: 'Reports',
    key: 'reports',
    isDropdown: true,
    icon: 'Report',
    category: [
      {
        name: 'Orders marking',
        path: '/reports',
        icon: 'Report',
      },
      {
        name: 'Holdings',
        path: '/holdings',
        icon: 'Users',
      },
      {
        name: 'Wishlist',
        path: '/wishlist',
        icon: 'Users',
      },
      {
        name: 'PC Wishlist',
        path: '/pc-wishlist',
        icon: 'Users',
      },
      {
        name: 'Nominators',
        path: '/nominators',
        icon: 'Users',
      },
      {
        name: 'PC Enquiries',
        path: '/pc-enquiries',
        icon: 'Users',
      },
      {
        name: 'Webhook',
        path: '/webhook',
        icon: 'Report',
      },
      {
        name: 'SES Webhook',
        path: '/ses_webhook',
        icon: 'Report',
      },
      {
        name: 'Interakt Webhook',
        path: '/interakt_webhook',
        icon: 'Report',
      },
      {
        name: 'Cron Report',
        path: '/cron-report',
        icon: 'CronReport',
      },
      {
        name: 'Logs',
        path: '/logs',
        icon: 'Report',
      },
      {
        name: 'Dashboard Events',
        path: '/dashboard-events',
        icon: 'Report',
      },
    ],
  },
  // {
  //   id: 8,
  //   header: 'CMS',
  //   key: 'cms',
  //   isDropdown: true,
  //   icon: 'Blog',
  //   category: [
  //     { name: 'Blogs', path: '/blogs', icon: 'Blog' },
  //     { name: 'Banners', path: '/banner', icon: 'Blog' },
  //     { name: 'News', path: '/news', icon: 'Blog' },
  //     { name: 'FAQs', path: '/faqs', icon: 'Blog' },
  //     { name: 'Authors', path: '/authors', icon: 'Author' },
  //     { name: 'Categories', path: '/pc-asset-categories', icon: 'Author' },
  //   ],
  // },
  {
    header: 'Dashboard Users',
    key: 'dashboard_users',
    path: '/dashboard-users',
    icon: 'Users',
    isDropdown: false,
    category: [
      {
        name: 'Dashboard Users',
        path: '/dashboard-users',
        icon: 'Users',
      },
    ],
  },
  {
    header: 'Roles',
    key: 'roles',
    path: '/roles',
    icon: 'Users',
    isDropdown: false,
    category: [
      {
        name: 'Roles',
        path: '/roles',
        icon: 'Users',
      },
    ],
  },
  {
    header: 'Config',
    key: 'config',
    path: '/config',
    icon: 'SettingsIcon',
    isDropdown: false,
    category: [
      {
        name: 'Config',
        path: '/config',
        icon: 'Users',
      },
    ],
  },
]
