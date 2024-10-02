import { ReactNode } from 'react';

type TabType = {
  text: string;
  component: ReactNode;
  href?: string;
  subTabs?: TabType[];
};

const DASHBOARD_NAVIGATION: TabType[] = [
  {
    text: "Overview",
    component: "UserOverview",
    href: "/accounts/[slug]/",
  },
  {
    text: "Holdings",
    component: null,
    subTabs: [
      { text: "PE Holdings", component: "HoldingsTable", href: "/accounts/[slug]/holdings/" },
      { text: "PC Holdings", component: "PCHoldingsTable", href: "/accounts/[slug]/holdings/pcHoldings" },
    ],
  },
  {
    text: "Orders",
    component: null,
    subTabs: [
      {
        text: "PE Orders",
        component: null,
        href: "/accounts/[slug]/orders/peOrders",
        subTabs: [
          { text: "Buy", component: "OrdersTable", href: "/accounts/[slug]/orders/peOrders" },
          { text: "Sell", component: "SellOrdersTable", href: "/accounts/[slug]/orders/peOrders/peSell" },
        ],
      },
      { text: "PC Orders", component: "PCOrdersTable", href: "/accounts/[slug]/orders/pcOrders" },
    ],
  },
  {
    text: "Transactions",
    component: null,
    subTabs: [
      { text: "PE", component: "TransactionsTable", href: "/accounts/[slug]/transactions/pe" },
      { text: "Coin", component: "UserCoinTransactionsTable", href: "/accounts/[slug]/transactions/coin" },
      { text: "PennyDrop", component: "PennyDropTransactionTable", href: "/accounts/[slug]/transactions/penny-drop" },
      {
        text: "Wallet",
        component: null,
        href: "/accounts/[slug]/transactions/wallet",
        subTabs: [
          { text: "All", component: "AccountWallet", href: "/accounts/[slug]/transactions/wallet" },
          { 
            text: "Credit", 
            component: "CreditWalletTransactions",
            href: "/accounts/[slug]/transactions/wallet/credit",
            // subTabs: [
            //   { text: "All", component: null, href: "/accounts/[slug]/transactions/wallet/credit" },
            //   { text: "Process Pending Deposits", component: null, href: "/accounts/[slug]/transactions/wallet/credit" },
            // ],
          },
          { 
            text: "Debit", 
            component: "DebitWalletTransactions",
            href: "/accounts/[slug]/transactions/wallet/debit",
            subTabs: [
              { text: "All", component: null, href: "/accounts/[slug]/transactions/wallet/debit" },
              { text: "Order", component: null, href: "/accounts/[slug]/transactions/wallet/debit/order" },
              { text: "Withdrawals", component: null, href: "/accounts/[slug]/transactions/wallet/debit/withdrawals" },
              { text: "Process Pending Withdrawals", component: null, href: "/accounts/[slug]/transactions/wallet/debit/pending-withdrawals" },
            ],
          },
        ],
      },
    ],
  },
  {
    text: "Wishlist",
    component: null,
    subTabs: [
      { text: "PE Wishlist", component: "AccountWishlist", href: "/accounts/[slug]/wishlist/pe" },
      { text: "PC Wishlist", component: "AccountPcWishlistDetails", href: "/accounts/[slug]/wishlist/pc" },
    ],
  },
  {
    text: "Referral",
    component: "AccountReferral",
    href: "/accounts/[slug]/referral",
  },
  {
    text: "Wallet",
    component: "AccountWalletDetailsTable",
    href: "/accounts/[slug]/wallet",
  },
];

export default DASHBOARD_NAVIGATION;