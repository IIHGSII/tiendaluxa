'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

// ── Initial State ──────────────────────────────────────────
const initialState = {
  items: [],
  isOpen: false,
};

// ── Reducer ────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + (action.payload.quantity || 1) }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          { ...action.payload, quantity: action.payload.quantity || 1 },
        ],
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload),
      };

    case 'UPDATE_QTY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.id !== id) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === id ? { ...i, quantity } : i
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'OPEN_CART':
      return { ...state, isOpen: true };

    case 'CLOSE_CART':
      return { ...state, isOpen: false };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'HYDRATE':
      return { ...state, items: action.payload };

    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────
const CartContext = createContext(null);

// ── Provider ───────────────────────────────────────────────
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('luxa_cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          dispatch({ type: 'HYDRATE', payload: parsed });
        }
      }
    } catch (_) {}
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('luxa_cart', JSON.stringify(state.items));
    } catch (_) {}
  }, [state.items]);

  // Computed values
  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal   = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping   = subtotal > 500000 ? 0 : (subtotal > 0 ? 35000 : 0);
  const total      = subtotal + shipping;

  const value = {
    items: state.items,
    isOpen: state.isOpen,
    totalItems,
    subtotal,
    shipping,
    total,
    addItem:    (product) => dispatch({ type: 'ADD_ITEM',    payload: product }),
    removeItem: (id)      => dispatch({ type: 'REMOVE_ITEM', payload: id }),
    updateQty:  (id, qty) => dispatch({ type: 'UPDATE_QTY',  payload: { id, quantity: qty } }),
    clearCart:  ()        => dispatch({ type: 'CLEAR_CART' }),
    openCart:   ()        => dispatch({ type: 'OPEN_CART' }),
    closeCart:  ()        => dispatch({ type: 'CLOSE_CART' }),
    toggleCart: ()        => dispatch({ type: 'TOGGLE_CART' }),
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
