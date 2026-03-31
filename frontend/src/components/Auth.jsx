import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, User, AtSign, Loader2 } from 'lucide-react';

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const url = isLogin 
      ? '/api/auth/login' 
      : '/api/auth/register';
    
    try {
      const { data } = await axios.post(url, formData);
      if (isLogin) {
        onLoginSuccess(data.user, data.token);
      } else {
        setIsLogin(true);
        setError('Registered successfully! Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-16 p-8 bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl rounded-3xl shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="text-slate-400">Join our modern microservice ecosystem</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="relative group">
            <User className="absolute left-3 top-3.5 text-slate-500 w-5 h-5 group-focus-within:text-cyan-500 transition-colors" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
        )}

        <div className="relative group">
          <AtSign className="absolute left-3 top-3.5 text-slate-500 w-5 h-5 group-focus-within:text-cyan-500 transition-colors" />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>

        <div className="relative group">
          <Lock className="absolute left-3 top-3.5 text-slate-500 w-5 h-5 group-focus-within:text-cyan-500 transition-colors" />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>

        {error && <p className={`text-sm py-2 px-3 rounded-lg ${error.includes('success') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center space-x-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>{isLogin ? 'Sign In' : 'Register'}</span>}
        </button>

        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-slate-400 text-sm hover:text-cyan-400 transition-colors py-2"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </form>
    </div>
  );
};

export default Auth;
