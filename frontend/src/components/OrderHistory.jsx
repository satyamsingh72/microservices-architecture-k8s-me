import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Calendar, DollarSign, CheckCircle, Clock, Gamepad2, Ghost, History, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OrderHistory = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${userId}`);
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchOrders();
  }, [userId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full shadow-lg shadow-violet-500/20"
      />
      <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Accessing Secure Library...</p>
    </div>
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic flex items-center space-x-3">
          <History className="text-violet-500 w-8 h-8" />
          <span>Purchase History</span>
        </h2>
        <div className="bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 flex items-center space-x-3">
          <Trophy className="text-amber-400 w-4 h-4 fill-amber-400" />
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{orders.length} Games Owned</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-3xl space-y-4">
          <Ghost className="w-16 h-16 text-slate-700 mx-auto" />
          <div className="space-y-1">
            <p className="text-slate-200 font-bold uppercase tracking-widest text-sm">No games in library</p>
            <p className="text-slate-500 text-xs font-medium">Head to the Hub to explore trending titles.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {orders.map((order, index) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                key={order._id} 
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-violet-500/30 transition-all p-8 relative group shadow-xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-[60px] rounded-full group-hover:bg-violet-600/10 transition-all" />
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700/50">
                      <Gamepad2 className="text-violet-400 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Transaction ID</p>
                      <p className="text-sm font-mono font-bold text-white tracking-widest">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Date</p>
                      <div className="flex items-center space-x-2 text-slate-300 font-bold text-xs uppercase">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${order.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                      {order.status === 'Completed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      <span>{order.status}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-4 border-b border-slate-800/50 last:border-0 group/item">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-[10px] font-black text-violet-400 border border-violet-500/20 group-hover/item:bg-violet-500/10 transition-colors">
                          {item.quantity}x
                        </div>
                        <div>
                          <span className="text-white font-bold uppercase text-xs tracking-widest">{item.name}</span>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Digital Key Generated</p>
                        </div>
                      </div>
                      <span className="text-slate-300 font-mono font-bold">${item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="text-slate-500 w-4 h-4" />
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Total Transaction Value</span>
                  </div>
                  <span className="text-3xl font-black text-white glow-text italic tracking-tighter">${order.totalAmount}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
