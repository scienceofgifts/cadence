import React from 'react';
import { TaskProvider, useTask } from './context/TaskContext';
import { Header } from './components/Header';
import { CinematicHero } from './components/CinematicHero';
import { DashboardWidgets } from './components/DashboardWidgets';
import { QuickLinks } from './components/QuickLinks';
import { CategoryFilter } from './components/CategoryFilter';
import { QuickAdd } from './components/QuickAdd';
import { TaskList } from './components/TaskList';
import { WeekView } from './components/WeekView';
import { ProjectsView } from './components/ProjectsView';
import { HabitsView } from './components/HabitsView';
import { WorkflowsView } from './components/WorkflowsView';
import { WhatsNextWidget } from './components/WhatsNextWidget';
import { TaskDetailDrawer } from './components/TaskDetailDrawer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { SettingsModal } from './components/SettingsModal';
import { FocusModeModal } from './components/FocusModeModal';
import { CompletionHandoffModal } from './components/CompletionHandoffModal';
import { BackgroundLayer } from './components/BackgroundLayer';
import { MicroToastContainer } from './components/MicroToast';

const DashboardContent: React.FC = () => {
  const { activeView, settings } = useTask();
  const isScenic = settings.background.preset !== 'clean' && settings.background.preset !== 'paper';

  return (
    <div
      data-typography={settings.typography || 'modern'}
      data-color-theme={settings.colorTheme || 'blue'}
      className={`relative min-h-screen flex flex-col w-full max-w-full overflow-x-hidden bg-theme-surface text-theme-primary dark:text-slate-100 transition-colors ${isScenic ? 'has-scenic-bg' : 'has-clean-bg'}`}
    >
      
      {/* Background Canvas Layer */}
      <BackgroundLayer />

      {/* Top Header Navigation */}
      <Header />

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeView === 'today' && (
          <div className="animate-in fade-in duration-200">
            <CinematicHero />
            <WhatsNextWidget />
            <DashboardWidgets />
            <QuickLinks />
            <CategoryFilter />
            <QuickAdd />
            <TaskList />
          </div>
        )}

        {activeView === 'week' && (
          <div className="animate-in fade-in duration-200">
            <WeekView />
          </div>
        )}

        {activeView === 'projects' && (
          <div className="animate-in fade-in duration-200">
            <ProjectsView />
          </div>
        )}

        {activeView === 'habits' && (
          <div className="animate-in fade-in duration-200">
            <HabitsView />
          </div>
        )}

        {activeView === 'workflows' && (
          <div className="animate-in fade-in duration-200">
            <WorkflowsView />
          </div>
        )}
      </main>

      {/* Editorial Quiet Footer */}
      <footer className="relative z-10 py-6 border-t border-[#1B3D5F]/10 dark:border-slate-800/80 text-center text-xs text-bg-muted font-editorial">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Cadence Personal Workspace</span>
          <div className="flex items-center gap-3">
            <span>Website / Shop · YouTube · House · Reading · Workout · Other</span>
          </div>
        </div>
      </footer>

      {/* Modals & Focus Overlays */}
      <TaskDetailDrawer />
      <GlobalSearchModal />
      <SettingsModal />
      <FocusModeModal />
      <CompletionHandoffModal />
      <MicroToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <TaskProvider>
      <DashboardContent />
    </TaskProvider>
  );
}
