import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Lock, Mail, User, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { sound } from '../../services/sound';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatarClass, setAvatarClass] = useState('cyber_knight');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await onAuthSuccess('login', { emailOrUsername: email || username, password });
      } else {
        await onAuthSuccess('register', { email, username, password, avatar_class: avatarClass });
      }
      sound.playQuestComplete();
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative z-10 w-full max-w-md bg-[#090C10] p-6 sm:p-8 rounded-md border border-amber-500/40 shadow-2xl overflow-hidden hud-bevel-tl"
        >
          {/* Close button */}
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-5 right-5 p-1.5 rounded-xs text-slate-400 hover:text-white hover:bg-[#12161F] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xs bg-[#12161F] border border-amber-500/40 text-amber-400 mb-3 shadow-xs">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-orbitron font-black text-2xl text-white uppercase tracking-wider">
              {mode === 'login' ? 'Access Headquarters' : 'Initiate Operative'}
            </h3>
            <p className="text-amber-400/80 text-xs font-mono font-semibold mt-1">
              {mode === 'login' 
                ? '// WELCOME BACK, ASCENDANT. RESUME YOUR TELEMETRY.' 
                : '// BEGIN YOUR REAL-WORLD RPG ASCENSION.'}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-[#0D1117] p-1 rounded-xs border border-white/10 mb-6 font-mono text-xs">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setMode('login');
                setError('');
              }}
              className={`flex-1 py-2 rounded-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-amber-500 text-black shadow-hud-amber'
                  : 'text-slate-400 hover:text-white hover:bg-[#12161F]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setMode('register');
                setError('');
              }}
              className={`flex-1 py-2 rounded-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-amber-500 text-black shadow-hud-amber'
                  : 'text-slate-400 hover:text-white hover:bg-[#12161F]'
              }`}
            >
              New Operative
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-xs bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 font-mono">
            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Operative Call-Sign / Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. NeoKnight"
                    className="w-full bg-[#0D1117] border border-white/10 focus:border-amber-400 rounded-xs py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                {mode === 'login' ? 'Email or Username' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type={mode === 'login' ? 'text' : 'email'}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={mode === 'login' ? 'adventurer@liferpg.dev or username' : 'adventurer@liferpg.dev'}
                  className="w-full bg-[#0D1117] border border-white/10 focus:border-amber-400 rounded-xs py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Security Passcode
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0D1117] border border-white/10 focus:border-amber-400 rounded-xs py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Select Initial Archetype
                </label>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { id: 'cyber_knight', label: 'Knight', icon: '🛡️' },
                    { id: 'neon_sorcerer', label: 'Sorcerer', icon: '🔮' },
                    { id: 'quantum_rogue', label: 'Rogue', icon: '⚡' },
                  ].map((cls) => (
                    <button
                      key={cls.id}
                      type="button"
                      onClick={() => setAvatarClass(cls.id)}
                      className={`p-3 rounded-xs border transition-all text-xs font-bold font-orbitron cursor-pointer ${
                        avatarClass === cls.id
                          ? 'bg-[#161B26] border-amber-500 text-amber-400 shadow-hud-amber'
                          : 'bg-[#0D1117] border-white/10 text-slate-400 hover:border-amber-500/30'
                      }`}
                    >
                      <div className="text-2xl mb-1.5">{cls.icon}</div>
                      <div>{cls.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-4 rounded-xs bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-hud-amber transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === 'login' ? (
                'Enter World ➔'
              ) : (
                'Forge Operative ➔'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
