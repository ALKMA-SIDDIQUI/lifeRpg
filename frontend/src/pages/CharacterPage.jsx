import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Dumbbell, 
  Brain, 
  BookOpen, 
  Heart, 
  Shield, 
  Sparkles, 
  Award, 
  Check, 
  Zap, 
  Layers,
  Sun,
  Moon,
  ChevronRight,
  Trophy,
  Sword,
  Footprints,
  Shirt,
  Gem,
  Package,
  Flame,
  Bot,
  Edit3,
  X,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import CharacterScene3D from '../components/canvas/CharacterScene3D';
import AvatarUploader from '../components/common/AvatarUploader';
import Avatar from '../components/common/Avatar';
import { useTheme } from '../context/ThemeContext';
import { sound } from '../services/sound';

const CLASSES = [
  {
    id: 'cyber_knight',
    name: 'Cyber Knight',
    description: 'Armored vanguard specializing in physical discipline, iron habits, and heavy resilience.',
    specialty: 'BONUS STRENGTH & VITALITY GROWTH',
    icon: '🛡️',
    badgeClass: 'bg-amber-950/50 text-amber-400 border-amber-500/40',
    selectedRing: 'border-amber-500 ring-1 ring-amber-500/50',
  },
  {
    id: 'neon_sorcerer',
    name: 'Neon Sorcerer',
    description: 'Algorithmic mystic channeling deep knowledge, complex problem-solving, and code mastery.',
    specialty: 'BONUS INTELLECT & WISDOM GROWTH',
    icon: '🔮',
    badgeClass: 'bg-cyan-950/50 text-cyan-400 border-cyan-500/40',
    selectedRing: 'border-cyan-500 ring-1 ring-cyan-500/50',
  },
  {
    id: 'quantum_rogue',
    name: 'Quantum Rogue',
    description: 'High-velocity agile operative navigating time boxing, sprint focus, and streak momentum.',
    specialty: 'BONUS VITALITY & STREAK SCALING',
    icon: '⚡',
    badgeClass: 'bg-emerald-950/50 text-emerald-400 border-emerald-500/40',
    selectedRing: 'border-emerald-500 ring-1 ring-emerald-500/50',
  },
];

// 8 Canonical Equipment Slots flanking character
const EQUIPMENT_SLOTS_LEFT = [
  { id: 'helmet', label: 'Helmet', icon: Shield, defaultItem: 'Cyber Visor Mark IV', isEquipped: true, stat: '+6 Armor' },
  { id: 'chest', label: 'Chest', icon: Shirt, defaultItem: 'Aegis Armor', isEquipped: true, stat: '+15 Vitality' },
  { id: 'weapon', label: 'Weapon', icon: Sword, defaultItem: 'Neon Blade', isEquipped: true, stat: '+12 Focus' },
  { id: 'boots', label: 'Boots', icon: Footprints, defaultItem: 'Quantum Boots', isEquipped: true, stat: '+10 Speed' },
];

const EQUIPMENT_SLOTS_RIGHT = [
  { id: 'accessory', label: 'Accessory', icon: Sparkles, defaultItem: 'Mind Core', isEquipped: true, stat: '+8 Intellect' },
  { id: 'amulet', label: 'Amulet', icon: Gem, defaultItem: 'Prism of Clarity', isEquipped: true, stat: '+5 Wisdom' },
  { id: 'artifact', label: 'Artifact', icon: Package, defaultItem: 'Chronos Relic', isEquipped: false, stat: 'Empty' },
  { id: 'pet', label: 'Pet', icon: Bot, defaultItem: 'Aero Drone V2', isEquipped: true, stat: '+4 Energy' },
];

export default function CharacterPage({
  user,
  character,
  streak,
  onChangeClass,
  onAvatarUpdated,
  onNavigateTab,
}) {
  const { theme, setTheme, isDark } = useTheme();
  const [selectedClass, setSelectedClass] = useState(character?.avatar_class || 'cyber_knight');
  const [savingClass, setSavingClass] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [activeSlotHover, setActiveSlotHover] = useState(null);

  const progression = character?.progression || {
    level: character?.level || 12,
    currentLevelXp: character?.experience || 850,
    nextLevelXpRequired: 1100,
    progressPercentage: 77,
    totalXp: character?.total_xp || 4850,
  };

  const getRankTitle = (lvl) => {
    if (lvl >= 20) return 'Grandmaster Ascendant';
    if (lvl >= 10) return 'Master Architect';
    if (lvl >= 5) return 'Adept Cyber-Runner';
    return 'Novice Adventurer';
  };

  const handleClassSelect = async (clsId) => {
    sound.playClick();
    setSelectedClass(clsId);
    setSavingClass(true);
    try {
      if (onChangeClass) {
        await onChangeClass(clsId);
      }
      sound.playQuestComplete();
    } catch (err) {
      console.error('Failed to change class:', err);
    } finally {
      setSavingClass(false);
    }
  };

  const effectiveStats = character?.effectiveStats || {
    strength: character?.strength || 10,
    intellect: character?.intellect || 10,
    wisdom: character?.wisdom || 15,
    vitality: character?.vitality || 10,
    base: { 
      strength: character?.strength || 10, 
      intellect: character?.intellect || 10, 
      wisdom: character?.wisdom || 15, 
      vitality: character?.vitality || 10 
    },
    bonuses: { strength: 0, intellect: 0, wisdom: 0, vitality: 0 },
  };

  const statList = [
    { 
      name: 'Strength', 
      val: effectiveStats.strength, 
      base: effectiveStats.base.strength, 
      bonus: effectiveStats.bonuses.strength, 
      icon: Dumbbell, 
      color: 'text-amber-500', 
      bgIcon: 'bg-amber-500/15',
      bar: 'from-amber-600 to-amber-400', 
      desc: 'Governs physical workouts, stamina, and gym quests' 
    },
    { 
      name: 'Intellect', 
      val: effectiveStats.intellect, 
      base: effectiveStats.base.intellect, 
      bonus: effectiveStats.bonuses.intellect, 
      icon: Brain, 
      color: 'text-cyan-400', 
      bgIcon: 'bg-cyan-500/15',
      bar: 'from-cyan-600 to-cyan-400', 
      desc: 'Amplified by coding, problem solving, and software engineering' 
    },
    { 
      name: 'Wisdom', 
      val: effectiveStats.wisdom, 
      base: effectiveStats.base.wisdom, 
      bonus: effectiveStats.bonuses.wisdom, 
      icon: BookOpen, 
      color: 'text-amber-400', 
      bgIcon: 'bg-amber-500/15',
      bar: 'from-amber-500 to-yellow-300', 
      desc: 'Cultivated through deep study, reading, and research' 
    },
    { 
      name: 'Vitality', 
      val: effectiveStats.vitality, 
      base: effectiveStats.base.vitality, 
      bonus: effectiveStats.bonuses.vitality, 
      icon: Heart, 
      color: 'text-emerald-400', 
      bgIcon: 'bg-emerald-500/15',
      bar: 'from-emerald-600 to-emerald-400', 
      desc: 'Sustained through sleep, health habits, and streak momentum' 
    },
  ];

  const equippedGearList = [
    { name: 'Neon Blade', slot: 'Weapon', bonus: '+12 Focus', icon: Sword, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { name: 'Aegis Armor', slot: 'Chest', bonus: '+15 Vitality', icon: Shield, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { name: 'Quantum Boots', slot: 'Boots', bonus: '+10 Speed', icon: Footprints, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { name: 'Mind Core', slot: 'Accessory', bonus: '+8 Intellect', icon: Sparkles, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  ];

  const currentArchetype = CLASSES.find(c => c.id === selectedClass) || CLASSES[0];
  const charName = character?.name || user?.username || 'ALKMA';
  const charGold = character?.gold !== undefined ? character.gold : 70;
  const streakDays = streak?.current_streak !== undefined ? streak.current_streak : 7;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 relative z-10">
      
      {/* 1. HERO HEADER SECTION */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold tracking-widest text-amber-500 uppercase">
            — TELEMETRY // CHARACTER DOSSIER
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-orbitron font-black text-white tracking-tight">
          ASCENSION <span className="text-amber-400">OPERATIVE</span>
        </h1>
        <p className="text-sm sm:text-base font-rajdhani font-semibold text-slate-300 max-w-2xl">
          Calibrate operative attributes, balance combat specializations, equip forged relics, and ascend through personal mastery.
        </p>
      </div>

      {/* 2. MAIN SPLIT GRID (3D Hero Viewport Left + 3 Cards Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: 3D CHARACTER SHOWCASE FLANKED BY 8 EQUIPMENT SLOTS (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0D1117]/95 border border-white/10 rounded-md p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between min-h-[560px] shadow-hud-obsidian hud-bevel-tl">
          
          {/* Subtle Ambient Background Glows */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Label & Active Class Pill */}
          <div className="flex items-center justify-between z-10">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest">
                // NEURAL PROJECTION
              </span>
              <h3 className="text-xl sm:text-2xl font-orbitron font-black text-white capitalize">
                {charName}
              </h3>
            </div>
            <div className="px-3 py-1 rounded-sm bg-[#12161F] border border-amber-500/40 text-[10px] font-mono font-bold text-amber-400 flex items-center gap-1.5 shadow-xs">
              <span>{currentArchetype.icon}</span>
              <span>{currentArchetype.name}</span>
            </div>
          </div>

          {/* Central 3D Canvas Area Flanked by 8 Equipment Slot Pills */}
          <div className="relative my-2 h-[380px] flex items-center justify-center">
            
            {/* Left Equipment Column (4 Pills) */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-around z-20 pointer-events-auto">
              {EQUIPMENT_SLOTS_LEFT.map((slot) => {
                const Icon = slot.icon;
                return (
                  <button
                    key={slot.id}
                    onClick={() => {
                      sound.playClick();
                      onNavigateTab?.('inventory');
                    }}
                    onMouseEnter={() => setActiveSlotHover(slot.id)}
                    onMouseLeave={() => setActiveSlotHover(null)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm bg-[#090C10]/90 border border-white/10 hover:border-amber-500/50 hover:bg-[#12161F] transition-all text-left group cursor-pointer shadow-sm"
                  >
                    <div className="w-7 h-7 rounded-xs bg-[#161B26] border border-white/10 flex items-center justify-center text-amber-400 group-hover:text-amber-300 transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="hidden sm:block pr-1">
                      <div className="text-[10px] font-mono font-bold text-slate-200 leading-none">
                        {slot.label}
                      </div>
                      <div className="text-[9px] font-mono font-bold text-amber-400/90 mt-0.5 leading-none">
                        {slot.stat}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 3D Scene Viewport */}
            <div className="w-full h-full relative">
              <CharacterScene3D
                avatarClass={selectedClass}
                theme={character?.equipped_theme || 'cyber_neon'}
              />
            </div>

            {/* Right Equipment Column (4 Pills) */}
            <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-around z-20 pointer-events-auto">
              {EQUIPMENT_SLOTS_RIGHT.map((slot) => {
                const Icon = slot.icon;
                return (
                  <button
                    key={slot.id}
                    onClick={() => {
                      sound.playClick();
                      onNavigateTab?.('inventory');
                    }}
                    onMouseEnter={() => setActiveSlotHover(slot.id)}
                    onMouseLeave={() => setActiveSlotHover(null)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm bg-[#090C10]/90 border border-white/10 hover:border-cyan-500/50 hover:bg-[#12161F] transition-all text-left group cursor-pointer shadow-sm"
                  >
                    <div className="hidden sm:block text-right pl-1">
                      <div className="text-[10px] font-mono font-bold text-slate-200 leading-none">
                        {slot.label}
                      </div>
                      <div className="text-[9px] font-mono font-bold text-cyan-400/90 mt-0.5 leading-none">
                        {slot.stat}
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-xs bg-[#161B26] border border-white/10 flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Bottom HUD Telemetry Label */}
          <div className="pt-2 text-center z-10">
            <div className="py-1 px-3 rounded-xs bg-[#090C10]/80 border border-white/5 inline-block">
              <p className="font-mono text-[10px] tracking-widest text-amber-400/90 uppercase select-none">
                // BINDING PROTOCOL ACTIVE // DISCIPLINE FORGES ASCENSION
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: STACK OF 3 CORE CARDS (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* CARD 1: CHARACTER OVERVIEW */}
          <div className="bg-[#0D1117]/95 border border-white/10 rounded-md p-5 sm:p-7 relative overflow-hidden space-y-5 shadow-hud-obsidian hud-bevel-tl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-orbitron font-extrabold text-lg sm:text-xl text-white uppercase tracking-wider">
                Character Overview
              </h3>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsEditProfileOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-sm bg-[#12161F] hover:bg-[#161B26] border border-amber-500/30 text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5 transition-all cursor-pointer group shadow-xs"
              >
                <span>Edit Profile</span>
                <span className="group-hover:translate-x-0.5 transition-transform">➔</span>
              </button>
            </div>

            {/* Profile Identity */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Glowing Avatar Frame */}
                <div className="p-1 rounded-sm bg-[#12161F] border border-amber-500/40 shadow-hud-amber flex-shrink-0">
                  <Avatar
                    character={character}
                    user={user}
                    size="lg"
                    ring={false}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xs"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-orbitron font-black text-white tracking-wide">
                      {charName}
                    </h2>
                    <span className="text-xs text-amber-400 font-mono font-bold">
                      • {currentArchetype.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-amber-950/40 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-400">
                      <Award className="w-3 h-3" />
                      {character?.equipped_badge?.replace('_', ' ') || 'Novice Adventurer'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="sm:text-right">
                <span className="inline-block px-2.5 py-1 rounded-xs bg-[#090C10] border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-400">
                  [ STATUS: MISSION READY ]
                </span>
              </div>
            </div>

            {/* 4-Stat Strip */}
            <div className="p-3 rounded-sm bg-[#090C10]/90 border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2 rounded-xs bg-[#12161F] border border-white/5">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Level</div>
                <div className="font-mono font-black text-lg text-white">
                  {progression.level}
                </div>
              </div>
              <div className="p-2 rounded-xs bg-[#12161F] border border-white/5">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">XP Progress</div>
                <div className="font-mono font-bold text-sm text-amber-400 leading-snug">
                  {progression.currentLevelXp} / {progression.nextLevelXpRequired}
                  <span className="block text-[10px] font-mono font-semibold text-slate-400">({progression.progressPercentage}%)</span>
                </div>
              </div>
              <div className="p-2 rounded-xs bg-[#12161F] border border-white/5">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Gold</div>
                <div className="font-mono font-black text-lg text-amber-400">
                  🪙 {charGold}
                </div>
              </div>
              <div className="p-2 rounded-xs bg-[#12161F] border border-white/5">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Streak</div>
                <div className="font-mono font-black text-lg text-emerald-400">
                  🔥 {streakDays}d
                </div>
              </div>
            </div>

          </div>

          {/* CARD 2: SELECT COMBAT ARCHETYPE */}
          <div className="bg-[#0D1117]/95 border border-white/10 rounded-md p-5 sm:p-7 relative overflow-hidden space-y-4 shadow-hud-obsidian">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-orbitron font-extrabold text-lg sm:text-xl text-white uppercase tracking-wider">
                Select Combat Archetype
              </h3>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  alert('Archetypes shape your character progression. Cyber Knights excel at physical strength, Neon Sorcerers amplify coding & knowledge intellect, and Quantum Rogues maximize agility & streak multipliers.');
                }}
                className="text-xs font-mono font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Learn More</span>
                <span>➔</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {CLASSES.map((cls) => {
                const isSelected = selectedClass === cls.id;
                return (
                  <button
                    key={cls.id}
                    disabled={savingClass}
                    onClick={() => handleClassSelect(cls.id)}
                    className={`p-4 sm:p-5 rounded-sm border text-left transition-all relative overflow-hidden cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? `bg-[#161B26] border-amber-500 shadow-hud-amber ring-1 ring-amber-500/50`
                        : 'bg-[#090C10]/80 border-white/10 text-slate-300 hover:border-amber-500/40 hover:bg-[#12161F]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl select-none">{cls.icon}</span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-xs bg-amber-500 text-black flex items-center justify-center font-bold">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <div className="font-orbitron font-bold text-sm text-white">
                        {cls.name}
                      </div>
                      <p className="text-xs font-rajdhani font-semibold text-slate-400 mt-1.5 leading-snug">
                        {cls.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-white/10">
                      <span className={`inline-block px-2 py-1 rounded-xs text-[9px] font-mono font-bold uppercase tracking-wider border ${cls.badgeClass}`}>
                        {cls.specialty}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CARD 3: ATTRIBUTE DISTRIBUTION */}
          <div className="bg-[#0D1117]/95 border border-white/10 rounded-md p-5 sm:p-7 relative overflow-hidden space-y-4 shadow-hud-obsidian">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-orbitron font-extrabold text-lg sm:text-xl text-white uppercase tracking-wider">
                Attribute Distribution
              </h3>
              <button
                onClick={() => {
                  sound.playClick();
                  onNavigateTab?.('shop');
                }}
                className="text-xs font-mono font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Get Gear in Shop</span>
                <span>➔</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {statList.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={stat.name} 
                    className="p-4 rounded-sm bg-[#090C10]/90 border border-white/10 space-y-2.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xs ${stat.bgIcon} border border-white/10`}>
                          <Icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <span className="font-orbitron font-bold text-white text-base">
                          {stat.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-black text-2xl text-white">
                          {stat.val}
                        </span>
                        {stat.bonus > 0 && (
                          <span className="ml-1 text-xs font-mono font-bold text-emerald-400">
                            (+{stat.bonus})
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs font-rajdhani font-semibold text-slate-400 leading-tight">
                      {stat.desc}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                      <span>Base: {stat.base}</span>
                      <span>Gear Bonus: +{stat.bonus}</span>
                    </div>

                    <div className="w-full bg-[#161B26] h-2 rounded-xs overflow-hidden border border-white/5">
                      <div
                        className={`h-full bg-gradient-to-r ${stat.bar} rounded-xs transition-all duration-500`}
                        style={{ width: `${Math.min(100, (stat.val / 100) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* 3. LOWER SECTION: LEVEL PROGRESS & EQUIPPED GEAR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEVEL PROGRESS CARD */}
        <div className="bg-[#0D1117]/95 border border-white/10 rounded-md p-5 sm:p-7 relative overflow-hidden space-y-4 flex flex-col justify-between shadow-hud-obsidian">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xs bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-orbitron font-black text-lg text-white uppercase tracking-wider">
                  Level Progress
                </h3>
                <p className="text-xs font-mono font-semibold text-slate-400">
                  {getRankTitle(progression.level)}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-xs bg-amber-950/40 border border-amber-500/40 text-xs font-mono font-bold text-amber-400">
              Level {progression.level}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-slate-300">
                {progression.currentLevelXp} / {progression.nextLevelXpRequired} XP
              </span>
              <span className="text-amber-400">
                {progression.progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-[#090C10] h-3 rounded-xs overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 rounded-xs transition-all duration-700 shadow-hud-amber"
                style={{ width: `${Math.min(100, progression.progressPercentage)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-white/10">
            <span>{progression.nextLevelXpRequired - progression.currentLevelXp} XP to Level {progression.level + 1}</span>
            <span className="text-amber-400 font-bold font-mono text-[11px]">Next: Quantum Core Slot</span>
          </div>
        </div>

        {/* EQUIPPED GEAR CARD */}
        <div className="bg-[#0D1117]/95 border border-white/10 rounded-md p-5 sm:p-7 relative overflow-hidden space-y-4 flex flex-col justify-between shadow-hud-obsidian">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xs bg-[#12161F] border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-orbitron font-black text-lg text-white uppercase tracking-wider">
                  Equipped Gear
                </h3>
                <p className="text-xs font-mono font-semibold text-slate-400">
                  Active loadout bonuses & attributes
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onNavigateTab?.('inventory');
              }}
              className="text-xs font-mono font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage</span>
              <span>➔</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {equippedGearList.map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.name}
                  onClick={() => {
                    sound.playClick();
                    onNavigateTab?.('inventory');
                  }}
                  className="p-3.5 rounded-sm bg-[#090C10]/90 border border-white/10 hover:border-amber-500/30 transition-all flex items-center gap-3 cursor-pointer group"
                >
                  <div className={`w-9 h-9 rounded-xs ${item.bg} flex items-center justify-center ${item.color} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-orbitron font-bold text-xs text-white leading-snug">
                      {item.name}
                    </div>
                    <div className="text-[10px] font-mono font-bold text-amber-400">
                      {item.slot} • {item.bonus}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-right pt-1">
            <span className="text-[11px] font-mono font-bold text-slate-400">
              Total Gear Stat Bonus: <span className="text-emerald-400">+45 Attributes</span>
            </span>
          </div>
        </div>

      </div>

      {/* 4. DUAL BOTTOM BANNERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* BANNER 1: YOUR JOURNEY CONTINUES */}
        <div className="bg-[#0D1117]/95 border border-white/10 hover:border-amber-500/40 rounded-md p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between group shadow-hud-obsidian transition-all">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 z-10">
            <div className="w-12 h-12 rounded-xs bg-[#12161F] border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-xs">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-orbitron font-black text-white tracking-tight">
              Your Journey Continues
            </h3>
            <p className="text-sm font-rajdhani font-semibold text-slate-300 max-w-md">
              Complete daily quests to level up your character, unlock new equipment slots, and reach the Grandmaster tier.
            </p>
          </div>

          <div className="mt-6 z-10">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onNavigateTab?.('quests');
              }}
              className="px-5 py-2.5 rounded-sm bg-[#12161F] hover:bg-[#161B26] border border-amber-500/40 text-xs font-mono font-bold text-amber-400 flex items-center gap-2 shadow-sm cursor-pointer transition-all"
            >
              <span>View Achievements</span>
              <span>➔</span>
            </button>
          </div>
        </div>

        {/* BANNER 2: UNLOCK NEW POSSIBILITIES */}
        <div className="bg-[#0D1117]/95 border border-white/10 hover:border-amber-500/40 rounded-md p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between group shadow-hud-obsidian transition-all">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 z-10">
            <div className="w-12 h-12 rounded-xs bg-[#12161F] border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-orbitron font-black text-white tracking-tight">
              Unlock New Possibilities
            </h3>
            <p className="text-sm font-rajdhani font-semibold text-slate-300 max-w-md">
              Acquire exclusive weapons, armor, relics, and companions in the shop using earned Gold and Gems.
            </p>
          </div>

          <div className="mt-6 z-10">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onNavigateTab?.('shop');
              }}
              className="px-5 py-2.5 rounded-sm bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold flex items-center gap-2 shadow-hud-amber cursor-pointer transition-all"
            >
              <span>Explore Shop</span>
              <span>➔</span>
            </button>
          </div>
        </div>

      </div>

      {/* 5. FLOATING BOTTOM HUD FOOTER */}
      <div className="w-full flex items-center justify-between px-6 py-3 rounded-sm bg-[#0D1117]/95 backdrop-blur-2xl border border-amber-500/30 shadow-hud-obsidian text-xs font-mono text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-xs bg-emerald-400 animate-ping" />
          <span>Active Operative: <strong className="text-white font-orbitron">{charName}</strong> ({currentArchetype.name})</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px] font-mono text-slate-400">
          <span>4 Attributes Active</span>
          <span>•</span>
          <span>8 Equipment Slots Online</span>
        </div>
        <div>
          <span className="text-amber-400 font-mono text-xs">
            Rank: {getRankTitle(progression.level)}
          </span>
        </div>
      </div>

      {/* 6. EDIT PROFILE MODAL */}
      <AnimatePresence>
        {isEditProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditProfileOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-[#090C10] border border-amber-500/40 p-6 sm:p-8 rounded-md shadow-2xl z-10 space-y-6"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                    // IDENTITY & DOSSIER
                  </span>
                  <h3 className="text-xl font-orbitron font-black text-white">
                    Edit Character Profile
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="p-1.5 rounded-xs hover:bg-[#161B26] text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Visual Theme Info */}
              <div className="flex items-center justify-between p-4 rounded-sm bg-[#12161F] border border-white/10">
                <div>
                  <div className="font-orbitron font-bold text-sm text-white">
                    Theme Designation
                  </div>
                  <div className="text-xs font-mono text-amber-400/90 mt-0.5">
                    The Daily Ascension (Dark Fantasy RPG HUD)
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-[#090C10] p-1.5 rounded-xs border border-amber-500/30">
                  <span className="px-3 py-1 font-mono text-xs font-bold text-amber-400">
                    ACTIVE
                  </span>
                </div>
              </div>

              {/* Avatar Uploader */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Custom Character Portrait
                </label>
                <AvatarUploader
                  character={character}
                  onAvatarUpdated={(updated) => {
                    onAvatarUpdated?.(updated);
                  }}
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-6 py-2 rounded-xs bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs shadow-hud-amber transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
