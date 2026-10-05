import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import { BackgroundPreset, AmbientEnvironment, TypographyPreset, ColorTheme } from '../types';
import {
  X,
  Volume2,
  Moon,
  Sun,
  Download,
  Upload,
  RotateCcw,
  User,
  Sparkles,
  Sliders,
  Image as ImageIcon,
  LayoutGrid,
  Radio,
  Brain,
  Feather,
  BookOpen,
  Type,
  Palette,
} from 'lucide-react';
import { audioFX } from '../utils/audio';
import { saveCustomBackground } from '../utils/assetStorage';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    settings,
    updateSettings,
    updateBackground,
    updateWidgets,
    updateAmbient,
    scenes,
    activateScene,
    resetToDefaults,
    exportData,
    importData,
    triggerToast,
  } = useTask();

  const [activeTab, setActiveTab] = useState<'general' | 'background' | 'widgets' | 'scenes'>('general');
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);

  if (!isSettingsOpen) return null;

  const handleTestAudio = () => {
    audioFX.playComplete(true);
    triggerToast("Audio test played.");
  };

  const handleExportDownload = () => {
    const dataStr = exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cadence-dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    triggerToast("Backup JSON downloaded.");
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;
    const success = importData(importText.trim());
    if (success) {
      setImportText('');
      setShowImport(false);
    }
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { url } = await saveCustomBackground(file);
        updateBackground({ preset: 'custom', customImageUrl: url });
        triggerToast("Custom background saved & applied!");
      } catch (err) {
        console.error("Failed to save background to IndexedDB:", err);
        triggerToast("Failed to upload background image.");
      }
    }
  };

  const bg = settings.background;
  const w = settings.widgets;
  const amb = settings.ambient;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B3D5F]/30 dark:bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsSettingsOpen(false)} />

      <div className="relative w-full max-w-lg bg-white dark:bg-[#142438] rounded-2xl border border-[#1B3D5F]/15 dark:border-slate-800 shadow-2xl p-6 space-y-5 z-10 max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2 text-[#1B3D5F] dark:text-slate-100 font-bold font-display text-base sm:text-lg">
            <Sparkles className="w-4 h-4 text-[#99BFF9]" />
            <span>Workspace Settings</span>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-1 bg-[#FAF9F6] dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
              activeTab === 'general' ? 'bg-white dark:bg-slate-700 text-[#1B3D5F] dark:text-slate-100 shadow-xs' : 'text-slate-500'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('background')}
            className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
              activeTab === 'background' ? 'bg-white dark:bg-slate-700 text-[#1B3D5F] dark:text-slate-100 shadow-xs' : 'text-slate-500'
            }`}
          >
            Appearance
          </button>
          <button
            onClick={() => setActiveTab('widgets')}
            className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
              activeTab === 'widgets' ? 'bg-white dark:bg-slate-700 text-[#1B3D5F] dark:text-slate-100 shadow-xs' : 'text-slate-500'
            }`}
          >
            Widgets
          </button>
          <button
            onClick={() => setActiveTab('scenes')}
            className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
              activeTab === 'scenes' ? 'bg-white dark:bg-slate-700 text-[#1B3D5F] dark:text-slate-100 shadow-xs' : 'text-slate-500'
            }`}
          >
            Scenes & Audio
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
          
          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              
              {/* User Name */}
              <div>
                <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  <User className="w-3.5 h-3.5" />
                  Greeting Name
                </label>
                <input
                  type="text"
                  value={settings.userName}
                  onChange={(e) => updateSettings({ userName: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
                  placeholder="e.g., Dattaraj"
                />
              </div>

              {/* Theme Mode */}
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1.5">
                  Theme Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => updateSettings({ theme: 'light' })}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border font-semibold cursor-pointer ${
                      settings.theme === 'light'
                        ? 'bg-[#1B3D5F] text-white border-[#1B3D5F]'
                        : 'bg-[#FAF9F6] dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Light</span>
                  </button>

                  <button
                    onClick={() => updateSettings({ theme: 'dark' })}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border font-semibold cursor-pointer ${
                      settings.theme === 'dark'
                        ? 'bg-[#1B3D5F] text-white border-[#1B3D5F]'
                        : 'bg-[#FAF9F6] dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark</span>
                  </button>

                  <button
                    onClick={() => updateSettings({ theme: 'system' })}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border font-semibold cursor-pointer ${
                      settings.theme === 'system'
                        ? 'bg-[#1B3D5F] text-white border-[#1B3D5F]'
                        : 'bg-[#FAF9F6] dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200'
                    }`}
                  >
                    <span>System</span>
                  </button>
                </div>
              </div>

              {/* Sound Effects */}
              <div className="flex items-center justify-between p-3 bg-[#FAF9F6] dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-100">
                    <Volume2 className="w-3.5 h-3.5 text-[#99BFF9]" />
                    <span>Acoustic Sound Chimes</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Synthesized marimba tone on task complete</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTestAudio}
                    className="px-2 py-1 text-[10px] font-semibold text-[#28537D] dark:text-[#99BFF9] bg-white dark:bg-slate-700 rounded border border-slate-200 cursor-pointer"
                  >
                    Test
                  </button>
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                    className="w-4 h-4 accent-[#99BFF9] cursor-pointer"
                  />
                </div>
              </div>

              {/* Data Management */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-200">
                  Data Backup & Reset
                </label>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportDownload}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-[#FAF9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 rounded-xl font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                  </button>

                  <button
                    onClick={() => setShowImport(!showImport)}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-[#FAF9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 rounded-xl font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Import JSON</span>
                  </button>
                </div>

                {showImport && (
                  <form onSubmit={handleImportSubmit} className="space-y-2 pt-2">
                    <textarea
                      rows={3}
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      placeholder="Paste backup JSON..."
                      className="w-full p-2 bg-[#FAF9F6] dark:bg-slate-900 border border-slate-200 rounded-xl font-mono text-[11px] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="w-full py-1.5 bg-[#1B3D5F] text-white font-semibold rounded-xl hover:opacity-90 cursor-pointer"
                    >
                      Confirm Import
                    </button>
                  </form>
                )}

                <button
                  onClick={() => {
                    if (window.confirm("Reset all data to default initial state?")) {
                      resetToDefaults();
                    }
                  }}
                  className="w-full flex items-center justify-center gap-1.5 p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default Sample Data</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: BACKGROUNDS & APPEARANCE */}
          {activeTab === 'background' && (
            <div className="space-y-6">
              {/* Color Themes */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
                    <Palette className="w-3.5 h-3.5 text-[#99BFF9]" />
                    <span>Color Theme</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Interface Chrome</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
                  Select a curated color personality for Cadence's interface chrome, controls, and active states.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    {
                      id: 'blue',
                      name: 'Blue',
                      label: 'Cadence Original',
                      desc: 'Calm navy with sky blue & mint accents',
                      swatchBg: '#1B3D5F',
                      swatchAccent: '#99BFF9',
                      swatchSoft: '#C3F3DF',
                    },
                    {
                      id: 'black',
                      name: 'Black',
                      label: 'Pure Monochrome',
                      desc: 'Minimalist black, charcoal & gray tones',
                      swatchBg: '#111111',
                      swatchAccent: '#333333',
                      swatchSoft: '#E5E5E5',
                    },
                    {
                      id: 'forest',
                      name: 'Forest',
                      label: 'Pine & Sage',
                      desc: 'Deep evergreen with soft sage accents',
                      swatchBg: '#183B2B',
                      swatchAccent: '#5DA582',
                      swatchSoft: '#D7EDE2',
                    },
                    {
                      id: 'burgundy',
                      name: 'Burgundy',
                      label: 'Wine & Blush',
                      desc: 'Classic editorial wine with blush accents',
                      swatchBg: '#4A1420',
                      swatchAccent: '#D47A8C',
                      swatchSoft: '#F7DDE2',
                    },
                    {
                      id: 'slate',
                      name: 'Slate',
                      label: 'Charcoal & Steel',
                      desc: 'Modern, restrained slate and cool gray',
                      swatchBg: '#1E293B',
                      swatchAccent: '#64748B',
                      swatchSoft: '#E2E8F0',
                    },
                  ].map((themeOpt) => {
                    const isSelected = (settings.colorTheme || 'blue') === themeOpt.id;
                    return (
                      <button
                        key={themeOpt.id}
                        type="button"
                        onClick={() => updateSettings({ colorTheme: themeOpt.id as ColorTheme })}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-white dark:bg-slate-800 border-[#1B3D5F] dark:border-[#99BFF9] ring-2 ring-[#99BFF9]/30 shadow-xs'
                            : 'bg-[#FAF9F6] dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            {/* Color Swatch Pill */}
                            <div className="flex items-center -space-x-1">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-white shadow-xs"
                                style={{ backgroundColor: themeOpt.swatchBg }}
                              />
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-white shadow-xs"
                                style={{ backgroundColor: themeOpt.swatchAccent }}
                              />
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-white shadow-xs"
                                style={{ backgroundColor: themeOpt.swatchSoft }}
                              />
                            </div>
                            <span className="font-bold text-xs text-[#1B3D5F] dark:text-slate-100">
                              {themeOpt.name}
                            </span>
                          </div>
                          {isSelected && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#1B3D5F] text-white dark:bg-[#99BFF9] dark:text-[#1B3D5F]">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-medium text-slate-700 dark:text-slate-200">
                          {themeOpt.label}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-400">
                          {themeOpt.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Typography Presets */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
                    <Type className="w-3.5 h-3.5 text-[#99BFF9]" />
                    <span>Typography Style</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Display Headings + UI</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                  Choose the overall typographic personality for Cadence headings while keeping UI elements crisp and readable.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    {
                      id: 'modern',
                      name: 'Modern',
                      fonts: 'Plus Jakarta Sans',
                      sample: 'Clean & Contemporary',
                      desc: 'Default clean sans-serif across all elements',
                      fontFamilyDisplay: "'Plus Jakarta Sans', sans-serif",
                    },
                    {
                      id: 'editorial',
                      name: 'Editorial',
                      fonts: 'Cormorant Garamond + Plus Jakarta Sans',
                      sample: 'Sophisticated & Literary',
                      desc: 'Refined serif titles with modern UI',
                      fontFamilyDisplay: "'Cormorant Garamond', Georgia, serif",
                    },
                    {
                      id: 'literary',
                      name: 'Literary',
                      fonts: 'Lora + Plus Jakarta Sans',
                      sample: 'Warm Bookish Prose',
                      desc: 'Warm, readable editorial book style',
                      fontFamilyDisplay: "'Lora', Georgia, serif",
                    },
                    {
                      id: 'classic',
                      name: 'Classic',
                      fonts: 'Newsreader + Plus Jakarta Sans',
                      sample: 'Traditional Publishing',
                      desc: 'Classic editorial typography style',
                      fontFamilyDisplay: "'Newsreader', Georgia, serif",
                    },
                  ].map((preset) => {
                    const isSelected = (settings.typography || 'modern') === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => updateSettings({ typography: preset.id as TypographyPreset })}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-white dark:bg-slate-800 border-[#1B3D5F] dark:border-[#99BFF9] ring-2 ring-[#99BFF9]/30 shadow-xs'
                            : 'bg-[#FAF9F6] dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#1B3D5F] dark:text-slate-100">
                            {preset.name}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#1B3D5F] text-white dark:bg-[#99BFF9] dark:text-[#1B3D5F]">
                              Active
                            </span>
                          )}
                        </div>
                        <div
                          className="text-base my-1 text-[#1B3D5F] dark:text-slate-100"
                          style={{ fontFamily: preset.fontFamilyDisplay }}
                        >
                          {preset.sample}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-400 font-mono">
                          {preset.fonts}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Workspace Canvas Presets
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'clean', label: 'Clean Canvas' },
                    { id: 'paper', label: 'Warm Paper' },
                    { id: 'soft-blue', label: 'Soft Blue' },
                    { id: 'soft-mint', label: 'Soft Mint' },
                    { id: 'blue-mint', label: 'Brand Gradient' },
                    { id: 'dark-navy', label: 'Dark Navy' },
                    { id: 'neutral-gradient', label: 'Neutral Radial' },
                    { id: 'misty-lake', label: 'Misty Lake' },
                    { id: 'sunlit-desk', label: 'Sunlit Desk' },
                    { id: 'nordic-forest', label: 'Nordic Forest' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => updateBackground({ preset: p.id as BackgroundPreset })}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        bg.preset === p.id
                          ? 'bg-[#1B3D5F] text-white border-[#1B3D5F] shadow-xs'
                          : 'bg-[#FAF9F6] dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-[#99BFF9]'
                      }`}
                    >
                      <span className="font-semibold block">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Image Upload or URL */}
              <div className="p-3 bg-[#FAF9F6] dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-2">
                <label className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-100">
                  <ImageIcon className="w-3.5 h-3.5 text-[#99BFF9]" />
                  Custom Image Background
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                    id="bg-file-upload"
                  />
                  <label
                    htmlFor="bg-file-upload"
                    className="px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 rounded-lg font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    Upload Local File
                  </label>

                  <input
                    type="text"
                    value={bg.customImageUrl || ''}
                    onChange={(e) =>
                      updateBackground({ preset: 'custom', customImageUrl: e.target.value })
                    }
                    placeholder="Or paste Image URL..."
                    className="flex-1 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              {/* Sliders: Opacity, Overlay, Blur */}
              <div className="space-y-3 p-3 bg-[#FAF9F6] dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700">
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    <span>Background Opacity</span>
                    <span className="font-mono">{Math.round(bg.opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={bg.opacity}
                    onChange={(e) => updateBackground({ opacity: parseFloat(e.target.value) })}
                    className="w-full accent-[#99BFF9] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    <span>Overlay Strength</span>
                    <span className="font-mono">{Math.round(bg.overlayStrength * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.9"
                    step="0.05"
                    value={bg.overlayStrength}
                    onChange={(e) => updateBackground({ overlayStrength: parseFloat(e.target.value) })}
                    className="w-full accent-[#99BFF9] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    <span>Background Blur</span>
                    <span className="font-mono">{bg.blurPx}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={bg.blurPx}
                    onChange={(e) => updateBackground({ blurPx: parseInt(e.target.value, 10) })}
                    className="w-full accent-[#99BFF9] cursor-pointer"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: DASHBOARD WIDGETS */}
          {activeTab === 'widgets' && (
            <div className="space-y-3">
              <p className="text-slate-500 font-editorial italic">
                Choose which personal widgets appear on your main dashboard:
              </p>

              {[
                { id: 'focusToday', label: 'Focus Today Counter', desc: 'Cumulative focus time today' },
                { id: 'pomodoros', label: 'Pomodoro Sessions', desc: 'Completed pomodoro sessions' },
                { id: 'dailyIntention', label: 'Daily Intention Prompt', desc: 'Single focus sentence' },
                { id: 'quickNote', label: 'Quick Scratchpad', desc: 'Temporary thought note area' },
                { id: 'clock', label: 'Local Live Clock', desc: 'Current time & date display' },
                { id: 'currentFocus', label: 'Current Focus Task', desc: 'Active timer task banner' },
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-[#FAF9F6] dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-800"
                >
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-100">{item.label}</div>
                    <div className="text-[11px] text-slate-400">{item.desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(w[item.id as keyof typeof w])}
                    onChange={(e) => updateWidgets({ [item.id]: e.target.checked })}
                    className="w-4 h-4 accent-[#99BFF9] cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: SCENES & AMBIENCE */}
          {activeTab === 'scenes' && (
            <div className="space-y-4">
              
              {/* One-click Scenes */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  One-Click Workspace Scenes
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {scenes.map((sc) => (
                    <button
                      key={sc.id}
                      onClick={() => activateScene(sc.id)}
                      className="p-3 bg-[#FAF9F6] dark:bg-slate-800 hover:bg-[#99BFF9]/20 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-all cursor-pointer group"
                    >
                      <div className="font-bold text-[#1B3D5F] dark:text-slate-100 group-hover:text-[#28537D]">
                        {sc.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                        {sc.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ambient Audio Generator */}
              <div className="p-3 bg-[#FAF9F6] dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-100">
                  <span className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-[#99BFF9]" />
                    Ambient Audio Generator
                  </span>
                  <button
                    onClick={() => updateAmbient({ isPlaying: !amb.isPlaying })}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg cursor-pointer transition-colors ${
                      amb.isPlaying ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {amb.isPlaying ? 'Playing' : 'Paused'}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {[
                    { id: 'silence', label: 'Silence' },
                    { id: 'rain', label: 'Gentle Rain' },
                    { id: 'cafe', label: 'Café Murmur' },
                    { id: 'fireplace', label: 'Fireplace' },
                    { id: 'forest', label: 'Pine Forest' },
                    { id: 'ocean', label: 'Ocean Swell' },
                    { id: 'white-noise', label: 'White Noise' },
                  ].map((a) => (
                    <button
                      key={a.id}
                      onClick={() =>
                        updateAmbient({ environment: a.id as AmbientEnvironment, isPlaying: a.id !== 'silence' })
                      }
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer font-medium ${
                        amb.environment === a.id
                          ? 'bg-[#1B3D5F] text-white border-[#1B3D5F]'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200'
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    <span>Volume</span>
                    <span>{Math.round(amb.volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={amb.volume}
                    onChange={(e) => updateAmbient({ volume: parseFloat(e.target.value) })}
                    className="w-full accent-[#99BFF9] cursor-pointer"
                  />
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
