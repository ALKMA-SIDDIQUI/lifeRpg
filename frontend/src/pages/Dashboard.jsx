import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Flame, 
  Coins, 
  Dumbbell, 
  Brain, 
  BookOpen, 
  Heart, 
  CheckCircle, 
  Plus, 
  ChevronRight, 
  Clock, 
  Award,
  Sparkles,
  Shield,
  Play,
  ArrowRight,
  Compass,
  Trophy,
  Target,
  CheckCircle2,
  Droplets,
  Laptop,
  ShoppingBag,
  Star,
  Gamepad2,
  Rocket
} from 'lucide-react';
import CharacterScene3D from '../components/canvas/CharacterScene3D';
import { sound } from '../services/sound';

export default function Dashboard({
  user,
  character,
  streak,
  dashboardData,
  onCompleteQuest,
  onOpenCreateQuest,
  onNavigateTab,
}) {
  // Use real progression or default reference values
  const progression = character?.progression || {
    level: 12,
    currentLevelXp: 850,
    nextLevelXpRequired: 1100,
    progressPercentage: 77,
    totalXp: 4850,
    xpRemaining: 250,
  };

  const activeQuests = dashboardData?.activeQuests || [];
  const recentActivity = dashboardData?.recentActivity || [];

  // Default quests matching the exact 3 items shown in reference image
  const referenceQuests = [
    {
      id: 'ref-1',
      title: 'Complete DSA Assignment',
      category: 'Coding',
      xp_reward: 100,
      gold_reward: 50,
      icon: Laptop,
      iconBg: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
    },
    {
      id: 'ref-2',
      title: 'Go to Gym',
      category: 'Fitness',
      xp_reward: 80,
      gold_reward: 40,
      icon: Dumbbell,
      iconBg: 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400',
    },
    {
      id: 'ref-3',
      title: 'Read 20 Pages',
      category: 'Wisdom',
      xp_reward: 60,
      gold_reward: 30,
      icon: BookOpen,
      iconBg: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
    },
  ];

  // If real active quests exist, display them; if fewer than 3, fill from reference items
  const displayedQuests = activeQuests.length >= 3
    ? activeQuests.slice(0, 3).map((q, idx) => ({
        id: q.id,
        title: q.title,
        category: q.category,
        xp_reward: q.xp_reward,
        gold_reward: q.gold_reward,
        icon: idx === 0 ? Laptop : idx === 1 ? Dumbbell : BookOpen,
        iconBg: idx === 1 ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600',
        isReal: true,
      }))
    : [
        ...activeQuests.map((q, idx) => ({
          id: q.id,
          title: q.title,
          category: q.category,
          xp_reward: q.xp_reward,
          gold_reward: q.gold_reward,
          icon: idx === 0 ? Laptop : idx === 1 ? Dumbbell : BookOpen,
          iconBg: idx === 1 ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600',
          isReal: true,
        })),
        ...referenceQuests.slice(activeQuests.length),
      ];

  const charAttributes = [
    { name: 'Strength', val: character?.strength || 42, icon: Dumbbell, color: 'text-amber-500', bg: 'bg-amber-100 text-amber-600' },
    { name: 'Intellect', val: character?.intellect || 67, icon: Brain, color: 'text-purple-500', bg: 'bg-purple-100 text-purple-600' },
    { name: 'Wisdom', val: character?.wisdom || 38, icon: BookOpen, color: 'text-sky-500', bg: 'bg-sky-100 text-sky-600' },
    { name: 'Vitality', val: character?.vitality || 51, icon: Heart, color: 'text-emerald-500', bg: 'bg-emerald-100 text-emerald-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4 space-y-8 relative z-10">
      
      {/* =========================================================================
          HERO SECTION: Left Copy & CTAs / Right 3D Character Viewport + Floating HUD
          ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[460px] pt-2">
        
        {/* Left Column: Headline, Subtitle, Pill Buttons, Live Stats & Cursive Quote */}
        <motion.div 
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6 flex flex-col justify-center text-left space-y-4"
        >
          {/* Eyebrow Tag */}
          <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs uppercase tracking-widest">
            <span className="w-5 h-[2px] bg-amber-500 inline-block"></span>
            THE DAILY ASCENSION // PERSONAL RPG HUD
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-orbitron font-black text-slate-100 leading-[1.1] tracking-tight uppercase">
            Turn Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 drop-shadow-sm">
              Real Life Into A Game.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-slate-300 text-sm sm:text-base font-inter font-normal leading-relaxed max-w-lg">
            Complete real-world quests, earn electric XP, forge discipline, and level up your physical and mental attributes daily.
          </p>

          {/* Dual Action Capsule Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            {/* Primary CTA: Electric Amber */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenCreateQuest();
              }}
              className="rpg-btn-primary flex items-center gap-2 group cursor-pointer"
            >
              <span>Deploy Quest</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Secondary CTA: Sharp Obsidian */}
            <button
              onClick={() => {
                sound.playClick();
                onNavigateTab('quests');
              }}
              className="rpg-btn-secondary flex items-center gap-2 cursor-pointer"
            >
              <div className="w-4 h-4 rounded-sm bg-[#090C10] border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
              </div>
              <span>Quest Log</span>
            </button>
          </div>

          {/* Live Statistics Pill Bar */}
          <div className="pt-2">
            <div className="inline-flex items-center justify-between gap-6 sm:gap-8 px-6 sm:px-8 py-2.5 rounded bg-[#0D1117]/90 backdrop-blur-2xl border border-white/10 shadow-2xl">
              <div>
                <div className="font-mono font-black text-amber-400 text-base sm:text-lg leading-none">
                  12,480
                </div>
                <div className="text-[11px] font-mono font-medium text-slate-400 mt-0.5">
                  ACTIVE AGENTS
                </div>
              </div>

              <div className="w-px h-7 bg-white/10" />

              <div>
                <div className="font-mono font-black text-emerald-400 text-base sm:text-lg leading-none">
                  98.4%
                </div>
                <div className="text-[11px] font-mono font-medium text-slate-400 mt-0.5">
                  COMPLETION RATE
                </div>
              </div>

              <div className="w-px h-7 bg-white/10" />

              <div>
                <div className="font-mono font-black text-amber-400 text-base sm:text-lg leading-none flex items-center gap-1">
                  <span>4.9</span>
                  <span className="text-amber-500 text-sm">★</span>
                </div>
                <div className="text-[11px] font-mono font-medium text-slate-400 mt-0.5">
                  USER RATING
                </div>
              </div>
            </div>
          </div>

          {/* Runic Quote on Left */}
          <div className="pt-1">
            <span className="font-cinzel text-xl sm:text-2xl text-amber-400/90 tracking-wide font-bold inline-flex items-center gap-1 select-none">
              "Small Daily Habits Forge Legendary Destinies."
            </span>
          </div>
        </motion.div>

        {/* Right Column: 3D Character Viewport with Floating Glass HUD Panels */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-6 relative w-full h-[460px] sm:h-[490px] flex items-center justify-center"
        >
          {/* Main 3D Canvas with Pedestal, Drone & Floating Crystals */}
          <div className="w-full h-full relative z-0">
            <CharacterScene3D
              avatarClass={character?.avatar_class || 'cyber_knight'}
              theme={character?.equipped_theme || 'cyber_neon'}
            />
          </div>

          {/* FLOATING HUD CARD 1: Level & XP Bar (Left of character) */}
          <motion.div
            initial={{ opacity: 0, y: -15, x: -15 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute top-8 left-0 sm:left-2 z-20 p-3 rounded bg-[#0D1117]/95 backdrop-blur-2xl border border-white/10 border-t-amber-500/40 shadow-2xl min-w-[190px] sm:min-w-[210px]"
          >
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="font-mono font-bold text-xs text-slate-100 uppercase tracking-wider">
                [LVL. {progression.level}]
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                {progression.progressPercentage}%
              </span>
            </div>

            <div className="text-[10px] font-mono text-slate-400 mb-1.5">
              {progression.currentLevelXp} / {progression.nextLevelXpRequired} XP
            </div>

            {/* Electric Amber Glowing Progress Bar */}
            <div className="w-full h-2 bg-[#090C10] rounded-sm overflow-hidden p-0.5 border border-white/10">
              <div 
                className="h-full rounded-sm bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 shadow-sm shadow-amber-500/50"
                style={{ width: `${progression.progressPercentage}%` }}
              />
            </div>
          </motion.div>

          {/* FLOATING HUD CARD 2: Tilted Discipline Quote Card (Below Level Card) */}
          <motion.div
            initial={{ opacity: 0, y: 15, x: -15 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute top-36 left-2 sm:left-6 z-20 px-3.5 py-2.5 rounded bg-[#0D1117]/95 backdrop-blur-2xl border border-white/10 border-l-amber-500/50 shadow-2xl max-w-[180px]"
          >
            <div className="text-[10px] font-mono font-bold text-amber-400/90 uppercase tracking-widest leading-relaxed">
              DISCIPLINE TODAY <br />
              ASCENDANCE <br />
              TOMORROW
            </div>
          </motion.div>

          {/* FLOATING HUD CARD 3: Attributes Panel (Upper Right of character) */}
          <motion.div
            initial={{ opacity: 0, y: -15, x: 15 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute top-4 right-0 sm:right-2 z-20 p-3.5 rounded bg-[#0D1117]/95 backdrop-blur-2xl border border-white/10 border-t-amber-500/40 shadow-2xl min-w-[190px] sm:min-w-[210px]"
          >
            <div className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-2">
              // ATTRIBUTES
            </div>

            <div className="space-y-1.5">
              {charAttributes.map((attr) => {
                const Icon = attr.icon;
                return (
                  <div key={attr.name} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-sm bg-[#12161F] border border-white/10 flex items-center justify-center text-xs flex-shrink-0 text-amber-400">
                        <Icon className="w-2.5 h-2.5" />
                      </div>
                      <span className="font-mono text-slate-300 text-xs">
                        {attr.name}
                      </span>
                    </div>

                    <span className="font-mono font-bold text-xs text-amber-400">
                      {attr.val}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Dark Fantasy Quote on Right */}
          <div className="absolute top-64 -right-2 sm:right-4 z-20 pointer-events-none">
            <span className="font-cinzel text-lg sm:text-xl text-amber-400/80 font-bold inline-flex items-center select-none drop-shadow-sm">
              "Rise Every Morning."
            </span>
          </div>

        </motion.div>

      </section>


      {/* =========================================================================
          LOWER DASHBOARD GRID: 2 Rows x 3 Columns = 6 Cards matching reference
          ========================================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* -------------------------------------------------------------
            CARD 1: Your Character Profile Card
            ------------------------------------------------------------- */}
        <motion.div 
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="p-5 sm:p-6 rounded-md bg-[#0D1117]/90 backdrop-blur-xl border border-white/10 border-t-amber-500/30 shadow-2xl shadow-black/80 flex flex-col justify-between"
        >
          <div>
            {/* Header: Title on Left, View Profile on Right */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-orbitron font-bold text-sm tracking-wider text-slate-100 uppercase">
                // Character Dossier
              </h3>
              <button
                onClick={() => {
                  sound.playClick();
                  onNavigateTab('character');
                }}
                className="text-xs font-mono font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Sheet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Avatar, Name, Class & Badge */}
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-13 h-13 rounded bg-[#12161F] border border-amber-500/40 p-[1.5px] shadow-md flex-shrink-0">
                <div className="w-full h-full bg-[#090C10] rounded-sm overflow-hidden flex items-center justify-center">
                  {character?.avatar_url || user?.avatar_url ? (
                    <img src={character?.avatar_url || user?.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-sm bg-amber-500/15 flex items-center justify-center text-amber-400">
                      <Shield className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>

              <div className="min-w-0">
                <h4 className="font-mono font-black text-base text-slate-100 uppercase truncate">
                  {character?.name || user?.username || 'AGENT'}
                </h4>
                <div className="text-xs font-mono text-slate-400 capitalize">
                  {character?.avatar_class?.replace('_', ' ') || 'Cyber Knight'}
                </div>
                <div className="mt-1">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#12161F] text-amber-400 border border-amber-500/30">
                    {character?.equipped_badge?.replace('_', ' ') || 'Novice Adventurer'}
                  </span>
                </div>
              </div>
            </div>

            {/* 4-Pill Mini Stats Row */}
            <div className="grid grid-cols-4 gap-1.5 py-2.5 px-2 rounded bg-[#090C10] border border-white/5 text-center mb-5">
              <div>
                <div className="text-[9px] font-mono font-medium text-slate-400 uppercase">LVL</div>
                <div className="font-mono font-bold text-xs text-amber-400 mt-0.5">{progression.level}</div>
              </div>
              <div>
                <div className="text-[9px] font-mono font-medium text-slate-400 uppercase">XP</div>
                <div className="font-mono font-bold text-[10px] text-slate-200 mt-0.5">{progression.currentLevelXp}/{progression.nextLevelXpRequired}</div>
              </div>
              <div>
                <div className="text-[9px] font-mono font-medium text-slate-400 uppercase">GOLD</div>
                <div className="font-mono font-bold text-xs text-amber-400 mt-0.5 flex items-center justify-center gap-0.5">
                  <span>🪙</span> {character?.gold ?? 70}
                </div>
              </div>
              <div>
                <div className="text-[9px] font-mono font-medium text-slate-400 uppercase">STREAK</div>
                <div className="font-mono font-bold text-xs text-emerald-400 mt-0.5 flex items-center justify-center gap-0.5">
                  <span>🔥</span> {streak?.current_streak ?? 7}d
                </div>
              </div>
            </div>

            {/* Level Progress Bar with Left/Center/Right markers */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="font-bold text-slate-200">LVL {progression.level}</span>
                <span className="font-mono font-bold text-amber-400">{progression.progressPercentage}%</span>
                <span className="font-bold text-slate-500">LVL {progression.level + 1}</span>
              </div>
              <div className="w-full h-2 bg-[#090C10] rounded-sm overflow-hidden p-0.5 border border-white/10">
                <div 
                  className="h-full rounded-sm bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 shadow-sm shadow-amber-500/50"
                  style={{ width: `${progression.progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>


        {/* -------------------------------------------------------------
            CARD 2: Today's Quests (3 items)
            ------------------------------------------------------------- */}
        <motion.div 
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="p-5 sm:p-6 rounded-md bg-[#0D1117]/90 backdrop-blur-xl border border-white/10 border-t-amber-500/30 shadow-2xl shadow-black/80 flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-orbitron font-bold text-sm tracking-wider text-slate-100 uppercase">
                // Active Directives ({displayedQuests.length})
              </h3>

              <button
                onClick={() => {
                  sound.playClick();
                  onNavigateTab('quests');
                }}
                className="text-xs font-mono font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Full Board</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List of 3 Quests */}
            <div className="space-y-2.5">
              {displayedQuests.map((quest) => {
                const IconComponent = quest.icon || Dumbbell;

                return (
                  <div
                    key={quest.id}
                    className="p-3 rounded bg-[#090C10]/90 border border-white/10 hover:border-amber-500/40 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded bg-[#12161F] border border-white/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-mono font-bold text-xs text-slate-200 truncate group-hover:text-amber-300 transition-colors">
                          {quest.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-400 mt-0.5">
                          <span className="text-amber-400">+{quest.xp_reward} XP</span>
                          <span>•</span>
                          <span className="text-amber-500">+{quest.gold_reward} G</span>
                        </div>
                      </div>
                    </div>

                    {/* Emerald Completion Button */}
                    <button
                      onClick={() => {
                        if (quest.isReal) {
                          sound.playQuestComplete();
                          onCompleteQuest(quest.id);
                        } else {
                          sound.playClick();
                          onOpenCreateQuest();
                        }
                      }}
                      className="px-3 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/40 font-mono font-bold text-xs transition-all shadow-xs flex-shrink-0 active:scale-95 cursor-pointer"
                    >
                      Complete
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>


        {/* -------------------------------------------------------------
            CARD 3: Recent Activity (Timeline matching reference)
            ------------------------------------------------------------- */}
        <motion.div 
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="p-5 sm:p-6 rounded-md bg-[#0D1117]/90 backdrop-blur-xl border border-white/10 border-t-amber-500/30 shadow-2xl shadow-black/80 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-orbitron font-bold text-sm tracking-wider text-slate-100 uppercase">
                // Event Log
              </h3>

              <button
                onClick={() => {
                  sound.playClick();
                  onNavigateTab('quests');
                }}
                className="text-xs font-mono font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Full History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Timeline matching reference */}
            <div className="space-y-3">
              
              {/* Event 1 */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="w-6 h-6 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono font-semibold text-slate-200 text-xs truncate">
                      Completed: Read 20 Pages
                    </div>
                    <div className="text-slate-400 text-[10px] font-mono">2h ago</div>
                  </div>
                </div>
                <div className="font-mono font-bold text-[11px] text-right flex-shrink-0">
                  <span className="text-amber-400">+60 XP</span> <span className="text-amber-500">+30 G</span>
                </div>
              </div>

              {/* Event 2 */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="w-6 h-6 rounded bg-amber-950/60 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
                    <Star className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono font-semibold text-slate-200 text-xs truncate">
                      Level Up! Reached Level 12
                    </div>
                    <div className="text-slate-400 text-[10px] font-mono">5h ago</div>
                  </div>
                </div>
                <div className="font-mono font-bold text-[11px] text-amber-400 text-right flex-shrink-0">
                  <span>RANK UP</span>
                </div>
              </div>

              {/* Event 3 */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="w-6 h-6 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono font-semibold text-slate-200 text-xs truncate">
                      Completed: Gym Workout
                    </div>
                    <div className="text-slate-400 text-[10px] font-mono">1d ago</div>
                  </div>
                </div>
                <div className="font-mono font-bold text-[11px] text-right flex-shrink-0">
                  <span className="text-amber-400">+80 XP</span> <span className="text-amber-500">+40 G</span>
                </div>
              </div>

              {/* Event 4 */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="w-6 h-6 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono font-semibold text-slate-200 text-xs truncate">
                      Acquired: Obsidian Core Relic
                    </div>
                    <div className="text-slate-400 text-[10px] font-mono">2d ago</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>


        {/* -------------------------------------------------------------
            CARD 4: Your Adventure Awaits (Fantasy Floating Realm Banner)
            ------------------------------------------------------------- */}
        <motion.div 
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="p-5 sm:p-6 rounded-md bg-[#0D1117]/90 backdrop-blur-xl border border-white/10 border-t-amber-500/30 shadow-2xl shadow-black/80 flex flex-col justify-between"
        >
          <div>
            {/* Header: Trophy in purple badge + title + subtitle */}
            <div className="flex items-start gap-3 mb-3.5">
              <div className="w-8 h-8 rounded bg-[#12161F] border border-amber-500/40 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-orbitron font-bold text-sm tracking-wider text-slate-100 uppercase">
                  // Realm Expeditions
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  Consistent discipline builds unstoppable momentum.
                </p>
              </div>
            </div>

            {/* Scenic Landscape Banner with overlay */}
            <div className="w-full h-36 rounded bg-gradient-to-br from-[#12161F] via-[#161B26] to-[#090C10] border border-white/10 relative overflow-hidden flex flex-col justify-end p-3.5 shadow-inner">
              {/* Vector Illustration */}
              <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 300 140" fill="none" preserveAspectRatio="none">
                <path d="M0,100 C50,80 80,120 150,90 C220,60 250,110 300,95 L300,140 L0,140 Z" fill="#F59E0B" />
                <path d="M0,115 C70,105 140,125 210,110 C260,100 280,120 300,115 L300,140 L0,140 Z" fill="#FBBF24" opacity="0.3" />
                <circle cx="150" cy="45" r="28" fill="#F59E0B" opacity="0.25" />
              </svg>

              {/* Landscape Bottom Overlay Bar */}
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h4 className="font-mono font-bold text-xs text-slate-100 uppercase">Ascension Journey</h4>
                  <p className="text-[10px] font-mono text-slate-400">Forge habits • Earn relics • Master life</p>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    onNavigateTab('quests');
                  }}
                  className="w-7 h-7 rounded bg-[#090C10] border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>


        {/* -------------------------------------------------------------
            CARD 5: Achievement Progress (6/24 with 4 Milestone Badges)
            ------------------------------------------------------------- */}
        <motion.div 
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="p-5 sm:p-6 rounded-md bg-[#0D1117]/90 backdrop-blur-xl border border-white/10 border-t-amber-500/30 shadow-2xl shadow-black/80 flex flex-col justify-between"
        >
          <div>
            <h3 className="font-orbitron font-bold text-sm tracking-wider text-slate-100 uppercase mb-2">
              // Mastery Milestones
            </h3>

            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="font-bold text-slate-200">[6 / 24 UNLOCKED]</span>
              <span className="font-mono font-bold text-emerald-400">25%</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-2 bg-[#090C10] rounded-sm overflow-hidden p-0.5 border border-white/10 mb-5">
              <div className="h-full rounded-sm bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-sm shadow-emerald-500/50" style={{ width: '25%' }} />
            </div>

            {/* 4 Sharp Milestone Badges */}
            <div className="grid grid-cols-4 gap-2 text-center">
              {/* Badge 1 */}
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 rounded bg-[#12161F] border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-base shadow-xs mb-1">
                  💧
                </div>
                <div className="font-mono font-bold text-[9px] text-slate-300">Initiate</div>
              </div>

              {/* Badge 2 */}
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 rounded bg-[#12161F] border border-amber-500/30 text-amber-400 flex items-center justify-center text-base shadow-xs mb-1">
                  🔥
                </div>
                <div className="font-mono font-bold text-[9px] text-slate-300">7d Streak</div>
              </div>

              {/* Badge 3 */}
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 rounded bg-[#12161F] border border-amber-500/30 text-amber-400 flex items-center justify-center text-base shadow-xs mb-1">
                  🛡️
                </div>
                <div className="font-mono font-bold text-[9px] text-slate-300">Level 10</div>
              </div>

              {/* Badge 4 */}
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 rounded bg-[#12161F] border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-base shadow-xs mb-1">
                  📖
                </div>
                <div className="font-mono font-bold text-[9px] text-slate-300">Scholar</div>
              </div>
            </div>
          </div>

          {/* Bottom link */}
          <button
            onClick={() => {
              sound.playClick();
              onNavigateTab('character');
            }}
            className="w-full text-center text-xs font-mono font-semibold text-amber-400 hover:text-amber-300 pt-4 mt-3 border-t border-white/10 flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>All Achievements</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>


        {/* -------------------------------------------------------------
            CARD 6: Your next level is waiting (Ascension Crystal Banner)
            ------------------------------------------------------------- */}
        <motion.div 
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="p-5 sm:p-6 rounded-md bg-[#0D1117]/95 border border-amber-500/40 text-white shadow-2xl shadow-black/90 flex flex-col justify-between relative overflow-hidden text-center"
        >
          {/* Ambient Glow Orbs */}
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-amber-500/15 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Glowing Trophy */}
            <div className="w-12 h-12 rounded bg-[#12161F] border border-amber-500/40 flex items-center justify-center shadow-lg mb-3 text-2xl">
              🏆
            </div>

            <h3 className="font-orbitron font-black text-base text-slate-100 uppercase tracking-wide">
              Ascendance Awaits.
            </h3>
            
            <p className="text-xs font-mono text-slate-400 mt-1.5 leading-relaxed max-w-xs">
              Complete your daily objectives to cross the threshold into Level {progression.level + 1}.
            </p>
          </div>

          <div className="relative z-10 mt-5">
            <button
              onClick={() => {
                sound.playClick();
                onOpenCreateQuest();
              }}
              className="rpg-btn-primary w-full cursor-pointer"
            >
              <span>Continue Ascension</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </motion.div>

      </section>

      {/* =========================================================================
          BOTTOM FLOATING FOOTER HUD: Sharp Obsidian Frame
          ========================================================================= */}
      <footer className="pt-2 pb-4">
        <div className="w-full py-3 px-5 sm:px-6 rounded bg-[#0D1117]/90 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-[#12161F] border border-amber-500/40 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div>
              <span className="font-orbitron font-extrabold text-xs tracking-wider text-slate-100 uppercase">
                LIFE <span className="text-amber-400">RPG</span>
              </span>
              <span className="text-[8px] font-mono tracking-widest text-slate-500 block -mt-0.5 uppercase">
                THE DAILY ASCENSION
              </span>
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="flex flex-col items-center">
            <div className="font-cinzel text-sm sm:text-base text-amber-400/90 font-semibold select-none text-center">
              "Discipline Today. Ascendance Tomorrow."
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
            </div>
          </div>

          {/* Feature Badges with Icons */}
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2 text-amber-400">
              <Gamepad2 className="w-4 h-4" />
              <Target className="w-4 h-4" />
              <Rocket className="w-4 h-4" />
            </div>
            <span className="text-slate-700">|</span>
            <span className="text-[10px] font-mono text-slate-400 uppercase">
              Disciplined • Lethal • Focused
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}
