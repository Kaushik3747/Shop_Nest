import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Zap, Star, Truck, RotateCcw, Shield, Share2, ChevronLeft, ChevronRight, Minus, Plus, Check } from "lucide-react";
import { mockProducts, mockReviews } from "@/data/mockData";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/features/ProductCard";
import StarRating from "@/components/ui-custom/StarRating";
import Badge from "@/components/ui-custom/Badge";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = mockProducts.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "");
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews">("description");
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold mb-2">Product not found</h2>
        <Link to="/products" className="text-brand-500 hover:text-brand-600 font-medium">← Back to Products</Link>
      </div>
    );
  }

  const reviews = mockReviews.filter((r) => r.productId === product.id);
  const related = mockProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    navigate("/checkout");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-brand-500">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-brand-500">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category.toLowerCase()}`} className="hover:text-brand-500">{product.category}</Link>
        <span>/</span>
        <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 mb-12">
        {/* Images */}
        <div>
          <div className="relative bg-muted rounded-2xl overflow-hidden aspect-square mb-3 group">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {product.badge && (
              <div className="absolute top-4 left-4">
                <Badge variant={product.badge}>{product.badge.toUpperCase()}</Badge>
              </div>
            )}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage((i) => Math.max(0, i - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-card/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedImage((i) => Math.min(product.images.length - 1, i + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-card/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={cn(
                  "w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all",
                  selectedImage === i ? "border-brand-500" : "border-border hover:border-brand-300"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">{product.brand}</p>
              <h1 className="text-2xl font-bold text-foreground leading-tight">{product.name}</h1>
            </div>
            <button
              onClick={() => toggleWishlist(product)}
              className={cn(
                "p-2.5 rounded-xl border-2 transition-all flex-shrink-0",
                isInWishlist(product.id)
                  ? "border-red-300 bg-red-50 dark:bg-red-900/20 text-red-500"
                  : "border-border hover:border-red-300 text-muted-foreground hover:text-red-500"
              )}
            >
              <Heart className={cn("w-5 h-5", isInWishlist(product.id) && "fill-current")} />
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={product.rating} size="md" showValue />
            <span className="text-sm text-muted-foreground">({product.reviewCount.toLocaleString()} reviews)</span>
            <span className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full font-medium">
              {product.stock > 10 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left!` : "Out of Stock"}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl font-bold text-brand-500">{formatCurrency(product.price)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-lg text-muted-foreground line-through">{formatCurrency(product.originalPrice)}</span>
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>
          {product.discount > 0 && (
            <p className="text-sm text-emerald-600 font-medium mb-5">
              You save {formatCurrency(product.originalPrice - product.price)}!
            </p>
          )}

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-foreground mb-2">Color: <span className="font-normal text-muted-foreground">{selectedColor}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl border text-sm transition-all",
                      selectedColor === color
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-medium"
                        : "border-border text-muted-foreground hover:border-brand-300"
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-foreground mb-2">Size: <span className="font-normal text-muted-foreground">{selectedSize}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl border text-sm transition-all",
                      selectedSize === size
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-medium"
                        : "border-border text-muted-foreground hover:border-brand-300"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <p className="text-sm font-semibold text-foreground">Quantity:</p>
            <div className="flex items-center border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-semibold text-foreground">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-sm text-muted-foreground">{product.stock} available</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all",
                isInCart(product.id)
                  ? "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 border border-brand-300"
                  : "bg-brand-500 hover:bg-brand-600 text-white shadow-lg hover:shadow-brand-500/30"
              )}
            >
              {isInCart(product.id) ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
              {isInCart(product.id) ? "Added to Cart" : "Add to Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-foreground text-background hover:opacity-90 transition-all"
            >
              <Zap className="w-5 h-5" />
              Buy Now
            </button>
          </div>

          {/* Delivery Info */}
          <div className="bg-muted/50 rounded-2xl p-4 space-y-3 mb-4">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-brand-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Free Delivery</p>
                <p className="text-xs text-muted-foreground">Estimated delivery in {product.deliveryDays} days</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-brand-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{product.returnPolicy || "30-day returns"}</p>
                <p className="text-xs text-muted-foreground">Change of mind returns accepted</p>
              </div>
            </div>
            {product.warranty && (
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-brand-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{product.warranty}</p>
                  <p className="text-xs text-muted-foreground">Seller: {product.seller}</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => { navigator.share?.({ title: product.name, url: window.location.href }); toast.success("Link copied!"); }}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-500 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share this product
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border border-border rounded-2xl overflow-hidden mb-12">
        <div className="flex border-b border-border overflow-x-auto scrollbar-thin">
          {(["description", "specifications", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-4 text-sm font-semibold capitalize whitespace-nowrap transition-colors flex-shrink-0",
                activeTab === tab
                  ? "text-brand-500 border-b-2 border-brand-500 bg-brand-50 dark:bg-brand-900/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {tab} {tab === "reviews" && `(${reviews.length})`}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "description" && (
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          )}

          {activeTab === "specifications" && (
            <div className="grid sm:grid-cols-2 gap-3">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                  <span className="text-sm font-semibold text-foreground w-36 flex-shrink-0">{key}</span>
                  <span className="text-sm text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              {/* Rating Summary */}
              <div className="flex items-center gap-6 mb-6 p-4 bg-muted/30 rounded-2xl">
                <div className="text-center">
                  <div className="text-5xl font-bold text-foreground">{product.rating}</div>
                  <StarRating rating={product.rating} size="md" />
                  <p className="text-xs text-muted-foreground mt-1">{product.reviewCount.toLocaleString()} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs w-4 text-muted-foreground">{star}</span>
                      <Star className="w-3 h-3 text-brand-400 fill-brand-400" />
                      <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-brand-400 h-full rounded-full"
                          style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 6 : star === 2 ? 3 : 1}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-6">{star === 5 ? "70%" : star === 4 ? "20%" : star === 3 ? "6%" : star === 2 ? "3%" : "1%"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {reviews.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-border rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <img src={review.userAvatar} alt={review.userName} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-sm text-foreground">{review.userName}</span>
                              {review.isVerifiedPurchase && (
                                <span className="ml-2 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded font-medium">
                                  ✓ Verified
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                          </div>
                          <StarRating rating={review.rating} size="sm" className="mt-1" />
                          <h4 className="font-semibold text-sm text-foreground mt-2">{review.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{review.body}</p>
                          <button className="text-xs text-muted-foreground hover:text-foreground mt-2">
                            👍 Helpful ({review.helpfulCount})
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
