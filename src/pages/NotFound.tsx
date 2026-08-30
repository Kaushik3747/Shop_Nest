import { Link } from "react-router-dom";
import { Home, Search, Package } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-4 max-w-lg">
        <div className="text-8xl font-display font-bold text-brand-200 dark:text-brand-900/50 mb-4">404</div>
        <h1 className="text-2xl font-bold text-foreground mb-3">Page Not Found</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-colors">
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link to="/search" className="flex items-center justify-center gap-2 px-6 py-3 border border-border hover:border-brand-400 rounded-xl font-semibold text-foreground transition-colors">
            <Search className="w-4 h-4" /> Search Products
          </Link>
          <Link to="/orders" className="flex items-center justify-center gap-2 px-6 py-3 border border-border hover:border-brand-400 rounded-xl font-semibold text-foreground transition-colors">
            <Package className="w-4 h-4" /> My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
