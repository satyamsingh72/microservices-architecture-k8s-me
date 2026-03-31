import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingCart, Plus, Tag, Search, Filter, Gamepad2, Stars, Flame, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductList = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full shadow-lg shadow-violet-500/20"
      />
      <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Synchronizing Hub...</p>
    </div>
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-violet-400 mb-1">
            <Stars className="w-4 h-4 fill-violet-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Trending Now</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center space-x-3">
            <span>Explore Games</span>
          </h2>
        </div>
        
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search library..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all placeholder:text-slate-600 font-bold tracking-wide"
            />
          </div>
          <button className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 text-slate-400 hover:text-white transition-all hover:bg-slate-800 active:scale-95">
            <Filter className="w-5 h-5 font-bold" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, index) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              key={product._id} 
              className="gaming-card group rounded-3xl overflow-hidden"
            >
              <div className="h-56 relative overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale-[20%] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                
                <div className="absolute top-4 right-4 flex flex-col items-end space-y-2">
                  <div className="bg-slate-950/80 backdrop-blur-md px-4 py-1.5 rounded-2xl text-white font-black text-xs border border-white/5 shadow-xl">
                    ${product.price}
                  </div>
                  {product.price > 45 && (
                    <div className="bg-violet-600 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest text-white flex items-center space-x-1 shadow-lg shadow-violet-900/40">
                      <Flame className="w-3 h-3 fill-white" />
                      <span>Elite</span>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                  <div className="bg-slate-950/80 backdrop-blur-md p-1.5 rounded-xl border border-white/5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                  </div>
                  <span className="text-[10px] font-black text-rose-100 uppercase tracking-widest leading-none bg-rose-500/10 px-2.5 py-1.5 rounded-xl border border-rose-500/20">{product.category}</span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors uppercase tracking-tight leading-tight line-clamp-1">{product.name}</h3>
                  <div className="flex items-center space-x-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span>Base Game</span>
                    <div className="w-1 h-1 bg-slate-700 rounded-full mx-1" />
                    <span>PC Digital</span>
                  </div>
                </div>

                <p className="text-slate-400 text-sm font-medium line-clamp-2 h-10 leading-relaxed">{product.description}</p>
                
                <div className="pt-2">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAddToCart(product)}
                    className="w-full neon-button text-white py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-3 shadow-xl"
                  >
                    <Plus className="w-4 h-4 font-black" />
                    <span>Add to Library</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && (
        <div className="h-64 flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-slate-800 rounded-3xl opacity-50">
          <Ghost className="w-12 h-12 text-slate-700" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No games found in this sector</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
