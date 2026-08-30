import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Sparkles, ArrowRight } from "lucide-react";

const footerLinks = {
  company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Sustainability", href: "#" },
  ],
  customer: [
    { label: "Help Center", href: "#" },
    { label: "Track Order", href: "/orders" },
    { label: "Returns & Refunds", href: "#" },
    { label: "Shipping Policy", href: "#" },
    { label: "Payment Options", href: "#" },
  ],
  categories: [
    { label: "Electronics", href: "/products?category=electronics" },
    { label: "Fashion", href: "/products?category=fashion" },
    { label: "Home & Living", href: "/products?category=home-living" },
    { label: "Beauty", href: "/products?category=beauty" },
    { label: "Sports", href: "/products?category=sports" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-navy-900 dark:bg-navy-950 text-white mt-auto">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-1">Stay in the loop</h3>
              <p className="text-white/60 text-sm">Get exclusive deals, new arrivals, and special offers directly in your inbox.</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email..."
                className="flex-1 md:w-72 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-brand-500 focus:bg-white/15 transition-all"
              />
              <button className="flex items-center gap-2 px-5 py-3 bg-brand-500 hover:bg-brand-600 rounded-xl text-sm font-semibold transition-colors flex-shrink-0">
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center">
                <span className="font-display text-xl font-bold text-white">Shop</span>
                <span className="font-display text-xl font-bold text-brand-400">Nest</span>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              Your premium online shopping destination. Discover millions of products from trusted sellers with fast delivery and easy returns.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Phone className="w-4 h-4 text-brand-400" />
                +91 1800-123-4567
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Mail className="w-4 h-4 text-brand-400" />
                support@shopnest.com
              </div>
              <div className="flex items-start gap-2 text-sm text-white/60">
                <MapPin className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                ShopNest HQ, Embassy Tech Village, Bengaluru 560103
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-white/60 hover:text-brand-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Customer</h4>
            <ul className="space-y-2.5">
              {footerLinks.customer.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-white/60 hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Categories</h4>
            <ul className="space-y-2.5">
              {footerLinks.categories.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-white/60 hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            © 2024 ShopNest. All rights reserved. Built with ❤️ in India.
          </p>
          <div className="flex items-center gap-3">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-brand-500 flex items-center justify-center transition-colors"
              >
                <Icon className="w-4 h-4 text-white/70" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
