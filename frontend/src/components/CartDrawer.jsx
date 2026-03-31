import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Trash2, CreditCard, Gamepad2, ArrowRight, Loader2 } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose, cart, onRemove, onCheckout, ordering }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[200]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-violet-500/20 shadow-2xl z-[201] flex flex-col"
          >
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-violet-500/5">
              <div className="flex items-center space-x-3">
                <div className="bg-violet-500 p-2 rounded-xl shadow-lg shadow-violet-500/20">
                  <Gamepad2 className="text-white w-5 h-5 text-shadow" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">Game Library</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
                <X className="w-6 h-6 text-slate-400 hover:text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                  <ShoppingCart className="w-16 h-16 text-slate-700" />
                  <p className="text-slate-400 font-medium">Your library is empty.<br />Add some games to get started!</p>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div 
                    layout
                    key={item.productId}
                    className="group bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 hover:border-violet-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-white group-hover:text-violet-400 transition-colors uppercase text-sm tracking-wide">{item.name}</h4>
                        <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Digital Edition</p>
                      </div>
                      <button onClick={() => onRemove(item.productId)} className="text-slate-600 hover:text-red-400 p-1.5 hover:bg-red-500/5 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2 bg-slate-900 rounded-lg p-1 px-2 border border-slate-700/50">
                        <span className="text-xs font-bold text-slate-400">{item.quantity}x</span>
                        <span className="text-xs font-bold text-violet-400">${item.price}</span>
                      </div>
                      <span className="text-sm font-black text-white">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Subtotal</span>
                  <span className="text-2xl font-black text-white glow-text">${total.toFixed(2)}</span>
                </div>
                
                <button
                  disabled={ordering}
                  onClick={onCheckout}
                  className="w-full neon-button text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center space-x-3 active:scale-95 disabled:opacity-50"
                >
                  {ordering ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Secure Checkout</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center space-x-2 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                  <CreditCard className="w-3 h-3" />
                  <span>Encrypted Payment Processing</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
