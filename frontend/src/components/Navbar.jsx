import React from 'react';
import { ShoppingCart, User, LogOut, Gamepad2, Library, Ghost } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ currentUser, onLogout, setActiveTab, activeTab, cartCount, onOpenCart }) => {
  return (
    <nav className="glass-nav px-6 py-4 flex items-center justify-between sticky top-0 z-[150]">
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-center space-x-3 group cursor-pointer"
        onClick={() => setActiveTab('products')}
      >
        <div className="bg-violet-600 p-2.5 rounded-2xl shadow-lg shadow-violet-900/40 transform group-hover:rotate-12 transition-transform">
          <Gamepad2 className="text-white w-6 h-6 glow-text" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black text-white tracking-widest uppercase leading-none">Nexus</span>
          <span className="text-[10px] font-bold text-violet-400 uppercase tracking-[0.2em]">Gaming Hub 2.0</span>
        </div>
      </motion.div>

      <div className="hidden md:flex items-center space-x-10 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
        <button 
          onClick={() => setActiveTab('products')}
          className={`hover:text-white transition-all relative py-2 ${activeTab === 'products' ? 'text-violet-400' : ''}`}
        >
          Discover
          {activeTab === 'products' && <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 shadow-lg shadow-violet-500/50" />}
        </button>
        {currentUser && (
          <button 
            onClick={() => setActiveTab('orders')}
            className={`hover:text-white transition-all relative py-2 ${activeTab === 'orders' ? 'text-violet-400' : ''}`}
          >
            My Library
            {activeTab === 'orders' && <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 shadow-lg shadow-violet-500/50" />}
          </button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {currentUser ? (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenCart}
              className="relative p-2.5 bg-slate-800/80 rounded-2xl border border-slate-700/50 hover:bg-slate-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-slate-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-violet-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-violet-500/40">
                  {cartCount}
                </span>
              )}
            </motion.button>
            
            <div className="h-8 w-px bg-slate-700/50" />
            
            <div className="hidden sm:flex items-center space-x-3 ml-2">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Player</p>
                <p className="text-xs font-black text-white uppercase">{currentUser.name}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-900/40 border border-violet-400/20">
                {currentUser.name[0]}
              </div>
            </div>

            <button 
              onClick={onLogout}
              className="p-2.5 text-slate-500 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('auth')}
            className="neon-button text-white px-6 py-2.5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-violet-900/40"
          >
            Launch Hub
          </motion.button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
