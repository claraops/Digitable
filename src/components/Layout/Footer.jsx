import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const links = [
    { label: 'Accueil', path: '/' },
    { label: 'Menu', path: '/menu' },
    { label: 'Commandes', path: '/commandes' },
  ];

  const contact = [
    { icon: Phone, text: '+33 1 23 45 67 89' },
    { icon: Mail, text: 'contact@menupro.fr' },
    { icon: MapPin, text: '123 Rue de Paris, 75001' },
  ];

  const socials = [
    { icon: FaFacebook, href: '#' },
    { icon: FaTwitter, href: '#' },
    { icon: FaInstagram, href: '#' },
  ];

  return (
    <footer className="bg-black-deep text-white-pure mt-auto border-t border-gray-dark">
      <div className="container-responsive section-padding">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Branding */}
          <div className="col-span-1">
            <h3 className="text-lg sm:text-2xl font-bold mb-2">
              Menu<span className="text-gold">Pro</span>
            </h3>
            <p className="text-gray-light text-xs sm:text-sm">Livraison rapide & qualité garantie</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              {links.map(link => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-gray-light hover:text-gold text-xs sm:text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Contact</h4>
            <ul className="space-y-2 sm:space-y-3">
              {contact.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-light text-xs sm:text-sm">
                  <item.icon size={16} className="mt-0.5 flex-shrink-0" />
                  <span className="break-words">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Suivez-nous</h4>
            <div className="flex gap-4">
              {socials.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="text-gray-light hover:text-gold transition-colors duration-300 inline-flex"
                  aria-label="Social media link"
                >
                  <social.icon size={20} className="sm:w-6 sm:h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-dark my-6 sm:my-8" />

        {/* Copyright */}
        <div className="text-center text-gray-light text-xs sm:text-sm">
          <p>&copy; {currentYear} MenuPro. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}