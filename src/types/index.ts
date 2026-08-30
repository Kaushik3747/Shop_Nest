export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  colors: string[];
  sizes: string[];
  stock: number;
  sku: string;
  tags: string[];
  badge?: "new" | "hot" | "sale" | "trending";
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isTrending: boolean;
  material?: string;
  weight?: string;
  warranty?: string;
  returnPolicy?: string;
  deliveryDays: number;
  seller: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  productCount: number;
  subcategories: string[];
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface Address {
  id: string;
  type: "home" | "work" | "other";
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "customer" | "admin" | "manager";
  dateOfBirth?: string;
  gender?: string;
  addresses: Address[];
  preferences: UserPreferences;
  createdAt: string;
  isActive: boolean;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  accentColor: string;
  fontSize: "small" | "medium" | "large";
  layout: "compact" | "comfortable" | "spacious";
  productView: "grid" | "list";
  language: string;
  currency: string;
  notifications: {
    orders: boolean;
    promotions: boolean;
    priceDrops: boolean;
    backInStock: boolean;
    newsletter: boolean;
  };
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
  selectedColor?: string;
  selectedSize?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded";

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  address: Address;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  couponDiscount: number;
  couponCode?: string;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  trackingId?: string;
  estimatedDelivery: string;
  timeline: OrderTimeline[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  description: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productId: string;
  rating: number;
  title: string;
  body: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "free_shipping" | "first_order";
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string;
  categories?: string[];
  products?: string[];
  description: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: "order" | "payment" | "shipping" | "promo" | "system";
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  averageOrderValue: number;
  conversionRate: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  dailySales: { date: string; revenue: number; orders: number }[];
  topProducts: { product: Product; revenue: number; orders: number }[];
  topCategories: { category: string; revenue: number; percentage: number }[];
  ordersByStatus: { status: OrderStatus; count: number }[];
  recentOrders: Order[];
}

export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number;
  discount: number;
  availability: "all" | "in_stock" | "out_of_stock";
  colors: string[];
  sizes: string[];
  sortBy: string;
}
