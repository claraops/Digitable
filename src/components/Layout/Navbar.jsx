import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, Globe } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useTranslation } from '../../i18n/I18nContext';
import logoImage from '../../assets/logo.webp';

const NavigationBar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { t, langue, changeLanguage } = useTranslation();

  useEffect(() => {
    setIsLoggedIn(Boolean(user));
  }, [user]);

  const navLinks = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.menu'), to: '/menu' },
    { label: t('nav.tables'), to: '/tables' },
    { label: t('nav.orders'), to: '/commandes' },
    { label: t('nav.invoices'), to: '/factures' },
    { label: t('nav.reviews'), to: '/avis' },
  ];

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 bg-black-deep text-white-pure border-b border-gray-dark">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo + Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gold/10 border border-gold/30 shadow-md group-hover:scale-105 transition-transform duration-300">
              <img 
                src={logoImage} 
                alt="Logo" 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <span className="font-bold text-lg sm:text-2xl">
              Menu<span className="text-gold/80">Digital</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 rounded-lg text-sm lg:text-base hover:bg-gray-100 transition-all duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 text-sm"
                aria-label="Langue"
              >
                <Globe size={18} className="sm:w-5 sm:h-5" />
              </button>
              {langOpen && (
                <>
                  <div className="absolute right-0 top-full mt-2 bg-white-pure rounded-xl shadow-lg border border-gray-light z-50 min-w-[140px] overflow-hidden" onClick={() => setLangOpen(false)}>
                    {[
                      { code: 'fr', label: 'Français' },
                      { code: 'en', label: 'English' },
                      { code: 'es', label: 'Español' },
                    ].map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => { changeLanguage(lang.code); setLangOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          langue === lang.code ? 'bg-gold/10 text-gold font-semibold' : 'text-black-deep hover:bg-gray-light'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                </>
              )}
            </div>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-all duration-300"
              aria-label="Panier"
            >
              <ShoppingCart size={20} className="sm:w-6 sm:h-6" />
              {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* Profile/Auth */}
            {isLoggedIn ? (
              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-all duration-300"
                aria-label="Profil"
              >
                <User size={20} />
                <span className="hidden lg:inline text-sm">{t('nav.profile')}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden sm:block px-3 py-2 text-sm lg:text-base hover:bg-gray-100 rounded-lg transition-all duration-300"
              >
                {t('nav.login')}
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-all duration-300"
              aria-label="Menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-dark py-3 sm:py-4 space-y-1 sm:space-y-2 bg-black-deep">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm hover:bg-white/10 rounded transition-all duration-300"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-dark pt-2 sm:pt-3 mt-2 sm:mt-3 space-y-2">
              {!isLoggedIn && (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100 rounded transition-all duration-300"
                >
                  <User size={18} className="inline mr-2" />
                  Connexion
                </Link>
              )}
              {isLoggedIn && (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-sm hover:bg-gray-100 rounded transition-all duration-300"
                  >
                    <User size={18} className="inline mr-2" />
                    Profil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white rounded transition-all duration-300"
                  >
                    <LogOut size={18} className="inline mr-2" />
                    {t('nav.logout')}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;