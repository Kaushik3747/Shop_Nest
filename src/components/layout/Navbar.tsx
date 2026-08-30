import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search, ShoppingCart, Heart, User, Bell, Menu, X, ChevronDown,
  Sun, Moon, Monitor, LogOut, Package, Settings, LayoutDashboard,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useTheme } from "@/context/ThemeContext";
import { mockNotifications } from "@/data/mockData";
import { cn, formatRelativeTime, getInitials } from "@/lib/utils";
import { categories } from "@/data/mockData";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems: cartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { theme, setTheme } = useTheme();

  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-background border-b border-border"
      )}
    >
      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-navy-800 to-navy-700 text-white text-xs text-center py-2 px-4">
        <span className="font-medium">🎉 Free shipping on orders above ₹499 | Use code</span>
        <span className="font-bold text-brand-300 ml-1">WELCOME20</span>
        <span className="font-medium"> for 20% off your first order!</span>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:flex items-center">
              <span className="font-display text-xl font-bold text-foreground">Shop</span>
              <span className="font-display text-xl font-bold text-brand-500">Nest</span>
            </div>
          </Link>

          {/* Categories Dropdown */}
          <div className="relative hidden md:block">
            <button
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 px-3 rounded-lg hover:bg-muted"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <Menu className="w-4 h-4" />
              All Categories
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showCategories && (
              <div
                className="absolute top-full left-0 mt-1 w-64 bg-popover border border-border rounded-xl shadow-xl py-2 z-50"
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.slug}`}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors text-sm"
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <div>
                      <div className="font-medium text-foreground">{cat.name}</div>
                      <div className="text-xs text-muted-foreground">{cat.productCount} products</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 hidden md:block max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all placeholder:text-muted-foreground"
              />
            </div>
          </form>

          <div className="flex-1 md:hidden" />

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Mobile Search */}
            <button
              className="md:hidden relative p-2 rounded-xl hover:bg-muted transition-colors"
              onClick={() => {
                setShowSearch(!showSearch);
                setTimeout(() => searchRef.current?.focus(), 100);
              }}
            >
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Theme Toggle */}
            <button
              className="hidden sm:flex p-2 rounded-xl hover:bg-muted transition-colors"
              onClick={() => setTheme(theme === "light" ? "dark" : theme === "dark" ? "system" : "light")}
              title={`Theme: ${theme}`}
            >
              {theme === "light" ? (
                <Sun className="w-5 h-5 text-brand-500" />
              ) : theme === "dark" ? (
                <Moon className="w-5 h-5 text-brand-400" />
              ) : (
                <Monitor className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {/* Notifications */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  className="relative p-2 rounded-xl hover:bg-muted transition-colors"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-xl shadow-xl z-50 animate-fade-in">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-semibold text-foreground">Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto scrollbar-thin">
                      {mockNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={cn(
                            "p-4 border-b border-border last:border-0 cursor-pointer hover:bg-muted/50 transition-colors",
                            !notif.isRead && "bg-brand-50 dark:bg-brand-900/10"
                          )}
                          onClick={() => setShowNotifications(false)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                              !notif.isRead ? "bg-brand-500" : "bg-transparent"
                            )} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">{notif.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(notif.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 rounded-xl hover:bg-muted transition-colors hidden sm:flex">
              <Heart className="w-5 h-5 text-muted-foreground" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-xl hover:bg-muted transition-colors">
              <ShoppingCart className="w-5 h-5 text-muted-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-muted transition-colors"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
                      {getInitials(user?.name || "U")}
                    </div>
                  )}
                  <span className="hidden lg:block text-sm font-medium text-foreground max-w-20 truncate">
                    {user?.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="hidden lg:block w-3.5 h-3.5 text-muted-foreground" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-xl shadow-xl z-50 py-2 animate-fade-in">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="font-semibold text-foreground text-sm">{user?.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 text-brand-500" />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4 text-muted-foreground" />
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Package className="w-4 h-4 text-muted-foreground" />
                      My Orders
                    </Link>
                    <Link
                      to="/profile?tab=settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4 text-muted-foreground" />
                      Settings
                    </Link>
                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors"
                        onClick={() => { logout(); setShowUserMenu(false); }}
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:block">Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        {showSearch && (
          <div className="md:hidden pb-3 animate-fade-in">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowSearch(false)}
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
}
