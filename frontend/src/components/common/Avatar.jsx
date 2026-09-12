import React, { useState } from 'react';

const SIZE_CLASSES = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-24 h-24 text-3xl',
  '2xl': 'w-32 h-32 text-4xl',
};

const CLASS_EMBLEMS = {
  cyber_knight: '🛡️',
  neon_sorcerer: '🔮',
  quantum_rogue: '⚡',
};

export default function Avatar({
  user = null,
  character = null,
  size = 'md',
  className = '',
  ring = true,
  interactive = false,
  onClick = null,
}) {
  const [imgError, setImgError] = useState(false);

  const avatarUrl = character?.avatar_url || user?.avatar_url;
  const username = character?.name || user?.username || 'Hero';
  const avatarClass = character?.avatar_class || 'cyber_knight';
  const emblem = CLASS_EMBLEMS[avatarClass] || '⚔️';
  const initial = username.charAt(0).toUpperCase();

  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const ringClass = ring
    ? 'ring-2 ring-sky-400 dark:ring-cyber-cyan/60 shadow-sm dark:shadow-glow-cyan-sm'
    : 'border border-slate-200 dark:border-cyber-border';

  const isClickable = interactive || Boolean(onClick);

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-shrink-0 items-center justify-center rounded-full overflow-hidden bg-gradient-to-tr from-sky-100 to-indigo-100 dark:from-cyber-card dark:to-cyber-border text-slate-800 dark:text-white select-none ${sizeClass} ${ringClass} ${
        isClickable ? 'cursor-pointer hover:scale-105 transition-transform' : ''
      } ${className}`}
      title={username}
    >
      {avatarUrl && !imgError ? (
        <img
          src={avatarUrl}
          alt={`${username}'s avatar`}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center font-orbitron font-black bg-gradient-to-br from-sky-400/15 to-purple-400/15 dark:from-cyber-cyan/20 dark:to-cyber-purple/20 text-sky-600 dark:text-cyber-cyan">
          <span className="leading-none">{size === 'xs' || size === 'sm' ? initial : emblem}</span>
        </div>
      )}
    </div>
  );
}
