import React, { useState } from 'react';
import { 
  Shield, 
  Flame, 
  Coins, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  LogOut, 
  User, 
  Compass, 
  CheckSquare, 
  ShoppingBag, 
  Package,
  ChevronDown
} from 'lucide-react';
import { sound } from '../../services/sound';
import Avatar from './Avatar';

export default function Navbar({
  user,
  character,
  streak,
  activeTab,
  setActiveTab,
  onLogout,
  onOpenAuth,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sound.isSoundEnabled());

  const toggleSound = () => {
    const newState = sound.toggleSound();
    setSoundEnabled(newState);
    if (newState) sound.playClick();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'quests', label: 'Quests', icon: CheckSquare },
    { id: 'character', label: 'Character', icon: User },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'inventory', label: 'Inventory', icon: Package },
  ];

  return (
    <div className="sticky top-3 z-40 w-full px-3 sm:px-6 lg:px-8 pointer-events-none">
      <nav className="max-w-7xl mx-auto bg-[#0D1117]/95 backdrop-blur-2xl border border-white/10 border-t-amber-500/30 shadow-2xl shadow-black/90 rounded-md px-4 sm:px-6 py-2 pointer-events-auto transition-all duration-300">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo: The Daily Ascension */}
          <div 
            onClick={() => {
              sound.playClick();
              setActiveTab(user ? 'dashboard' : 'landing');
            }}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            {/* Obsidian Amber Runic Gem */}
            <div className="w-8 h-8 flex-shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center bg-[#12161F] border border-amber-500/40 rounded-sm shadow-inner">
              <svg viewBox="0 0 40 45" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-6 drop-shadow-sm">
                <polygon points="20,2 38,18 20,43 2,18" fill="url(#navGemGrad)" />
                <polygon points="20,2 38,18 20,24" fill="#FBBF24" opacity="0.85" />
                <polygon points="20,2 2,18 20,24" fill="#F59E0B" opacity="0.8" />
                <polygon points="2,18 20,24 20,43" fill="#D97706" opacity="0.9" />
                <polygon points="38,18 20,24 20,43" fill="#B45309" opacity="0.9" />
                <defs>
                  <linearGradient id="navGemGrad" x1="2" y1="2" x2="38" y2="43" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FBBF24" />
                    <stop offset="0.5" stopColor="#F59E0B" />
                    <stop offset="1" stopColor="#D97706" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-orbitron font-black text-base tracking-wider text-slate-100 block leading-none">
                  LIFE <span className="text-amber-400">RPG</span>
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 leading-none">
                  HUD
                </span>
              </div>
              <span className="hidden sm:block text-[8px] font-mono tracking-widest text-slate-400 uppercase font-bold mt-0.5">
                The Daily Ascension
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          {user ? (
            <div className="hidden md:flex items-center gap-1 p-0.5 bg-[#090C10]/80 rounded border border-white/5">
              {navItems.map((item, idx) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      sound.playClick();
                      setActiveTab(item.id);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-mono font-bold tracking-wide transition-all duration-200 border ${
                      isActive
                        ? 'bg-[#161B26] text-amber-400 border-amber-500/50 shadow-sm shadow-amber-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#12161F] border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-6 font-mono font-bold text-xs uppercase tracking-wider text-slate-400">
              <a href="#how-it-works" className="hover:text-amber-400 transition-colors">How It Works</a>
              <a href="#progression" className="hover:text-amber-400 transition-colors">Progression</a>
              <a href="#quests" className="hover:text-amber-400 transition-colors">Quests</a>
              <a href="#rewards" className="hover:text-amber-400 transition-colors">Rewards</a>
            </div>
          )}

          {/* Right Status Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">

            {user ? (
              <div className="relative">
                {/* User Profile Pill */}
                <div
                  onClick={() => {
                    sound.playClick();
                    setUserDropdownOpen(!userDropdownOpen);
                  }}
                  className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded bg-[#12161F] hover:bg-[#161B26] border border-white/10 hover:border-amber-500/40 shadow-sm cursor-pointer transition-all"
                  title="User Menu"
                >
                  <div className="w-6 h-6 rounded overflow-hidden bg-gradient-to-tr from-amber-400 to-amber-600 p-[1px] flex-shrink-0">
                    <div className="w-full h-full rounded overflow-hidden bg-[#090C10] flex items-center justify-center">
                      {character?.avatar_url || user?.avatar_url ? (
                        <img src={character?.avatar_url || user?.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-slate-200 truncate max-w-[80px] sm:max-w-[110px]">
                      {character?.name || user?.username || 'WARRIOR'}
                    </span>
                    <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      LV.{character?.level || 1}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#0D1117] border border-white/10 rounded shadow-2xl py-2 z-50 animate-fadeIn">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setActiveTab('character');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-mono font-bold text-slate-300 hover:bg-[#161B26] hover:text-amber-400 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-amber-400" />
                      <span>Character Hub</span>
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick();
                        toggleSound();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-mono font-bold text-slate-300 hover:bg-[#161B26] hover:text-emerald-400 flex items-center gap-2"
                    >
                      {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                      <span>{soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}</span>
                    </button>
                    <div className="border-t border-white/10 my-1" />
                    <button
                      onClick={() => {
                        sound.playClick();
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-mono font-bold text-rose-400 hover:bg-rose-950/40 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenAuth('login');
                  }}
                  className="px-4 py-1.5 rounded font-mono font-bold text-xs text-slate-300 hover:text-amber-400 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenAuth('register');
                  }}
                  className="px-4 py-1.5 rounded bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-orbitron font-black text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                >
                  Enter
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            {user && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded bg-[#12161F] text-slate-300 border border-white/10"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && user && (
          <div className="md:hidden border-t border-white/10 pt-3 mt-3 pb-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded text-xs font-mono font-bold transition-colors ${
                    isActive
                      ? 'bg-[#161B26] text-amber-400 border border-amber-500/40'
                      : 'text-slate-400 hover:bg-[#12161F]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </nav>
    </div>
  );
}
