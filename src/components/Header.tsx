import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, UserRound } from 'lucide-react';
import NotificationBell from './NotificationBell';
import VisualSearchButton from './VisualSearchButton';
import VoiceSearchButton from './VoiceSearchButton';
import { useCart } from '@/context/CartContext';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrency } from '@/context/CurrencyContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Header: React.FC = () => {
  const { cartItemCount } = useCart(); // Get cart item count from context
  const { isAuthenticated, user, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 py-4 px-6 flex flex-wrap gap-4 items-center bg-background">
      <div className="flex flex-1 items-center space-x-6">
        <Link to="/" className="flex items-center space-x-2">
          <Logo className="h-10 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/products" className="text-sm font-medium uppercase tracking-wide text-foreground hover:text-accent-gold transition-colors">
            Shop
          </Link>
          <Link to="/categories" className="text-sm font-medium uppercase tracking-wide text-foreground hover:text-accent-gold transition-colors">
            Categories
          </Link>
          <Link to="/about" className="text-sm font-medium uppercase tracking-wide text-foreground hover:text-accent-gold transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-sm font-medium uppercase tracking-wide text-foreground hover:text-accent-gold transition-colors">
            Contact
          </Link>
          <Link to="/wishlist" className="text-sm font-medium uppercase tracking-wide text-foreground hover:text-accent-gold transition-colors">
            Wishlist
          </Link>
          <Link to="/compare" className="text-sm font-medium uppercase tracking-wide text-foreground hover:text-accent-gold transition-colors">
            Compare
          </Link>
          <Link to="/support/help" className="text-sm font-medium uppercase tracking-wide text-foreground hover:text-accent-gold transition-colors">
            Help
          </Link>
          <Link to="/vendor/apply" className="text-sm font-medium uppercase tracking-wide text-foreground hover:text-accent-gold transition-colors">
            Become a vendor
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <VoiceSearchButton size="icon" variant="ghost" />
        <VisualSearchButton />
        <NotificationBell />
        <Select value={currency} onValueChange={(value) => setCurrency(value as typeof currency)}>
          <SelectTrigger className="w-[90px] text-xs uppercase tracking-wide">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="EUR">EUR</SelectItem>
            <SelectItem value="GBP">GBP</SelectItem>
          </SelectContent>
        </Select>
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
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <UserRound className="h-4 w-4" />
                <span className="hidden sm:inline-flex">{user.name.split(" ")[0]}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-semibold">
                {user.name}
                <p className="text-xs font-normal text-muted-foreground capitalize">{user.role}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/account">Account dashboard</Link>
              </DropdownMenuItem>
              {user.role === 'vendor' && (
                <DropdownMenuItem asChild>
                  <Link to="/vendor/dashboard">Vendor workspace</Link>
                </DropdownMenuItem>
              )}
              {user.role === 'admin' && (
                <DropdownMenuItem asChild>
                  <Link to="/admin">Admin panel</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link to="/account/orders">Order history</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/account/addresses">Saved addresses</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link to="/login">
              <Button variant="ghost" className="text-sm font-semibold">
                Sign in
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-accent-gold text-accent-gold-foreground hover:bg-accent-gold/90">
                Join now
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;