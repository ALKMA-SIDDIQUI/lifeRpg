import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Check, 
  ShoppingBag, 
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
  Book 
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

export default function InventoryPage({
  inventory,
  character,
  onEquipItem,
  onNavigateTab,
}) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [equippingKey, setEquippingKey] = useState(null);

  const categories = [
    { id: 'all', label: 'All Artifacts' },
    { id: 'relic', label: 'Relics' },
    { id: 'companion', label: 'Companions' },
    { id: 'theme', label: 'Themes' },
    { id: 'badge', label: 'Badges' },
  ];

  const filteredItems = inventory.filter((item) => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  const handleToggleEquip = async (item) => {
    setEquippingKey(item.item_key);
    sound.playClick();
    try {
      await onEquipItem(item.item_key, item.is_equipped);
      sound.playQuestComplete();
    } finally {
      setEquippingKey(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative z-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase">
            — OPERATIVE ARMORY // VAULT
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-orbitron">
            Inventory <span className="text-amber-400">Vault</span>
          </h1>
          <p className="text-sm font-rajdhani font-semibold text-slate-300">
            Equip acquired cyber artifacts, themes, and badges to calibrate your RPG loadout.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onNavigateTab('shop');
          }}
          className="px-5 py-2.5 rounded-sm bg-[#0D1117]/95 border border-amber-500/30 shadow-hud-obsidian text-amber-400 font-mono font-bold text-xs uppercase hover:bg-[#12161F] hover:border-amber-400 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Browse Shop Catalog</span>
        </button>
      </div>

      {/* Category Tabs */}
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

      {/* Inventory Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center p-8 rounded-md bg-[#0D1117]/95 backdrop-blur-2xl border border-dashed border-white/10 shadow-hud-obsidian">
          <Package className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="font-orbitron font-bold text-lg text-white">No Artifacts in this Category</h3>
          <p className="text-sm font-rajdhani font-semibold text-slate-400 mt-1">
            Visit the marketplace to unlock new gear and themes using your Gold.
          </p>
          <button
            onClick={() => {
              sound.playClick();
              onNavigateTab('shop');
            }}
            className="mt-4 px-6 py-2.5 rounded-xs bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-hud-amber transition-all cursor-pointer"
          >
            Go to Shop ➔
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const Icon = ICON_MAP[item.icon] || Package;
            const isEquipped = item.is_equipped;
            const isEquipping = equippingKey === item.item_key;

            return (
              <motion.div
                key={item.inventory_id}
                whileHover={{ y: -3 }}
                className={`p-5 flex flex-col justify-between rounded-md border backdrop-blur-2xl transition-all duration-300 hud-bevel-tl shadow-hud-obsidian ${
                  isEquipped
                    ? 'bg-[#161B26] border-emerald-500/60 shadow-hud-emerald ring-1 ring-emerald-500/30'
                    : 'bg-[#0D1117]/95 border-white/10 hover:border-amber-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-xs bg-[#12161F] text-slate-400 uppercase tracking-wider border border-white/5">
                      {item.category}
                    </span>
                    {isEquipped && (
                      <span className="flex items-center gap-1 text-[9px] font-mono font-black px-2 py-0.5 rounded-xs bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">
                        <Check className="w-3 h-3 text-emerald-400" />
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <div className="w-14 h-14 rounded-xs bg-[#12161F] border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 mx-auto shadow-inner">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="font-orbitron font-bold text-sm text-white text-center leading-snug mb-1">
                    {item.name}
                  </h3>

                  <p className="text-xs font-rajdhani font-semibold text-slate-400 text-center leading-snug mb-3">
                    {item.description}
                  </p>

                  {item.attribute_bonus && Object.keys(item.attribute_bonus).length > 0 && (
                    <div className="p-2 rounded-xs bg-[#12161F] border border-white/5 text-center text-[11px] font-mono font-bold text-amber-400 mb-3">
                      {Object.entries(item.attribute_bonus).map(([k, v]) => (
                        <span key={k}>+{v} {k.toUpperCase()} </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10">
                  <button
                    onClick={() => handleToggleEquip(item)}
                    disabled={isEquipping}
                    className={`w-full py-2 px-4 rounded-xs font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      isEquipped
                        ? 'bg-[#12161F] hover:bg-[#161B26] text-slate-300 border border-white/10'
                        : 'bg-amber-500 hover:bg-amber-400 text-black shadow-hud-amber active:scale-95'
                    }`}
                  >
                    {isEquipped ? 'Unequip' : 'Equip Gear'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
