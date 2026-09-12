import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Award, Zap, Coins, Heart, Shield, Sparkles } from 'lucide-react';
import { sound } from '../../services/sound';
import CharacterScene3D from '../canvas/CharacterScene3D';

export default function LevelUpModal({ isOpen, onClose, levelUpData, character }) {
  useEffect(() => {
    if (isOpen) {
      sound.playLevelUp();

      // Trigger multi-stage confetti blast
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#F59E0B', '#10B981', '#06B6D4', '#FBBF24'],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#F59E0B', '#10B981', '#06B6D4', '#FBBF24'],
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen || !levelUpData) return null;

  const newLevel = levelUpData.newLevel || (character?.level ?? 2);
  const bonusGold = levelUpData.statBonus?.goldBonus || 100;
  const bonusVitality = levelUpData.statBonus?.vitality || 5;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative z-10 w-full max-w-lg bg-[#090C10] border border-amber-500/80 rounded-md p-6 sm:p-8 shadow-hud-amber hud-bevel-tl text-center overflow-hidden"
        >
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Banner */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring' }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xs bg-amber-950/50 border border-amber-500/40 text-amber-400 font-mono font-bold text-xs uppercase tracking-widest mb-3"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            // ASCENSION ACHIEVED
          </motion.div>

          <h2 className="text-4xl sm:text-5xl font-orbitron font-black text-amber-400 tracking-wider">
            LEVEL UP!
          </h2>

          <p className="text-slate-300 font-mono text-xs font-semibold mt-1 tracking-wide">
            // DISCIPLINE RECOGNIZED // ATTRIBUTES EXPANDED
          </p>

          {/* 3D Character Viewport Celebrating */}
          <div className="w-48 h-48 mx-auto -my-2 pointer-events-none">
            <CharacterScene3D
              avatarClass={character?.avatar_class || 'cyber_knight'}
              theme={character?.equipped_theme || 'cyber_neon'}
              isLevelingUp={true}
            />
          </div>

          {/* Level Transition Pill */}
          <div className="flex items-center justify-center gap-4 my-4 font-mono">
            <div className="px-4 py-1.5 rounded-xs bg-[#12161F] border border-white/10 text-slate-400 font-bold text-base">
              LVL {levelUpData.oldLevel || newLevel - 1}
            </div>
            <div className="text-amber-500 text-xl font-bold font-mono">➔</div>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="px-5 py-1.5 rounded-xs bg-amber-500 text-black font-black text-2xl shadow-hud-amber"
            >
              LVL {newLevel}
            </motion.div>
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-2 gap-3 my-5 text-left font-mono">
            <div className="flex items-center gap-3 p-3 rounded-xs bg-[#0D1117] border border-amber-500/40 shadow-xs">
              <div className="w-9 h-9 rounded-xs bg-[#12161F] border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Bonus Gold</div>
                <div className="text-base font-bold text-amber-400">+{bonusGold} Gold</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xs bg-[#0D1117] border border-emerald-500/40 shadow-xs">
              <div className="w-9 h-9 rounded-xs bg-[#12161F] border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Max Vitality</div>
                <div className="text-base font-bold text-emerald-400">+{bonusVitality} Vitality</div>
              </div>
            </div>
          </div>

          {/* Claim Button */}
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-3 px-8 rounded-xs bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs tracking-wider uppercase shadow-hud-amber transition-all duration-200 active:scale-95 cursor-pointer"
          >
            Claim Glory & Continue ➔
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
