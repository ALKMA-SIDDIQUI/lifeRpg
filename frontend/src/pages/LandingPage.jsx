import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  Flame, 
  Coins, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  Sparkles, 
  Brain, 
  Dumbbell, 
  BookOpen, 
  Heart,
  Palette,
  Sword,
  Terminal
} from 'lucide-react';
import HeroScene3D from '../components/canvas/HeroScene3D';
import CharacterScene3D from '../components/canvas/CharacterScene3D';
import { sound } from '../services/sound';

export default function LandingPage({ onOpenAuth }) {
  const [selectedLevelPreview, setSelectedLevelPreview] = useState(1);

  const levelProgressionData = {
    1: { level: 1, xp: '0 / 100', rank: 'Novice Initiate', str: 10, int: 10, wis: 10, vit: 10, aura: 'Faint Cyan Aura' },
    5: { level: 5, xp: '1,000 / 1,450', rank: 'Adept Cyber-Runner', str: 28, int: 35, wis: 24, vit: 30, aura: 'Overcharged Pulse' },
    10: { level: 10, xp: '5,800 / 7,200', rank: 'Master Architect', str: 56, int: 72, wis: 49, vit: 60, aura: 'Holographic Plasma' },
    20: { level: 20, xp: '26,500 / 31,000', rank: 'Grandmaster Ascendant', str: 120, int: 154, wis: 110, vit: 135, aura: 'Cosmic Singularity' },
  };

  const sampleQuests = [
    { title: 'Complete DSA Assignment', cat: 'Coding', diff: 'HARD', xp: 150, gold: 75, attr: '+15 Intellect', attrIcon: Brain, iconColor: 'text-cyan-400' },
    { title: 'Go to Gym (Chest & Arms)', cat: 'Fitness', diff: 'MEDIUM', xp: 80, gold: 40, attr: '+10 Strength', attrIcon: Dumbbell, iconColor: 'text-amber-400' },
    { title: 'Read 20 Pages of System Design', cat: 'Reading', diff: 'EASY', xp: 40, gold: 20, attr: '+8 Wisdom', attrIcon: BookOpen, iconColor: 'text-amber-300' },
    { title: 'Practice Coding & Algorithms', cat: 'Coding', diff: 'HARD', xp: 150, gold: 75, attr: '+15 Intellect', attrIcon: Terminal, iconColor: 'text-cyan-400' },
    { title: 'Deep Study 2 Hours', cat: 'Study', diff: 'MEDIUM', xp: 80, gold: 40, attr: '+10 Wisdom', attrIcon: Brain, iconColor: 'text-emerald-400' },
  ];

  const currentLevelInfo = levelProgressionData[selectedLevelPreview] || levelProgressionData[1];

  return (
    <div className="w-full relative z-10">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 text-center lg:text-left z-10"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xs bg-[#12161F] border border-amber-500/40 text-amber-400 font-mono font-bold text-xs uppercase tracking-widest mb-6 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              THE DAILY ASCENSION // PERSONAL RPG HUD
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-orbitron font-black text-white leading-[1.1] uppercase tracking-tight">
              Turn Your Real Life{' '}
              <span className="text-amber-400">
                Into Ascension.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-300 font-rajdhani font-medium tracking-wide max-w-2xl mx-auto lg:mx-0">
              Complete real-world quests. Forge your character. Earn XP. Level up your life.
              Experience genuine RPG progression powered by every assignment, workout, and habit.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenAuth('register');
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-sm bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs sm:text-sm tracking-wide shadow-hud-amber hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#how-it-works"
                onClick={() => sound.playClick()}
                className="w-full sm:w-auto px-7 py-3.5 rounded-sm bg-[#12161F] hover:bg-[#161B26] text-white border border-white/10 font-mono font-bold text-xs sm:text-sm tracking-wide shadow-hud-obsidian hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Explore The World
              </a>
            </div>

            {/* Micro Stats Banner */}
            <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-amber-400">100%</div>
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">Non-Linear RPG</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-cyan-400">3D</div>
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">Interactive Relic</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-400">PostgreSQL</div>
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">Persistent Engine</div>
              </div>
            </div>
          </motion.div>

          {/* Right 3D Visual Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            <div className="w-full max-w-md aspect-square rounded-md bg-[#0D1117]/95 border border-white/10 p-2 shadow-hud-obsidian hud-bevel-tl relative">
              <HeroScene3D />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-[#090C10] px-3.5 py-1 rounded-xs border border-amber-500/30 shadow-sm">
                  ✦ Interactive Ascension Relic
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* SECTION 1 — HOW IT WORKS */}
      <section id="how-it-works" className="py-20 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-500 font-mono font-bold text-xs uppercase tracking-widest">
              // CORE FEEDBACK LOOP
            </span>
            <h2 className="text-3xl sm:text-5xl font-orbitron font-black text-white uppercase mt-2">
              How It Works
            </h2>
            <p className="text-slate-300 font-rajdhani font-semibold text-lg mt-3">
              Mundane everyday chores transformed into an electrifying cycle of progression.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { step: '01', title: 'Real Life', desc: 'Assignments, workouts, reading, code', icon: '🌍' },
              { step: '02', title: 'Create Quest', desc: 'Set difficulty and target attributes', icon: '⚔️' },
              { step: '03', title: 'Complete Quest', desc: '1-click completion with instant audio', icon: '⚡' },
              { step: '04', title: 'Earn XP', desc: 'Mathematical progression scaling', icon: '✨' },
              { step: '05', title: 'Level Up', desc: 'Full-screen fanfare & particle bursts', icon: '🏆' },
              { step: '06', title: 'Become Stronger', desc: 'Higher stats, cyber relics & glory', icon: '👑' },
            ].map((item, idx) => (
              <motion.div
                key={item.step}
                whileHover={{ y: -6 }}
                className="bg-[#0D1117]/95 border border-white/10 rounded-md p-5 relative group border-t-2 border-t-amber-500 hover:border-amber-500/50 shadow-hud-obsidian hud-bevel-tl flex flex-col justify-between"
              >
                <div>
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <div className="text-[11px] font-mono font-bold text-amber-400 tracking-widest uppercase mb-1">
                    Step {item.step}
                  </div>
                  <h3 className="text-lg font-orbitron font-black text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 font-rajdhani font-semibold text-sm leading-snug">{item.desc}</p>
                </div>
                {idx < 5 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-amber-500 text-lg z-20">
                    ➔
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 — CHARACTER PROGRESSION */}
      <section id="progression" className="py-20 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-500 font-mono font-bold text-xs uppercase tracking-widest">
              // DYNAMIC GROWTH MATRIX
            </span>
            <h2 className="text-3xl sm:text-5xl font-orbitron font-black text-white uppercase mt-2">
              Character Progression
            </h2>
            <p className="text-slate-300 font-rajdhani font-semibold text-lg mt-3">
              Non-linear XP scaling ensures higher levels require greater dedication and yield massive prestige.
            </p>

            {/* Level Selector Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
              {[1, 5, 10, 20].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    sound.playClick();
                    setSelectedLevelPreview(lvl);
                  }}
                  className={`px-4 py-2 rounded-xs font-mono font-bold text-xs tracking-wider uppercase transition-all cursor-pointer ${
                    selectedLevelPreview === lvl
                      ? 'bg-amber-500 text-black shadow-hud-amber'
                      : 'bg-[#0D1117] border border-white/10 text-slate-400 hover:text-white hover:bg-[#12161F]'
                  }`}
                >
                  Level {lvl < 10 ? `0${lvl}` : lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#0D1117]/95 border border-white/10 rounded-md p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-5xl mx-auto shadow-hud-obsidian hud-bevel-tl">
            {/* 3D Character Viewport */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div className="w-full h-64 sm:h-72 relative">
                <CharacterScene3D
                  avatarClass={selectedLevelPreview >= 10 ? 'neon_sorcerer' : selectedLevelPreview >= 5 ? 'quantum_rogue' : 'cyber_knight'}
                  theme={selectedLevelPreview >= 20 ? 'solar_flare' : selectedLevelPreview >= 10 ? 'abyssal_void' : 'cyber_neon'}
                />
              </div>
              <div className="mt-3 text-center">
                <span className="text-xs font-mono text-amber-400 font-bold tracking-widest uppercase">
                  {currentLevelInfo.aura}
                </span>
              </div>
            </div>

            {/* Attributes Matrix */}
            <div className="md:col-span-7 font-rajdhani">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div>
                  <h3 className="text-2xl font-orbitron font-black text-white">LEVEL {currentLevelInfo.level}</h3>
                  <p className="text-amber-400 text-xs font-mono font-bold">{currentLevelInfo.rank}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-mono font-semibold">Total Experience</div>
                  <div className="text-lg font-mono font-black text-amber-400">{currentLevelInfo.xp} XP</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Strength', val: currentLevelInfo.str, icon: Dumbbell, color: 'text-amber-500', bar: 'bg-amber-500' },
                  { name: 'Intellect', val: currentLevelInfo.int, icon: Brain, color: 'text-cyan-400', bar: 'bg-cyan-400' },
                  { name: 'Wisdom', val: currentLevelInfo.wis, icon: BookOpen, color: 'text-amber-400', bar: 'bg-amber-400' },
                  { name: 'Vitality', val: currentLevelInfo.vit, icon: Heart, color: 'text-emerald-400', bar: 'bg-emerald-400' },
                ].map((attr) => {
                  const Icon = attr.icon;
                  return (
                    <div key={attr.name} className="p-3.5 rounded-xs bg-[#090C10] border border-white/10 shadow-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="flex items-center gap-1.5 text-xs uppercase font-orbitron font-bold text-white">
                          <Icon className={`w-3.5 h-3.5 ${attr.color}`} />
                          {attr.name}
                        </span>
                        <span className="font-mono font-black text-white text-sm">{attr.val}</span>
                      </div>
                      <div className="w-full bg-[#161B26] h-1.5 rounded-xs overflow-hidden">
                        <motion.div
                          key={`${selectedLevelPreview}-${attr.name}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (attr.val / 160) * 100)}%` }}
                          transition={{ duration: 0.6 }}
                          className={`h-full rounded-xs ${attr.bar}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — QUEST SYSTEM */}
      <section id="quests" className="py-20 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-500 font-mono font-bold text-xs uppercase tracking-widest">
              // LOGBOOK TELEMETRY
            </span>
            <h2 className="text-3xl sm:text-5xl font-orbitron font-black text-white uppercase mt-2">
              The Quest System
            </h2>
            <p className="text-slate-300 font-rajdhani font-semibold text-lg mt-3">
              Turn hard habits into high-yield quests with calibrated XP, Gold, and attribute rewards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sampleQuests.map((q, idx) => {
              const AttrIcon = q.attrIcon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="bg-[#0D1117]/95 border border-white/10 rounded-md p-5 hover:border-amber-500/50 shadow-hud-obsidian hud-bevel-tl flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs bg-[#12161F] border border-amber-500/30 text-amber-400 uppercase tracking-wider">
                        {q.cat}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs border ${
                        q.diff === 'HARD' ? 'bg-amber-950/40 text-amber-400 border-amber-500/40' :
                        q.diff === 'MEDIUM' ? 'bg-cyan-950/40 text-cyan-400 border-cyan-500/40' :
                        'bg-emerald-950/40 text-emerald-400 border-emerald-500/40'
                      }`}>
                        {q.diff}
                      </span>
                    </div>

                    <h4 className="text-base font-orbitron font-bold text-white leading-snug mb-4">
                      {q.title}
                    </h4>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono font-bold">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Zap className="w-3.5 h-3.5" />
                      <span>+{q.xp} XP</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Coins className="w-3.5 h-3.5" />
                      <span>+{q.gold} Gold</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-300">
                      <AttrIcon className={`w-3.5 h-3.5 ${q.iconColor}`} />
                      <span>{q.attr}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4 — REWARDS & ECONOMY */}
      <section id="rewards" className="py-20 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-500 font-mono font-bold text-xs uppercase tracking-widest">
              // VIRTUAL ECONOMY
            </span>
            <h2 className="text-3xl sm:text-5xl font-orbitron font-black text-white uppercase mt-2">
              Rewards & Marketplace
            </h2>
            <p className="text-slate-300 font-rajdhani font-semibold text-lg mt-3">
              Reinvest earned Gold into legendary relics, cybernetic companions, themes, and profile badges.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { category: 'Gold Currency', title: 'Earn Real Wealth', desc: 'Awarded on every task completion and level ascension.', icon: Coins, color: 'text-amber-400', border: 'hover:border-amber-500/50' },
              { category: 'Cyber Relics', title: 'Overclocked Gear', desc: 'Equip katanas, quantum grimoires, and titanium exosuits for attribute bonuses.', icon: Sword, color: 'text-cyan-400', border: 'hover:border-cyan-500/50' },
              { category: 'Visual Themes', title: 'Interface Resonance', desc: 'Transform application glow and 3D lighting into Abyssal Void or Solar Flare.', icon: Palette, color: 'text-amber-400', border: 'hover:border-amber-500/50' },
              { category: 'Profile Badges', title: 'Proof of Discipline', desc: 'Showcase your mastery in Code Sorcery, Iron Lifting, and Habit Titan streaks.', icon: Award, color: 'text-emerald-400', border: 'hover:border-emerald-500/50' },
            ].map((rw, idx) => {
              const Icon = rw.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6 }}
                  className={`bg-[#0D1117]/95 border border-white/10 ${rw.border} rounded-md p-6 relative overflow-hidden flex flex-col justify-between shadow-hud-obsidian hud-bevel-tl`}
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xs bg-[#12161F] border border-amber-500/30 flex items-center justify-center ${rw.color} mb-4 shadow-xs`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                      {rw.category}
                    </span>
                    <h4 className="text-lg font-orbitron font-bold text-white mt-1 mb-2">
                      {rw.title}
                    </h4>
                    <p className="text-slate-400 font-rajdhani font-semibold text-sm leading-relaxed">
                      {rw.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5 — STREAKS */}
      <section id="streak" className="py-20 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-500 font-mono font-bold text-xs uppercase tracking-widest">
              // UNBREAKABLE CONSISTENCY
            </span>
            <h2 className="text-3xl sm:text-5xl font-orbitron font-black text-white uppercase mt-2">
              Consecutive Day Streaks
            </h2>
            <p className="text-slate-300 font-rajdhani font-semibold text-lg mt-3">
              Daily habit momentum tracked continuously in PostgreSQL. Never break the chain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { days: 7, label: '7 DAY STREAK', tier: 'Ignition Tier', bonus: '+25% Gold Multiplier' },
              { days: 14, label: '14 DAY STREAK', tier: 'Overdrive Tier', bonus: '+50% Gold Multiplier' },
              { days: 30, label: '30 DAY STREAK', tier: 'Ascendant Titan', bonus: 'Unlock Mythic Aura & Badge' },
            ].map((st) => (
              <motion.div
                key={st.days}
                whileHover={{ scale: 1.03 }}
                className="bg-[#0D1117]/95 border border-amber-500/30 rounded-md p-6 text-center relative overflow-hidden backdrop-blur-xl shadow-hud-obsidian hud-bevel-tl"
              >
                <div className="w-14 h-14 mx-auto rounded-xs bg-[#12161F] border border-amber-500/40 flex items-center justify-center text-2xl mb-4 shadow-hud-amber">
                  🔥
                </div>
                <div className="text-xs font-mono tracking-widest text-slate-400 uppercase font-bold">
                  {st.tier}
                </div>
                <h3 className="text-xl font-orbitron font-black text-white my-1">
                  {st.label}
                </h3>
                <div className="text-sm font-mono font-bold text-amber-400 mt-2">
                  {st.bonus}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — FINAL CTA */}
      <section className="py-24 border-t border-white/10 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-amber-500 font-mono font-bold text-xs uppercase tracking-widest">
            // YOUR ASCENSION AWAITS
          </span>
          <h2 className="text-4xl sm:text-6xl font-orbitron font-black text-white uppercase mt-3 mb-4">
            Your Next Level Is Waiting.
          </h2>
          <p className="text-slate-300 font-rajdhani font-semibold text-xl max-w-xl mx-auto mb-8">
            Do not let another day pass as a routine. Forge your character, defeat procrastination, and conquer real life.
          </p>
          <button
            onClick={() => {
              sound.playClick();
              onOpenAuth('register');
            }}
            className="px-8 py-4 rounded-sm bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-sm sm:text-base tracking-wider shadow-hud-amber hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Start Your Life RPG ➔
          </button>
        </div>
      </section>
    </div>
  );
}
