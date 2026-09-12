import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from './services/api';
import { sound } from './services/sound';

import Navbar from './components/common/Navbar';
import AtmosphericBackground from './components/common/AtmosphericBackground';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import QuestsPage from './pages/QuestsPage';
import CharacterPage from './pages/CharacterPage';
import ShopPage from './pages/ShopPage';
import InventoryPage from './pages/InventoryPage';

import AuthModal from './components/modals/AuthModal';
import QuestModal from './components/modals/QuestModal';
import LevelUpModal from './components/modals/LevelUpModal';

export default function App() {
  const [user, setUser] = useState(null);
  const [character, setCharacter] = useState(null);
  const [streak, setStreak] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [shopItems, setShopItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);

  const [activeTab, setActiveTab] = useState('landing');
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Modals
  const [authModalState, setAuthModalState] = useState({ isOpen: false, mode: 'login' });
  const [questModalState, setQuestModalState] = useState({ isOpen: false, editingTask: null });
  const [levelUpModalState, setLevelUpModalState] = useState({ isOpen: false, data: null });

  // Floating HUD Toast
  const [hudToast, setHudToast] = useState(null);

  const showHudToast = (title, subtitle, type = 'success') => {
    setHudToast({ title, subtitle, type });
    setTimeout(() => {
      setHudToast(null);
    }, 4000);
  };

  // Initial session check
  useEffect(() => {
    async function checkAuth() {
      try {
        if (api.token) {
          const data = await api.getMe();
          setUser(data.user);
          setCharacter(data.character);
          setActiveTab('dashboard');
          await reloadAllUserData();
        }
      } catch (err) {
        console.warn('Session expired or not logged in:', err.message);
        api.setToken(null);
        setUser(null);
        setCharacter(null);
        setActiveTab('landing');
      } finally {
        setLoadingInitial(false);
      }
    }
    checkAuth();
  }, []);

  const reloadAllUserData = async () => {
    try {
      const [dash, tasksRes, shopRes, invRes, charRes] = await Promise.all([
        api.getDashboardStats().catch(() => null),
        api.getTasks().catch(() => ({ tasks: [] })),
        api.getShopItems().catch(() => ({ items: [] })),
        api.getInventory().catch(() => ({ inventory: [] })),
        api.getCharacter().catch(() => null),
      ]);

      if (dash) {
        setDashboardData(dash);
        setStreak(dash.streak);
        if (dash.character) setCharacter(dash.character);
      }
      if (tasksRes?.tasks) setTasks(tasksRes.tasks);
      if (shopRes?.items) setShopItems(shopRes.items);
      if (invRes?.inventory) setInventory(invRes.inventory);
      if (charRes?.character) setCharacter(charRes.character);
    } catch (err) {
      console.error('Failed to load user data:', err);
    }
  };

  // Auth actions
  const handleAuthSuccess = async (mode, credentials) => {
    let res;
    if (mode === 'login') {
      res = await api.login(credentials.emailOrUsername, credentials.password);
    } else {
      res = await api.register(
        credentials.email,
        credentials.username,
        credentials.password,
        credentials.avatar_class
      );
    }

    setUser(res.user);
    setCharacter(res.character);
    setActiveTab('dashboard');
    showHudToast('Welcome Adventurer!', `Logged in as ${res.user.username}`);
    await reloadAllUserData();
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    setCharacter(null);
    setTasks([]);
    setInventory([]);
    setDashboardData(null);
    setActiveTab('landing');
    showHudToast('Session Ended', 'Logged out safely.');
  };

  // Quest Actions
  const handleSaveQuest = async (questData) => {
    if (questModalState.editingTask) {
      await api.updateTask(questModalState.editingTask.id, questData);
      showHudToast('Quest Updated', questData.title);
    } else {
      await api.createTask(questData);
      showHudToast('Quest Deployed', `+${questData.xp_reward || 80} XP potential`);
    }
    await reloadAllUserData();
  };

  const handleDeleteQuest = async (id) => {
    if (!window.confirm('Are you sure you want to abandon this quest?')) return;
    sound.playClick();
    await api.deleteTask(id);
    showHudToast('Quest Abandoned', 'Removed from logbook');
    await reloadAllUserData();
  };

  const handleCompleteQuest = async (id) => {
    try {
      const res = await api.completeTask(id);
      
      // Update character immediately in state
      if (res.character) setCharacter(res.character);
      if (res.streak) setStreak(res.streak);

      // Check level-up
      if (res.levelUp && res.levelUp.leveledUp) {
        setLevelUpModalState({
          isOpen: true,
          data: res.levelUp,
        });
      } else {
        showHudToast(
          'Quest Completed!',
          `+${res.rewards.xp} XP • +${res.rewards.gold} Gold • +${res.rewards.attributeAmount} ${res.rewards.attribute}`
        );
      }

      await reloadAllUserData();
    } catch (err) {
      alert(err.message || 'Failed to complete quest.');
    }
  };

  // Character Class Switch
  const handleChangeClass = async (clsId) => {
    const res = await api.updateClass(clsId);
    setCharacter(res.character);
    showHudToast('Archetype Changed', `Now specialized as ${clsId.replace('_', ' ')}`);
  };

  // Shop & Inventory
  const handleBuyItem = async (item_key) => {
    const res = await api.buyItem(item_key);
    setCharacter(res.character);
    showHudToast('Artifact Acquired!', res.item.name);
    await reloadAllUserData();
  };

  const handleEquipItem = async (item_key, isEquipped) => {
    const res = await api.equipItem(item_key, isEquipped);
    setCharacter(res.character);
    showHudToast(isEquipped ? 'Unequipped' : 'Equipped Gear', res.message);
    await reloadAllUserData();
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-[#06080C] flex flex-col items-center justify-center text-center p-4">
        <div className="w-14 h-14 rounded-sm bg-[#12161F] border border-amber-500/50 flex items-center justify-center animate-pulse mb-4 shadow-lg shadow-amber-500/10">
          <span className="font-orbitron font-black text-xl text-amber-400">DA</span>
        </div>
        <h2 className="font-orbitron font-bold text-lg text-slate-100 tracking-widest uppercase">
          Initializing Neural Matrix...
        </h2>
        <p className="text-slate-400 font-mono text-xs mt-1">Connecting to Life RPG PostgreSQL Engine</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative text-slate-100 bg-transparent">
      {/* Immersive Theme-Reactive 3D Atmospheric Background */}
      <AtmosphericBackground />

      {/* Navigation */}
      <Navbar
        user={user}
        character={character}
        streak={streak}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onOpenAuth={(mode) => setAuthModalState({ isOpen: true, mode })}
      />

      {/* Floating HUD Toast Notification */}
      <AnimatePresence>
        {hudToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-4 sm:right-8 z-50 p-3.5 rounded-sm bg-[#0D1117]/95 backdrop-blur-2xl border border-amber-500/50 shadow-2xl shadow-black text-left max-w-sm"
          >
            <div className="font-mono font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <span>◆</span> {hudToast.title}
            </div>
            <div className="text-xs font-mono font-medium text-slate-300 mt-1">
              {hudToast.subtitle}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 pb-16 relative z-10">
        {(!user || activeTab === 'landing') && (
          <LandingPage
            onOpenAuth={(mode) => setAuthModalState({ isOpen: true, mode })}
          />
        )}

        {user && activeTab === 'dashboard' && (
          <Dashboard
            user={user}
            character={character}
            streak={streak}
            dashboardData={dashboardData}
            onCompleteQuest={handleCompleteQuest}
            onOpenCreateQuest={() => setQuestModalState({ isOpen: true, editingTask: null })}
            onNavigateTab={setActiveTab}
          />
        )}

        {user && activeTab === 'quests' && (
          <QuestsPage
            tasks={tasks}
            character={character}
            streak={streak}
            dashboardData={dashboardData}
            onCompleteQuest={handleCompleteQuest}
            onOpenCreateQuest={() => setQuestModalState({ isOpen: true, editingTask: null })}
            onOpenEditQuest={(task) => setQuestModalState({ isOpen: true, editingTask: task })}
            onDeleteQuest={handleDeleteQuest}
          />
        )}

        {user && activeTab === 'character' && (
          <CharacterPage
            user={user}
            character={character}
            streak={streak}
            onChangeClass={handleChangeClass}
            onAvatarUpdated={(updatedChar) => {
              setCharacter(updatedChar);
              reloadAllUserData();
            }}
            onNavigateTab={setActiveTab}
          />
        )}

        {user && activeTab === 'shop' && (
          <ShopPage
            shopItems={shopItems}
            character={character}
            onBuyItem={handleBuyItem}
            onNavigateTab={setActiveTab}
          />
        )}

        {user && activeTab === 'inventory' && (
          <InventoryPage
            inventory={inventory}
            character={character}
            onEquipItem={handleEquipItem}
            onNavigateTab={setActiveTab}
          />
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={authModalState.isOpen}
        initialMode={authModalState.mode}
        onClose={() => setAuthModalState({ isOpen: false, mode: 'login' })}
        onAuthSuccess={handleAuthSuccess}
      />

      <QuestModal
        isOpen={questModalState.isOpen}
        editingTask={questModalState.editingTask}
        onClose={() => setQuestModalState({ isOpen: false, editingTask: null })}
        onSave={handleSaveQuest}
      />

      <LevelUpModal
        isOpen={levelUpModalState.isOpen}
        levelUpData={levelUpModalState.data}
        character={character}
        onClose={() => setLevelUpModalState({ isOpen: false, data: null })}
      />

      {/* Global Footer (shown on other subpages if needed) */}
      {activeTab !== 'dashboard' && activeTab !== 'landing' && (
        <footer className="py-6 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="py-3 px-5 sm:px-6 rounded bg-[#0D1117]/90 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-orbitron font-bold text-amber-400">LIFE RPG</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">The Daily Ascension HUD</span>
            </div>
            <div className="font-cinzel text-sm text-amber-400/90 font-semibold tracking-wider">
              "Discipline Today. Ascendance Tomorrow."
            </div>
            <div className="text-slate-500 text-[11px]">
              Engine: PostgreSQL • Three.js • React
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
