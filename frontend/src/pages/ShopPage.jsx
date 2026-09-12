import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Coins, 
  Sword, 
  BookOpen, 
  Hourglass, 
  Shield, 
  Cpu, 
  Flame, 
  Eye, 
  Zap, 
  Palette, 
  Moon, 
  Sun, 
  Terminal, 
  Award, 
  Code, 
  Dumbbell, 
  Book, 
  Check, 
  Lock 
} from 'lucide-react';
import { sound } from '../services/sound';

const ICON_MAP = {
  Sword,
  BookOpen,
  Hourglass,
  Shield,
  Cpu,
  Flame,
  Eye,
  Zap,
  Palette,
  Moon,
  Sun,
  Terminal,
  Award,
  Code,
  Dumbbell,
  Book,
};

const RARITY_COLORS = {
  COMMON: 'text-slate-300 border-white/10 bg-[#12161F]',
  RARE: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40',
  EPIC: 'text-amber-400 border-amber-500/40 bg-amber-950/40',
  LEGENDARY: 'text-amber-300 border-amber-500/80 bg-amber-950/60 shadow-hud-amber',
  MYTHIC: 'text-emerald-400 border-emerald-500/80 bg-emerald-950/60 shadow-hud-emerald',
};

export default function ShopPage({
  shopItems,
  character,
  onBuyItem,
  onNavigateTab,
}) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [purchasingKey, setPurchasingKey] = useState(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState('');

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'relic', label: 'Relics & Weapons' },
    { id: 'companion', label: 'Cyber Companions' },
    { id: 'theme', label: 'Visual Themes' },
    { id: 'badge', label: 'Profile Badges' },
  ];

  const filteredItems = shopItems.filter((item) => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  const handlePurchase = async (item) => {
    if (item.owned) return;
    if ((character?.gold || 0) < item.price) {
      sound.playClick();
      alert(`Insufficient Gold! You need ${item.price} Gold, but currently have ${character?.gold || 0} Gold. Complete more quests!`);
      return;
    }

    setPurchasingKey(item.item_key);
    sound.playCoin();
    try {
      await onBuyItem(item.item_key);
      setPurchaseSuccess(`Acquired ${item.name}!`);
      setTimeout(() => setPurchaseSuccess(''), 3000);
    } catch (err) {
      alert(err.message || 'Purchase failed.');
    } finally {
      setPurchasingKey(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative z-10">
      
      {/* Header & Balance Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase">
            — RELIC BAZAAR // FORGE ARTIFACTS
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-orbitron">
            Bazaar of <span className="text-amber-400">Ascension</span>
          </h1>
          <p className="text-sm font-rajdhani font-semibold text-slate-300">
            Exchange your quest-earned Gold for high-tier relics, themes, and profile augmentations.
          </p>
        </div>

        {/* Player Gold Balance Display */}
        <div className="flex items-center gap-3">
          <div className="px-5 py-2.5 rounded-sm bg-[#0D1117]/95 backdrop-blur-2xl border border-amber-500/30 shadow-hud-obsidian flex items-center gap-3.5">
            <Coins className="w-6 h-6 text-amber-500" />
            <div>
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Available Gold</div>
              <div className="text-2xl font-mono font-black text-amber-400">{character?.gold || 0} G</div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {purchaseSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-sm bg-[#0D1117] border border-emerald-500 text-emerald-400 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-between px-6 shadow-hud-emerald"
        >
          <span>✦ {purchaseSuccess}</span>
          <button
            onClick={() => onNavigateTab('inventory')}
            className="underline hover:text-white cursor-pointer"
          >
            View in Inventory ➔
          </button>
        </motion.div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-sm bg-[#0D1117]/95 border border-white/10 shadow-hud-obsidian font-mono font-bold text-xs w-fit">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              sound.playClick();
              setFilterCategory(cat.id);
            }}
            className={`px-4 py-1.5 rounded-xs transition-all font-mono text-xs cursor-pointer ${
              filterCategory === cat.id
                ? 'bg-amber-500 text-black font-bold shadow-hud-amber'
                : 'text-slate-400 hover:text-white hover:bg-[#12161F]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Shop Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => {
          const Icon = ICON_MAP[item.icon] || ShoppingBag;
          const rarityClass = RARITY_COLORS[item.rarity] || RARITY_COLORS.COMMON;
          const isAffordable = (character?.gold || 0) >= item.price;
          const isBuying = purchasingKey === item.item_key;

          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -3 }}
              className={`p-5 flex flex-col justify-between rounded-md border backdrop-blur-2xl transition-all duration-300 hud-bevel-tl shadow-hud-obsidian ${
                item.owned
                  ? 'bg-[#0D1117]/60 border-white/5 opacity-70'
                  : 'bg-[#0D1117]/95 border-white/10 hover:border-amber-500/40'
              }`}
            >
              <div>
                {/* Top Badge & Category */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-xs border uppercase tracking-wider ${rarityClass}`}>
                    {item.rarity}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    {item.category}
                  </span>
                </div>

                {/* Icon Container */}
                <div className="w-14 h-14 rounded-xs bg-[#12161F] border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 mx-auto shadow-inner">
                  <Icon className="w-7 h-7" />
                </div>

                {/* Item Name */}
                <h3 className="font-orbitron font-bold text-sm text-white text-center leading-snug mb-1">
                  {item.name}
                </h3>

                {/* Item Description */}
                <p className="text-xs font-rajdhani font-semibold text-slate-400 text-center leading-snug mb-3">
                  {item.description}
                </p>

                {/* Attribute Bonus Preview */}
                {item.attribute_bonus && Object.keys(item.attribute_bonus).length > 0 && (
                  <div className="p-2 rounded-xs bg-[#12161F] border border-white/5 text-center text-[11px] font-mono font-bold text-amber-400 mb-3">
                    {Object.entries(item.attribute_bonus).map(([k, v]) => (
                      <span key={k}>+{v} {k.toUpperCase()} </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Purchase Button / Owned Status */}
              <div className="pt-3 border-t border-white/10">
                {item.owned ? (
                  <div className="w-full py-2 rounded-xs bg-[#12161F] border border-emerald-500/30 text-emerald-400 font-mono font-bold text-xs uppercase flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Acquired</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={isBuying || !isAffordable}
                    className={`w-full py-2 rounded-xs font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                      isAffordable
                        ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-hud-amber active:scale-95'
                        : 'bg-[#12161F] border border-white/10 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isBuying ? (
                      <span>Synthesizing...</span>
                    ) : (
                      <>
                        <Coins className="w-3.5 h-3.5" />
                        <span>{item.price} Gold</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
