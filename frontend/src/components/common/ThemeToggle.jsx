import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { sound } from '../../services/sound';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme, isDark } = useTheme();

  const handleToggle = () => {
    sound.playClick();
    toggleTheme();
  };

  return (
    <button
      onClick={handleToggle}
      type="button"
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`p-2 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyber-cyan ${
        isDark
          ? 'bg-cyber-card border-cyber-border text-amber-400 hover:text-amber-300 hover:border-amber-400/50 shadow-glow-amber-sm'
          : 'bg-white border-slate-300 text-sky-600 hover:text-sky-700 hover:border-sky-400 shadow-sm'
      } ${className}`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {isDark ? (
          <Moon className="w-4 h-4 fill-amber-400/20 text-amber-400" />
        ) : (
          <Sun className="w-4 h-4 fill-sky-400/20 text-sky-600" />
        )}
      </motion.div>
    </button>
  );
}
