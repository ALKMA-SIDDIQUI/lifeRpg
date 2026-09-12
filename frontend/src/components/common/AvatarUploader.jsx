import React, { useState, useRef } from 'react';
import { Camera, Trash2, Upload, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import Avatar from './Avatar';
import { sound } from '../../services/sound';
import { api } from '../../services/api';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export default function AvatarUploader({ character, onAvatarUpdated }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    setSuccessMsg('');

    // 1. File Type Validation
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setErrorMsg('Invalid file format. Please choose a JPG, PNG, or WEBP image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // 2. File Size Validation
    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg(`File size exceeds 2MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please choose a smaller image.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // 3. Create local preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target.result);
      setSelectedFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    sound.playClick();

    try {
      const res = await api.uploadAvatar(selectedFile);
      sound.playQuestComplete();
      setSuccessMsg('Profile image successfully updated!');
      setPreviewUrl(null);
      setSelectedFile(null);
      if (onAvatarUpdated) {
        onAvatarUpdated(res.character);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!character?.avatar_url && !previewUrl) return;

    if (previewUrl && !selectedFile) {
      setPreviewUrl(null);
      return;
    }

    if (!window.confirm('Are you sure you want to remove your custom profile image?')) {
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    sound.playClick();

    try {
      const res = await api.removeAvatar();
      sound.playClick();
      setPreviewUrl(null);
      setSelectedFile(null);
      setSuccessMsg('Profile image removed.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (onAvatarUpdated) {
        onAvatarUpdated(res.character);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to remove image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPreview = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setErrorMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Construct temporary character with preview URL if active
  const displayCharacter = previewUrl
    ? { ...character, avatar_url: previewUrl }
    : character;

  const hasCustomAvatar = Boolean(character?.avatar_url);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-white/60 dark:bg-black/30 border border-white/60 dark:border-white/10 shadow-sm">
      {/* Avatar Circular Preview */}
      <div className="relative group flex-shrink-0">
        <Avatar
          character={displayCharacter}
          size="2xl"
          className="shadow-xl ring-2 ring-sky-400/40 dark:ring-cyber-cyan/40"
        />

        {/* Quick Camera Action Overlay */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Choose photo"
          aria-label="Choose photo"
          className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-orbitron font-bold"
        >
          <Camera className="w-6 h-6 text-sky-400 dark:text-cyber-cyan mb-1" />
          <span>Browse</span>
        </button>
      </div>

      {/* Upload Details & Actions */}
      <div className="flex-1 text-center sm:text-left space-y-3 font-rajdhani">
        <div>
          <h4 className="font-orbitron font-bold text-lg text-[#0B132B] dark:text-white">
            Character Profile Image
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            JPG, PNG, or WEBP up to 2MB. Your avatar will appear on your character profile, dashboard, and navbar.
          </p>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload profile image"
        />

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
          {!selectedFile ? (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-white dark:from-cyber-cyan dark:to-cyan-400 dark:text-black font-orbitron font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-sky-400 active:scale-95 disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{hasCustomAvatar ? 'Replace Image' : 'Upload Image'}</span>
              </button>

              {hasCustomAvatar && (
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-white/80 dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-500/20 border border-slate-200 dark:border-white/10 hover:border-rose-300 dark:hover:border-rose-500/50 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 font-orbitron font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 focus:outline-none active:scale-95 disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleUpload}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-orbitron font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 focus:outline-none active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5" />
                )}
                <span>Save New Avatar</span>
              </button>

              <button
                type="button"
                onClick={handleCancelPreview}
                disabled={loading}
                className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-orbitron font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="flex items-center gap-2 text-xs text-rose-500 dark:text-rose-400 font-bold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Feedback */}
        {successMsg && (
          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
