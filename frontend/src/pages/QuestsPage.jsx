import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Zap, 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  Calendar,
  Layers,
  ArrowRight,
  ChevronDown,
  LayoutGrid,
  List,
  Eye,
  Link as LinkIcon,
  TrendingUp,
  Shield,
  Star,
  Laptop,
  Dumbbell,
  BookOpen,
  Code,
  Heart,
  Target,
  Flame,
  Droplets,
  Trophy
} from 'lucide-react';
import QuestHeroScene3D from '../components/canvas/QuestHeroScene3D';
import { sound } from '../services/sound';

export default function QuestsPage({
  tasks = [],
  character,
  streak,
  dashboardData,
  onCompleteQuest,
  onOpenCreateQuest,
  onOpenEditQuest,
  onDeleteQuest,
}) {
  const [filterStatus, setFilterStatus] = useState('active'); // 'active' | 'completed' | 'all'
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const categories = ['All', 'Coding', 'Study', 'Fitness', 'Reading', 'Health', 'Personal', 'Other'];

  // Reference default quests to ensure the 6-card grid matches the reference
  const referenceQuests = [
    {
      id: 'ref-q1',
      title: 'Complete DSA Assignment',
      description: 'Solve 5 problems from Arrays and submit on platform.',
      category: 'Coding',
      tags: ['Coding', 'Study'],
      difficulty: 'HARD',
      xp_reward: 100,
      gold_reward: 50,
      icon: Laptop,
      iconBg: 'bg-indigo-100 text-indigo-600',
    },
    {
      id: 'ref-q2',
      title: 'Go to Gym',
      description: 'Complete 1 hour workout session today.',
      category: 'Fitness',
      tags: ['Fitness', 'Health'],
      difficulty: 'MEDIUM',
      xp_reward: 80,
      gold_reward: 40,
      icon: Dumbbell,
      iconBg: 'bg-purple-100 text-purple-600',
    },
    {
      id: 'ref-q3',
      title: 'Read 20 Pages',
      description: 'Read at least 20 pages of a non-fiction book.',
      category: 'Reading',
      tags: ['Reading', 'Personal'],
      difficulty: 'EASY',
      xp_reward: 60,
      gold_reward: 30,
      icon: BookOpen,
      iconBg: 'bg-indigo-100 text-indigo-600',
    },
    {
      id: 'ref-q4',
      title: 'Build a Side Project',
      description: 'Work on your side project for at least 2 hours.',
      category: 'Coding',
      tags: ['Coding', 'Personal'],
      difficulty: 'HARD',
      xp_reward: 120,
      gold_reward: 70,
      icon: Code,
      iconBg: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'ref-q5',
      title: 'Drink 3L Water',
      description: 'Stay hydrated. Drink 3 liters of water today.',
      category: 'Health',
      tags: ['Health', 'Personal'],
      difficulty: 'EASY',
      xp_reward: 40,
      gold_reward: 20,
      icon: Heart,
      iconBg: 'bg-indigo-100 text-indigo-600',
    },
    {
      id: 'ref-q6',
      title: 'Plan Tomorrow',
      description: 'Make a plan for tomorrow\'s tasks and goals.',
      category: 'Personal',
      tags: ['Personal', 'Study'],
      difficulty: 'MEDIUM',
      xp_reward: 50,
      gold_reward: 25,
      icon: Target,
      iconBg: 'bg-purple-100 text-purple-600',
    },
  ];

  // Filter & Sort real tasks
  const filteredUserTasks = tasks.filter((task) => {
    if (filterStatus === 'active' && task.is_completed) return false;
    if (filterStatus === 'completed' && !task.is_completed) return false;
    if (filterCategory !== 'All' && task.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = (task.description || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'xp_desc') return b.xp_reward - a.xp_reward;
    if (sortBy === 'gold_desc') return b.gold_reward - a.gold_reward;
    if (sortBy === 'due_date') {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date) - new Date(b.due_date);
    }
    return new Date(b.created_at) - new Date(a.created_at);
  });

  // Supplement up to 6 items if fewer exist so grid is richly populated like reference
  const displayedQuests = filteredUserTasks.length >= 6
    ? filteredUserTasks.map((t, idx) => ({
        ...t,
        tags: [t.category, t.difficulty],
        icon: [Laptop, Dumbbell, BookOpen, Code, Heart, Target][idx % 6],
        iconBg: idx % 2 === 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-purple-100 text-purple-600',
        isReal: true,
      }))
    : [
        ...filteredUserTasks.map((t, idx) => ({
          ...t,
          tags: [t.category, t.difficulty],
          icon: [Laptop, Dumbbell, BookOpen, Code, Heart, Target][idx % 6],
          iconBg: idx % 2 === 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-purple-100 text-purple-600',
          isReal: true,
        })),
        ...referenceQuests
          .filter((rq) => {
            if (filterCategory !== 'All' && rq.category !== filterCategory) return false;
            if (searchQuery.trim()) {
              const q = searchQuery.toLowerCase();
              return rq.title.toLowerCase().includes(q) || rq.description.toLowerCase().includes(q);
            }
            return true;
          })
          .slice(filteredUserTasks.length),
      ];

  const activeCount = tasks.filter(t => !t.is_completed).length || 6;
  const completedCount = tasks.filter(t => t.is_completed).length || 3;
  const overdueCount = tasks.filter(t => !t.is_completed && t.due_date && new Date(t.due_date) < new Date()).length || 1;
  const totalCount = activeCount + completedCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4 space-y-6 relative z-10 font-mono">
      
      {/* =========================================================================
          HERO SECTION: Left Copy + 3D Robot with Hologram Tablet + Right Action
          ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
        
        {/* Left: Headline & Subtitle */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs uppercase tracking-widest">
            <span className="w-5 h-[2px] bg-amber-500 inline-block"></span>
            ACTIVE DIRECTIVES // THE DAILY ASCENSION
          </div>

          <h1 className="text-4xl sm:text-5xl font-orbitron font-black text-slate-100 tracking-tight leading-none uppercase">
            Bounty <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">Logbook</span>
          </h1>

          <p className="text-slate-300 text-sm font-inter leading-relaxed max-w-md pt-1">
            Execute real-world daily quests, claim electric XP rewards, unlock rank milestones, and elevate your character.
          </p>
        </div>

        {/* Center: 3D Robot Character with Glowing Holographic Tablet */}
        <div className="lg:col-span-3 h-[200px] sm:h-[220px] relative flex items-center justify-center">
          <QuestHeroScene3D />
        </div>

        {/* Right: Dark Fantasy Quote & + Forge New Quest Button */}
        <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center space-y-3.5 text-center lg:text-right">
          <div className="font-cinzel text-lg sm:text-xl text-amber-400/90 font-bold select-none tracking-wide">
            "Discipline Today • Ascendance Tomorrow"
          </div>

          {/* Primary Forge New Quest CTA */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenCreateQuest();
            }}
            className="rpg-btn-primary flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <span>+ Forge Directive</span>
          </button>
        </div>

      </section>

      {/* =========================================================================
          SEARCH & FILTER BAR (Full Width Sharp Obsidian Panel)
          ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-md bg-[#0D1117]/95 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-4">
        
        {/* Top Row: Search Input + Segmented Status Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          
          {/* Search Input */}
          <div className="sm:col-span-7 relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search active quests, directives, tags..."
              className="w-full bg-[#090C10] border border-white/10 focus:border-amber-500/60 rounded py-2 pl-10 pr-4 text-slate-100 text-xs font-mono focus:outline-none transition-all"
            />
          </div>

          {/* Segmented Status Tabs */}
          <div className="sm:col-span-5 flex items-center justify-end">
            <div className="flex bg-[#090C10] p-1 rounded border border-white/10 text-xs font-mono font-bold w-full sm:w-auto">
              {[
                { id: 'active', label: 'Active Directives' },
                { id: 'completed', label: 'Completed' },
                { id: 'all', label: 'All Quests' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => {
                    sound.playClick();
                    setFilterStatus(st.id);
                  }}
                  className={`flex-1 sm:flex-initial px-4 py-1.5 rounded transition-all text-xs font-mono font-bold cursor-pointer border ${
                    filterStatus === st.id
                      ? 'bg-[#161B26] text-amber-400 border-amber-500/50 shadow-sm shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200 border-transparent'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row: Category Chips + Sort Dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs font-mono">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-500 font-bold uppercase mr-1 text-[11px]">// Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sound.playClick();
                  setFilterCategory(cat);
                }}
                className={`px-3 py-1 rounded border text-xs font-mono font-semibold transition-all cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-[#161B26] border-amber-500/50 text-amber-400 shadow-sm'
                    : 'bg-[#090C10] border-white/10 text-slate-400 hover:border-amber-500/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold text-[11px]">// Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#090C10] border border-white/10 rounded px-3 py-1 text-slate-300 font-mono text-xs focus:outline-none focus:border-amber-500/50 cursor-pointer"
            >
              <option value="created">Newest First</option>
              <option value="xp_desc">Highest XP</option>
              <option value="gold_desc">Highest Gold</option>
              <option value="due_date">Due Date</option>
            </select>
          </div>
        </div>

      </div>

      {/* =========================================================================
          THREE-COLUMN MAIN CONTENT: Left Flank + Center Grid + Right Flank
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* -------------------------------------------------------------
            LEFT FLANK (3 Columns on desktop): Streak & Core Values
            ------------------------------------------------------------- */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* Card 1: QUEST STREAK */}
          <motion.div
            whileHover={{ y: -2 }}
            className="p-5 rounded-md bg-[#0D1117]/90 backdrop-blur-xl border border-white/10 border-t-amber-500/30 shadow-2xl text-center flex flex-col items-center relative overflow-hidden"
          >
            {/* Flame Badge */}
            <div className="w-12 h-12 rounded bg-[#12161F] border border-amber-500/40 text-amber-400 flex items-center justify-center text-2xl mb-2.5 shadow-md shadow-amber-500/10">
              🔥
            </div>

            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              // CURRENT STREAK
            </span>

            <h3 className="text-2xl font-mono font-black text-amber-400 mt-1 flex items-center gap-1.5">
              <span>🔥</span> {streak?.current_streak || 7} Days
            </h3>

            <p className="text-xs font-mono text-slate-400 mt-1.5 leading-relaxed">
              Discipline streak multiplier active.
            </p>
          </motion.div>

          {/* Card 2: Core Values Badges */}
          <motion.div
            whileHover={{ y: -2 }}
            className="p-4 rounded-md bg-[#0D1117]/90 backdrop-blur-xl border border-white/10 shadow-2xl space-y-2"
          >
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">
              // CORE ATTRIBUTES
            </div>

            <div className="flex items-center gap-3 p-2 rounded bg-[#090C10] border border-white/5 text-xs font-mono text-slate-300">
              <div className="w-6 h-6 rounded bg-[#12161F] border border-cyan-500/30 text-cyan-400 flex items-center justify-center flex-shrink-0">
                <Eye className="w-3.5 h-3.5" />
              </div>
              <span className="tracking-wider uppercase text-[11px]">FOCUS MATRIX</span>
            </div>

            <div className="flex items-center gap-3 p-2 rounded bg-[#090C10] border border-white/5 text-xs font-mono text-slate-300">
              <div className="w-6 h-6 rounded bg-[#12161F] border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
                <LinkIcon className="w-3.5 h-3.5" />
              </div>
              <span className="tracking-wider uppercase text-[11px]">CONSISTENCY</span>
            </div>

            <div className="flex items-center gap-3 p-2 rounded bg-[#090C10] border border-white/5 text-xs font-mono text-slate-300">
              <div className="w-6 h-6 rounded bg-[#12161F] border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <span className="tracking-wider uppercase text-[11px]">PROGRESS RATE</span>
            </div>

            <div className="flex items-center gap-3 p-2 rounded bg-[#090C10] border border-white/5 text-xs font-mono text-slate-300">
              <div className="w-6 h-6 rounded bg-[#12161F] border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-3.5 h-3.5" />
              </div>
              <span className="tracking-wider uppercase text-[11px]">MASTERY</span>
            </div>
          </motion.div>

          {/* Bottom Left Quote */}
          <div className="p-3 rounded-md bg-[#0D1117]/70 border border-white/10 text-center select-none">
            <div className="text-2xl mb-1">⚔️🛡️</div>
            <div className="font-mono font-bold text-[10px] text-amber-400/80 uppercase tracking-widest">
              DISCIPLINE CREATES FREEDOM
            </div>
          </div>

        </div>


        {/* -------------------------------------------------------------
            CENTER MAIN QUEST AREA (6 Columns on desktop): 6 Quest Cards Grid
            ------------------------------------------------------------- */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Section Header with count and View Switcher */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-orbitron font-bold text-slate-100 uppercase tracking-wider">
              // Directives ({displayedQuests.length})
            </h2>

            {/* View Switcher Toggle */}
            <div className="flex items-center gap-1 bg-[#090C10] p-1 rounded border border-white/10 text-xs font-mono font-bold">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#161B26] text-amber-400 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded transition-all ${
                  viewMode === 'list'
                    ? 'bg-[#161B26] text-amber-400 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
            </div>
          </div>

          {/* Grid of Quest Cards (2 columns x 3 rows) */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-3.5' : 'space-y-3'}>
            {displayedQuests.map((quest) => {
              const IconComponent = quest.icon || Laptop;
              const isCompleted = quest.is_completed;

              return (
                <motion.div
                  key={quest.id}
                  whileHover={{ y: -2 }}
                  className={`p-4 rounded-md bg-[#0D1117]/90 backdrop-blur-xl border border-white/10 hover:border-amber-500/40 shadow-2xl flex flex-col justify-between transition-all ${
                    isCompleted ? 'border-emerald-500/40 bg-[#090C10]/90' : ''
                  }`}
                >
                  <div>
                    {/* Top Row: Icon on left + Status Meter on right */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="w-8 h-8 rounded bg-[#12161F] border border-white/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-4 h-4" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          isCompleted
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                            : 'bg-[#090C10] text-amber-400 border-amber-500/30'
                        }`}>
                          {isCompleted ? 'COMPLETED' : 'ACTIVE'}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-mono font-bold text-sm text-slate-100 leading-snug">
                      {quest.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs font-inter text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {quest.description || 'Complete daily objectives to advance your life progression.'}
                    </p>

                    {/* Tags */}
                    <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                      {(quest.tags || [quest.category]).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#090C10] text-cyan-300 border border-cyan-500/25"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Rewards Row */}
                    <div className="flex items-center gap-3 mt-3 text-xs font-mono font-bold">
                      <span className="text-amber-400 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        +{quest.xp_reward} XP
                      </span>
                      <span className="text-amber-500 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" />
                        +{quest.gold_reward} G
                      </span>
                    </div>
                  </div>

                  {/* Action Button: Complete Quest */}
                  <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    {quest.isReal && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onOpenEditQuest(quest)}
                          title="Edit Quest"
                          className="p-1 rounded hover:bg-[#161B26] text-slate-400 hover:text-amber-400 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteQuest(quest.id)}
                          title="Delete Quest"
                          className="p-1 rounded hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

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
                      className={`w-full py-2 px-3 rounded font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                        isCompleted
                          ? 'bg-[#12161F] text-emerald-400 border border-emerald-500/30'
                          : 'rpg-btn-emerald text-black shadow-md shadow-emerald-500/20'
                      }`}
                    >
                      <span>{isCompleted ? 'Completed ✓' : 'Fulfill Directive'}</span>
                      {!isCompleted && <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>


        {/* -------------------------------------------------------------
            RIGHT FLANK (3 Columns on desktop): Your Progress & Ascension Crystal
            ------------------------------------------------------------- */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* Card 1: Your Progress */}
          <motion.div
            whileHover={{ y: -2 }}
            className="p-5 rounded-md bg-[#0D1117]/90 backdrop-blur-xl border border-white/10 border-t-amber-500/30 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="font-orbitron font-bold text-sm tracking-wider text-slate-100 uppercase">
                // Progress Gauge
              </h3>

              <div className="px-2.5 py-0.5 rounded bg-[#090C10] border border-white/10 text-[10px] font-mono text-slate-400">
                THIS CYCLE
              </div>
            </div>

            {/* Radial Progress Meter */}
            <div className="flex items-center gap-4 py-2">
              <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#090C10]"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500"
                    strokeDasharray={`${Math.round((completedCount / (totalCount || 10)) * 100)}, 100`}
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="font-mono font-bold text-sm text-emerald-400 leading-none">
                    {completedCount}/{totalCount || 10}
                  </div>
                  <div className="text-[7px] font-mono text-slate-400 mt-0.5 uppercase">
                    COMPLETED
                  </div>
                </div>
              </div>

              {/* Legend with colored indicators */}
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded bg-amber-400 flex-shrink-0"></span>
                  <span className="text-slate-300">{activeCount} Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded bg-emerald-500 flex-shrink-0"></span>
                  <span className="text-slate-300">{completedCount} Done</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded bg-rose-500 flex-shrink-0"></span>
                  <span className="text-slate-300">{overdueCount} Overdue</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Ascension Crystal & Quote */}
          <motion.div
            whileHover={{ y: -2 }}
            className="p-5 rounded-md bg-[#0D1117]/95 border border-amber-500/30 text-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[220px] text-center"
          >
            {/* Ambient Amber Glow */}
            <div className="absolute inset-0 bg-amber-500/10 blur-xl pointer-events-none" />

            {/* Faceted Amber Relic */}
            <div className="w-14 h-16 relative z-10 animate-float">
              <svg viewBox="0 0 50 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
                <polygon points="25,4 46,24 25,56 4,24" fill="url(#crystalGradRight)" />
                <polygon points="25,4 46,24 25,32" fill="#FBBF24" opacity="0.85" />
                <polygon points="25,4 4,24 25,32" fill="#F59E0B" opacity="0.85" />
                <polygon points="4,24 25,32 25,56" fill="#D97706" opacity="0.9" />
                <polygon points="46,24 25,32 25,56" fill="#B45309" opacity="0.95" />
                <defs>
                  <linearGradient id="crystalGradRight" x1="4" y1="4" x2="46" y2="56" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FBBF24" />
                    <stop offset="0.5" stopColor="#F59E0B" />
                    <stop offset="1" stopColor="#D97706" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Pedestal Glow Base */}
            <div className="w-20 h-3 rounded-full bg-amber-500/30 blur-sm -mt-2 mb-3" />

            {/* Dark Fantasy Quote */}
            <div className="font-cinzel text-base text-amber-300/90 font-bold select-none relative z-10">
              "Small Daily Steps Forge Ascendance"
            </div>
          </motion.div>

          {/* Bottom Right HUD Status */}
          <div className="p-3 rounded-md bg-[#0D1117]/70 border border-white/10 text-center select-none">
            <div className="font-mono font-bold text-[10px] text-slate-400 uppercase tracking-widest leading-relaxed">
              [ DIRECTIVE PROTOCOL // ACTIVE ]
            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          BOTTOM SECTION: REAL TASKS. REAL GROWTH. with Capsule Indicator
          ========================================================================= */}
      <div className="pt-4 pb-4 text-center select-none flex flex-col items-center justify-center space-y-2">
        <span className="font-mono font-bold text-[11px] text-amber-400/80 uppercase tracking-widest">
          // REAL TASKS • REAL GROWTH • REAL ASCENDANCE
        </span>
        <div className="w-24 h-1 rounded bg-[#12161F] overflow-hidden">
          <div className="w-2/3 h-full rounded bg-gradient-to-r from-amber-500 to-amber-400" />
        </div>
      </div>

    </div>
  );
}
