import { useState, useEffect } from 'react';
import { CartContext } from './CartContext';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.idPlat === item.idPlat);
      if (existing) {
        return prev.map((i) =>
          i.idPlat === item.idPlat
            ? { ...i, quantite: i.quantite + (item.quantite || 1) }
            : i
        );
      }
      return [...prev, { ...item, quantite: item.quantite || 1 }];
    });
  };

  const removeFromCart = (idPlat) => {
    setCartItems((prev) => prev.filter((i) => i.idPlat !== idPlat));
  };

  const updateQuantity = (idPlat, quantite) => {
    if (quantite <= 0) {
      removeFromCart(idPlat);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.idPlat === idPlat ? { ...i, quantite } : i))
    );
  };

  const clearCart = () => setCartItems([]);

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => total + (item.prix * item.quantite), 0);

  const getTotalItems = () =>
    cartItems.reduce((total, item) => total + item.quantite, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
