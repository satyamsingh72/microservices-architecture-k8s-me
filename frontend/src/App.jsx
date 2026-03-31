import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import ProductList from './components/ProductList';
import OrderHistory from './components/OrderHistory';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState('products'); 
  const [cart, setCart] = useState([]);
  const [ordering, setOrdering] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && token) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, [token]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleLoginSuccess = (user, token) => {
    setCurrentUser(user);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    setActiveTab('products');
    showToast(`Welcome back, Commander ${user.name.split(' ')[0]}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setActiveTab('auth');
    showToast('Logged out of Nexus Hub');
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product._id);
      if (existing) {
        return prev.map(item => item.productId === product._id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
        );
      }
      return [...prev, { productId: product._id, name: product.name, price: product.price, quantity: 1 }];
    });
    showToast(`${product.name} added to library`);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const placeOrder = async () => {
    if (!currentUser) {
      setActiveTab('auth');
      setIsCartOpen(false);
      return;
    }
    
    setOrdering(true);
    try {
      const userId = currentUser.id || currentUser._id;
      if (!userId) throw new Error('User session missing ID');
      
      await axios.post('/api/orders', {
        userId,
        items: cart,
        totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      });
      
      showToast('Purchase Successful! Games added to library.');
      setCart([]);
      setIsCartOpen(false);
      setTimeout(() => setActiveTab('orders'), 800);
    } catch (err) {
      console.error('Purchase failed', err);
      showToast('Encrypted transaction failed. Try again.', 'error');
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gaming-dark">
      <Navbar 
        currentUser={currentUser} 
        onLogout={handleLogout} 
        setActiveTab={setActiveTab} 
        activeTab={activeTab}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'auth' && !currentUser && <Auth onLoginSuccess={handleLoginSuccess} />}
            {activeTab === 'products' && <ProductList onAddToCart={addToCart} />}
            {activeTab === 'orders' && currentUser && <OrderHistory userId={currentUser.id || currentUser._id} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        onCheckout={placeOrder}
        ordering={ordering}
      />

      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>

      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] bg-cyan-600/10 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}

export default App;
