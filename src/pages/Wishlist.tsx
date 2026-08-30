import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import StarRating from "@/components/ui-custom/StarRating";

export default function Wishlist() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="text-7xl mb-6">❤️</div>
        <h2 className="text-2xl font-bold text-foreground mb-3">Your wishlist is empty</h2>
        <p className="text-muted-foreground mb-8">Save your favorite products and shop them anytime.</p>
        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600 transition-colors">
          Discover Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          <h1 className="text-2xl font-bold text-foreground">My Wishlist</h1>
          <span className="text-sm text-muted-foreground">({items.length} items)</span>
        </div>
        <button onClick={clearWishlist} className="text-sm text-red-500 hover:text-red-600 font-medium">
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map(({ product, addedAt }) => (
          <div key={product.id} className="bg-card border border-border rounded-2xl overflow-hidden group card-hover">
            <div className="relative aspect-square overflow-hidden bg-muted">
              <Link to={`/products/${product.id}`}>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-2 right-2 w-8 h-8 bg-white/90 dark:bg-card/90 rounded-full flex items-center justify-center shadow text-red-500 hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded">Out of Stock</span>
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="text-xs text-muted-foreground">{product.brand}</p>
              <Link to={`/products/${product.id}`}>
                <h3 className="text-sm font-semibold text-foreground hover:text-brand-500 line-clamp-2 mt-0.5">{product.name}</h3>
              </Link>
              <StarRating rating={product.rating} size="sm" className="mt-1" />
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-sm font-bold text-brand-500">{formatCurrency(product.price)}</span>
                {product.discount > 0 && (
                  <span className="text-xs text-emerald-600">-{product.discount}%</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Added {formatDateShort(addedAt)}</p>
              <button
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 bg-brand-500 hover:bg-brand-600 disabled:bg-muted disabled:text-muted-foreground text-white rounded-xl text-xs font-semibold transition-colors"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
