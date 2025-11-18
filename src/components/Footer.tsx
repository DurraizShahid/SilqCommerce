import React from 'react';
import { MadeWithDyad } from '@/components/made-with-dyad';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-8 px-6 text-center bg-background">
      <p className="text-muted-foreground text-sm mb-4">
        &copy; {new Date().getFullYear()} Modern Luxe. All rights reserved.
      </p>
      <div className="flex justify-center space-x-4 mb-4">
        <a href="#" className="text-muted-foreground hover:text-accent-gold transition-colors text-sm">Privacy Policy</a>
        <a href="#" className="text-muted-foreground hover:text-accent-gold transition-colors text-sm">Terms of Service</a>
      </div>
      <MadeWithDyad />
    </footer>
  );
};

export default Footer;