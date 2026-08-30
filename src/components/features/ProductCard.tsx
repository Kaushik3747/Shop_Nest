import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn, formatCurrency } from "@/lib/utils";
import Badge from "@/components/ui-custom/Badge";

interface ProductCardProps {
  product: Product;
  view?: "grid" | "list";
  currency?: string;
}

export default function ProductCard({ product, view = "grid", currency = "INR" }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  if (view === "list") {
    return (
      <div className="bg-card border border-border rounded-2xl p-4 flex gap-4 card-hover group">
        {/* Image */}
        <Link to={`/products/${product.id}`} className="flex-shrink-0">
          <div className="w-32 h-32 bg-muted rounded-xl overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-medium">{product.brand}</p>
              <Link to={`/products/${product.id}`}>
                <h3 className="font-semibold text-foreground hover:text-brand-500 transition-colors line-clamp-2 mt-0.5">
                  {product.name}
                </h3>
              </Link>
            </div>
            {product.badge && (
              <Badge variant={product.badge}>{product.badge.toUpperCase()}</Badge>
            )}
          </div>

          <div className="flex items-center gap-1.5 mt-2">
            <Star className="w-3.5 h-3.5 text-brand-400 fill-brand-400" />
            <span className="text-sm font-medium text-foreground">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviewCount.toLocaleString()})</span>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <span className="text-lg font-bold text-brand-500">{formatCurrency(product.price, currency)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-sm text-muted-foreground line-through">{formatCurrency(product.originalPrice, currency)}</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">
                  -{product.discount}%
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => addToCart(product)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                inCart
                  ? "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400"
                  : "bg-brand-500 hover:bg-brand-600 text-white"
              )}
            >
              <ShoppingCart className="w-4 h-4" />
              {inCart ? "In Cart" : "Add to Cart"}
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className={cn(
                "p-2 rounded-xl border transition-all",
                inWishlist
                  ? "border-red-300 bg-red-50 dark:bg-red-900/20 text-red-500"
                  : "border-border hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-500"
              )}
            >
              <Heart className={cn("w-4 h-4", inWishlist && "fill-current")} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      className="bg-card border border-border rounded-2xl overflow-hidden card-hover group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <Link to={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-muted">
        {!imageLoaded && <div className="absolute inset-0 skeleton" />}
        <img
          src={product.images[0]}
          alt={product.name}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            hovered ? "scale-110" : "scale-100",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badge && (
            <Badge variant={product.badge}>{product.badge.toUpperCase()}</Badge>
          )}
          {product.discount > 0 && (
            <Badge variant="sale">-{product.discount}%</Badge>
          )}
        </div>

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-black/70 text-white text-sm font-semibold px-3 py-1 rounded-lg">Out of Stock</span>
          </div>
        )}

        {/* Action buttons */}
        <div className={cn(
          "absolute top-2 right-2 flex flex-col gap-1.5 transition-all duration-300",
          hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        )}>
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
            className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center shadow-lg transition-all",
              inWishlist
                ? "bg-red-500 text-white"
                : "bg-white/90 dark:bg-card/90 text-muted-foreground hover:text-red-500 hover:bg-white"
            )}
          >
            <Heart className={cn("w-4 h-4", inWishlist && "fill-current")} />
          </button>
          <Link
            to={`/products/${product.id}`}
            className="w-8 h-8 rounded-xl bg-white/90 dark:bg-card/90 flex items-center justify-center shadow-lg text-muted-foreground hover:text-brand-500 transition-all"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </Link>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-muted-foreground font-medium">{product.brand}</p>
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-foreground text-sm leading-tight mt-0.5 line-clamp-2 hover:text-brand-500 transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-1.5">
          <Star className="w-3 h-3 text-brand-400 fill-brand-400" />
          <span className="text-xs font-medium text-foreground">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount >= 1000 ? `${(product.reviewCount / 1000).toFixed(1)}k` : product.reviewCount})</span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-bold text-brand-500">{formatCurrency(product.price, currency)}</span>
          {product.discount > 0 && (
            <span className="text-xs text-muted-foreground line-through">{formatCurrency(product.originalPrice, currency)}</span>
          )}
        </div>

        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className={cn(
            "w-full mt-3 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all",
            product.stock === 0
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : inCart
                ? "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 hover:bg-brand-200"
                : "bg-brand-500 hover:bg-brand-600 text-white shadow-sm hover:shadow-brand-500/30 hover:shadow-md"
          )}
        >
          <ShoppingCart className="w-4 h-4" />
          {product.stock === 0 ? "Out of Stock" : inCart ? "In Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
