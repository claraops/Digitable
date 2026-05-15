import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { getTotalItems } = useCart();

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'À propos', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-white-pure border-b border-gray-light sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-black-deep">
            Menu<span className="text-gold">Pro</span>
          </Link>

          <div className="hidden md:flex gap-8">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path}
                className="text-gray-dark hover:text-gold transition-colors">
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/profile" className="text-gray-dark hover:text-gold">
              <User size={24} />
            </Link>
            <Link to="/cart" className="relative text-gray-dark hover:text-gold">
              <ShoppingCart size={24} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-black-deep text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-light">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path}
                className="block py-2 text-gray-dark hover:text-gold"
                onClick={() => setIsOpen(false)}>
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}