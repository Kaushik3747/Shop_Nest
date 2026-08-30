export const APP_NAME = "ShopNest";
export const APP_TAGLINE = "Your Premium Shopping Destination";

export const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating_desc", label: "Highest Rated" },
  { value: "reviews_desc", label: "Most Reviewed" },
  { value: "discount_desc", label: "Biggest Discount" },
  { value: "best_selling", label: "Best Selling" },
];

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
  refunded: "Refunded",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
  confirmed: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
  processing: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20",
  packed: "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
  shipped: "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20",
  out_for_delivery: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
  delivered: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
  cancelled: "text-red-600 bg-red-50 dark:bg-red-900/20",
  returned: "text-gray-600 bg-gray-50 dark:bg-gray-900/20",
  refunded: "text-teal-600 bg-teal-50 dark:bg-teal-900/20",
};

export const CURRENCIES = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
];

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "ta", name: "Tamil" },
];

export const ACCENT_COLORS = [
  { name: "Amber", value: "#f59e0b" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Emerald", value: "#10b981" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Indigo", value: "#6366f1" },
];

export const SHIPPING_OPTIONS = [
  {
    id: "standard",
    name: "Standard Delivery",
    description: "5-7 business days",
    price: 49,
    days: 7,
  },
  {
    id: "express",
    name: "Express Delivery",
    description: "2-3 business days",
    price: 99,
    days: 3,
  },
  {
    id: "same_day",
    name: "Same Day Delivery",
    description: "Order before 12 PM",
    price: 199,
    days: 0,
  },
];

export const PAYMENT_METHODS = [
  { id: "card", name: "Credit/Debit Card", icon: "💳" },
  { id: "upi", name: "UPI Payment", icon: "📱" },
  { id: "netbanking", name: "Net Banking", icon: "🏦" },
  { id: "cod", name: "Cash on Delivery", icon: "💵" },
  { id: "wallet", name: "Wallet", icon: "👛" },
];

export const TAX_RATE = 0.18; // 18% GST

export const ITEMS_PER_PAGE = 12;

export const MAX_CART_QUANTITY = 10;

export const DEMO_ADMIN = {
  email: "admin@shopnest.com",
  password: "admin123",
};

export const DEMO_USER = {
  email: "user@shopnest.com",
  password: "user123",
};
