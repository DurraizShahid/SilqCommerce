import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-background">
      <div className="container mx-auto flex flex-col gap-6 px-4 py-10 text-center md:flex-row md:items-center md:justify-between md:text-left">
        <div>
          <p className="text-base font-semibold text-foreground">SilqCommerce</p>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SilqCommerce. Curated luxury from independent designers worldwide.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <Link to="/contact" className="hover:text-accent-gold transition-colors">
            Contact
          </Link>
          <Link to="/about" className="hover:text-accent-gold transition-colors">
            About
          </Link>
          <Link to="/vendor/apply" className="hover:text-accent-gold transition-colors">
            Become a vendor
          </Link>
          <a href="#" className="hover:text-accent-gold transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-accent-gold transition-colors">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;