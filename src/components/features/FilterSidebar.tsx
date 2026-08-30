import { useState } from "react";
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from "lucide-react";
import type { FilterState } from "@/types";
import { cn } from "@/lib/utils";
import { brands, categories } from "@/data/mockData";

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: Partial<FilterState>) => void;
  onClear: () => void;
  activeCount: number;
  isOpen?: boolean;
  onClose?: () => void;
}

function FilterSection({ title, children, defaultOpen = true }: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border pb-4 mb-4 last:border-0">
      <button
        className="flex items-center justify-between w-full text-sm font-semibold text-foreground mb-3"
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && children}
    </div>
  );
}

export default function FilterSidebar({ filters, onChange, onClear, activeCount, isOpen, onClose }: FilterSidebarProps) {
  const colorOptions = ["Red", "Blue", "Black", "White", "Green", "Yellow", "Pink", "Purple", "Gray", "Brown"];
  const sizeOptions = ["XS", "S", "M", "L", "XL", "2XL", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10"];

  const content = (
    <div className="bg-card border border-border rounded-2xl p-5 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-500" />
          <h3 className="font-bold text-foreground">Filters</h3>
          {activeCount > 0 && (
            <span className="w-5 h-5 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-brand-500 hover:text-brand-600 font-medium flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <FilterSection title="Category">
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.slug)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...filters.categories, cat.slug]
                    : filters.categories.filter((c) => c !== cat.slug);
                  onChange({ categories: updated });
                }}
                className="w-4 h-4 rounded border-border accent-brand-500"
              />
              <span className="text-sm text-foreground group-hover:text-brand-500 transition-colors flex-1">
                {cat.name}
              </span>
              <span className="text-xs text-muted-foreground">{cat.productCount}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Brand">
        <div className="space-y-2">
          {brands.slice(0, 6).map((brand) => (
            <label key={brand.id} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand.name)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...filters.brands, brand.name]
                    : filters.brands.filter((b) => b !== brand.name);
                  onChange({ brands: updated });
                }}
                className="w-4 h-4 rounded border-border accent-brand-500"
              />
              <span className="text-sm text-foreground group-hover:text-brand-500 transition-colors">
                {brand.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>₹{filters.priceRange[0].toLocaleString()}</span>
            <span>₹{filters.priceRange[1].toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={0}
            max={200000}
            step={1000}
            value={filters.priceRange[1]}
            onChange={(e) => onChange({ priceRange: [filters.priceRange[0], Number(e.target.value)] })}
            className="w-full accent-brand-500"
          />
          <div className="grid grid-cols-2 gap-2">
            {[[0, 1000], [1000, 5000], [5000, 20000], [20000, 100000]].map(([min, max]) => (
              <button
                key={`${min}-${max}`}
                onClick={() => onChange({ priceRange: [min, max] })}
                className={cn(
                  "text-xs py-1.5 rounded-lg border transition-colors",
                  filters.priceRange[0] === min && filters.priceRange[1] === max
                    ? "bg-brand-500 text-white border-brand-500"
                    : "border-border text-muted-foreground hover:border-brand-300"
                )}
              >
                ₹{min > 0 ? `${(min/1000).toFixed(0)}K` : "0"} - ₹{(max/1000).toFixed(0)}K
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Customer Rating">
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === rating}
                onChange={() => onChange({ rating })}
                className="w-4 h-4 accent-brand-500"
              />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={cn("text-sm", i < rating ? "text-brand-400" : "text-muted-foreground")}>★</span>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">& above</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Discount */}
      <FilterSection title="Discount">
        <div className="space-y-2">
          {[10, 20, 30, 50].map((disc) => (
            <label key={disc} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.discount >= disc}
                onChange={(e) => onChange({ discount: e.target.checked ? disc : 0 })}
                className="w-4 h-4 rounded accent-brand-500"
              />
              <span className="text-sm text-foreground">{disc}% or more</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Colors */}
      <FilterSection title="Color" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((color) => (
            <button
              key={color}
              onClick={() => {
                const updated = filters.colors.includes(color)
                  ? filters.colors.filter((c) => c !== color)
                  : [...filters.colors, color];
                onChange({ colors: updated });
              }}
              className={cn(
                "text-xs px-3 py-1.5 rounded-lg border transition-all",
                filters.colors.includes(color)
                  ? "bg-brand-500 text-white border-brand-500"
                  : "border-border text-muted-foreground hover:border-brand-300"
              )}
            >
              {color}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability" defaultOpen={false}>
        <div className="space-y-2">
          {[
            { value: "all", label: "All Products" },
            { value: "in_stock", label: "In Stock" },
            { value: "out_of_stock", label: "Out of Stock" },
          ].map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="availability"
                checked={filters.availability === value}
                onChange={() => onChange({ availability: value as FilterState["availability"] })}
                className="w-4 h-4 accent-brand-500"
              />
              <span className="text-sm text-foreground">{label}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  // Mobile drawer
  if (onClose !== undefined) {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-background overflow-y-auto p-4 animate-slide-in-right">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-foreground">Filters</h2>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>
          </div>
        )}
      </>
    );
  }

  return content;
}
