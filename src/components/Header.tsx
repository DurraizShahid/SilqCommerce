import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { H1 } from '@/components/ui/typography';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext'; // Import useCart hook

const Header: React.FC = () => {
  const { cartItemCount } = useCart(); // Get cart item count from context

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 py-4 px-6 flex justify-between items-center bg-background">
      <Link to="/" className="flex items-center space-x-2">
        <H1 className="text-2xl font-bold text-primary dark:text-primary-foreground m-0">Modern Luxe</H1>
      </Link>
      <nav className="flex items-center space-x-6">
        <Link to="/products" className="text-lg font-medium text-foreground hover:text-accent-gold transition-colors">
          Shop
        </Link>
        <Link to="/categories" className="text-lg font-medium text-foreground hover:text-accent-gold transition-colors">
          Categories
        </Link>
        <Link to="/about" className="text-lg font-medium text-foreground hover:text-accent-gold transition-colors">
          About
        </Link>
        <Link to="/contact" className="text-lg font-medium text-foreground hover:text-accent-gold transition-colors">
          Contact
        </Link>
        <Link to="/cart" className="relative">
          <Button variant="ghost" size="icon" className="hover:bg-accent-gold/10">
            <ShoppingCart className="h-6 w-6 text-foreground hover:text-accent-gold" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent-gold text-accent-gold-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                {cartItemCount}
              </span>
            )}
          </Button>
        </Link>
        <Link to="/admin">
          <Button variant="outline" className="border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-accent-gold-foreground">
            Admin Panel
          </Button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;