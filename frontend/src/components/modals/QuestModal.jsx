import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckSquare, Zap, Coins, Sparkles, Calendar } from 'lucide-react';
import { sound } from '../../services/sound';

const CATEGORIES = [
  { id: 'Coding', label: 'Coding', defaultAttr: 'Intellect' },
  { id: 'Study', label: 'Study', defaultAttr: 'Wisdom' },
  { id: 'Fitness', label: 'Fitness', defaultAttr: 'Strength' },
  { id: 'Reading', label: 'Reading', defaultAttr: 'Wisdom' },
  { id: 'Health', label: 'Health', defaultAttr: 'Vitality' },
  { id: 'Personal', label: 'Personal', defaultAttr: 'Vitality' },
  { id: 'Other', label: 'Other', defaultAttr: 'Intellect' },
];

const DIFFICULTIES = [
  { id: 'EASY', label: 'Easy', xp: 40, gold: 20, attr: 5, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40' },
  { id: 'MEDIUM', label: 'Medium', xp: 80, gold: 40, attr: 8, color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40' },
  { id: 'HARD', label: 'Hard', xp: 150, gold: 75, attr: 15, color: 'text-amber-400 border-amber-500/40 bg-amber-950/40' },
  { id: 'EPIC', label: 'Epic', xp: 300, gold: 150, attr: 25, color: 'text-amber-300 border-amber-500/80 bg-amber-950/60' },
  { id: 'LEGENDARY', label: 'Legendary', xp: 600, gold: 300, attr: 50, color: 'text-rose-400 border-rose-500/80 bg-rose-950/60' },
];

export default function QuestModal({ isOpen, onClose, onSave, editingTask = null }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Coding');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setCategory(editingTask.category || 'Coding');
      setDifficulty(editingTask.difficulty || 'MEDIUM');
      setDueDate(editingTask.due_date ? editingTask.due_date.split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setCategory('Coding');
      setDifficulty('MEDIUM');
      setDueDate('');
    }
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const currentDiff = DIFFICULTIES.find(d => d.id === difficulty) || DIFFICULTIES[1];
  const currentCat = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        category,
        difficulty,
        attribute_reward: currentCat.defaultAttr,
        due_date: dueDate || null,
      });
      sound.playClick();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative z-10 w-full max-w-lg bg-[#090C10] p-6 sm:p-8 rounded-md border border-amber-500/40 shadow-2xl overflow-hidden hud-bevel-tl"
        >
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-5 right-5 p-1.5 rounded-xs text-slate-400 hover:text-white hover:bg-[#12161F] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xs bg-[#12161F] border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-xs">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-orbitron font-black text-xl text-white uppercase tracking-wide">
                {editingTask ? 'Refactor Quest' : 'Forge New Quest'}
              </h3>
              <p className="text-amber-400/80 text-xs font-mono font-semibold">
                // DEFINE OBJECTIVE // ALLOCATE REWARDS // ASCEND
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-mono">
            {/* Title */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Quest Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Complete DSA Graphs, Bench Press 80kg, Read 30 Pages"
                className="w-full bg-[#0D1117] border border-white/10 focus:border-amber-400 rounded-xs py-2 px-3 text-white text-sm focus:outline-none transition-colors font-mono"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Description / Objectives (Optional)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Specific success criteria, LeetCode problem numbers, or chapter details..."
                className="w-full bg-[#0D1117] border border-white/10 focus:border-amber-400 rounded-xs py-2 px-3 text-white text-sm focus:outline-none transition-colors resize-none font-mono"
              />
            </div>

            {/* Category & Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Discipline Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0D1117] border border-white/10 focus:border-amber-400 rounded-xs py-2 px-3 text-white text-sm focus:outline-none transition-colors font-mono"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id} className="bg-[#090C10] text-white">
                      {cat.label} (➔ +{cat.defaultAttr})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Target Deadline
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#0D1117] border border-white/10 focus:border-amber-400 rounded-xs py-2 px-3 text-white text-sm focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Difficulty Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Quest Difficulty
              </label>
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setDifficulty(diff.id);
                    }}
                    className={`py-2 px-1 rounded-xs border text-center transition-all text-xs font-bold font-mono cursor-pointer ${
                      difficulty === diff.id
                        ? `${diff.color} border-amber-500 shadow-hud-amber scale-105`
                        : 'bg-[#0D1117] border-white/10 text-slate-400 hover:border-amber-500/30'
                    }`}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Calculated Reward Preview Box */}
            <div className="p-3.5 rounded-xs bg-[#0D1117] border border-white/10 flex items-center justify-between font-mono text-xs font-bold">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Zap className="w-4 h-4" />
                <span>+{currentDiff.xp} XP</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400">
                <Coins className="w-4 h-4" />
                <span>+{currentDiff.gold} Gold</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-400">
                <Sparkles className="w-4 h-4" />
                <span>+{currentDiff.attr} {currentCat.defaultAttr}</span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xs bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-hud-amber transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {editingTask ? 'Update Quest Record' : 'Deploy Quest to Logbook ➔'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
