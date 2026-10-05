import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AreaId,
  CategoryInfo,
  Project,
  Task,
  ToastMessage,
  UserSettings,
  ViewMode,
  TimerMode,
  TimerStatus,
  TimerPreset,
  Scene,
  BackgroundSettings,
  WidgetVisibility,
  AmbientSettings,
} from '../types';
import { CATEGORIES, getInitialTasks, INITIAL_PROJECTS, INITIAL_SETTINGS } from '../data/initialData';
import { INITIAL_SCENES } from '../data/scenesData';
import { audioFX } from '../utils/audio';
import { ambientSynth } from '../utils/ambientAudio';
import { getTodayString } from '../utils/date';
import { ProjectWorkflow, GeneratedWorkflowStep, WhatsNextState, WorkflowTemplate } from '../types/workflow';
import {
  WORKFLOW_TEMPLATES,
  INITIAL_TEMPLATES,
  GIFT_GUIDE_TEMPLATE,
  generateProjectWorkflow,
  createInitialWWIIGiftGuideWorkflow,
} from '../data/workflowTemplates';

interface TaskContextType {
  tasks: Task[];
  projects: Project[];
  categories: CategoryInfo[];
  settings: UserSettings;
  scenes: Scene[];
  activeArea: AreaId | 'all';
  setActiveArea: (area: AreaId | 'all') => void;
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  activeDetailTaskId: string | null;
  openTaskDetail: (id: string) => void;
  closeTaskDetail: () => void;
  activeDetailProjectId: string | null;
  openProjectDetail: (id: string) => void;
  closeProjectDetail: () => void;
  toasts: ToastMessage[];

  // Workflows & Templates
  templates: WorkflowTemplate[];
  saveWorkflowTemplate: (template: WorkflowTemplate) => void;
  deleteWorkflowTemplate: (templateId: string) => boolean;
  duplicateWorkflowTemplate: (templateId: string) => WorkflowTemplate;
  workflows: ProjectWorkflow[];
  activeWorkflowId: string | null;
  activeWorkflowStepId: string | null;
  completionHandoff: {
    completedStep: GeneratedWorkflowStep;
    nextStep?: GeneratedWorkflowStep;
    nextAfterNextStep?: GeneratedWorkflowStep;
    workflowId: string;
    totalStepsCount?: number;
    completedStepsCount?: number;
  } | null;
  createWorkflowFromTemplate: (templateId: string, projectName: string, itemCount: number, collection: string) => ProjectWorkflow;
  updateWorkflowProject: (workflowId: string, updates: { projectName?: string; collection?: string; itemCount?: number }) => void;
  duplicateWorkflowProject: (workflowId: string) => ProjectWorkflow | null;
  completeWorkflowStep: (stepId: string, workflowId?: string, showHandoffModal?: boolean) => void;
  toggleWorkflowSubtask: (stepId: string, subtaskId: string, workflowId?: string) => void;
  startWorkflowFocus: (stepId: string, workflowId?: string) => void;
  continueToNextWorkflowStep: () => void;
  startNextWorkflowFocus: () => void;
  dismissCompletionHandoff: () => void;
  deleteWorkflow: (workflowId: string) => void;
  resetWorkflowProgress: (workflowId: string) => void;
  setActiveWorkflowId: (workflowId: string | null) => void;
  getActiveWorkflow: () => ProjectWorkflow | null;
  getWhatsNextState: () => WhatsNextState | null;

  // Focus & Timer State
  isFocusModeOpen: boolean;
  activeFocusTaskId: string | null;
  timerMode: TimerMode;
  setTimerMode: (mode: TimerMode) => void;
  timerStatus: TimerStatus;
  timerPreset: TimerPreset;
  remainingSeconds: number;
  stopwatchSeconds: number;
  laps: number[];
  completedPomodorosToday: number;
  totalFocusTodaySeconds: number;
  activeSceneId: string | null;

  // Focus Actions
  startFocusForTask: (taskId?: string, preset?: TimerPreset) => void;
  pauseFocusTimer: () => void;
  resumeFocusTimer: () => void;
  resetFocusTimer: () => void;
  skipFocusSession: () => void;
  finishFocusSession: () => void;
  openFocusMode: (taskId?: string) => void;
  closeFocusMode: () => void;
  addStopwatchLap: () => void;
  setTimerPresetDuration: (preset: TimerPreset, customWorkSec?: number) => void;

  // Customization & Scenes
  activateScene: (sceneId: string) => void;
  updateBackground: (updates: Partial<BackgroundSettings>) => void;
  updateWidgets: (updates: Partial<WidgetVisibility>) => void;
  updateAmbient: (updates: Partial<AmbientSettings>) => void;
  setDailyIntention: (intention: string) => void;
  setQuickNote: (note: string) => void;

  // Task Actions
  toggleTaskComplete: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'order'> & { id?: string }) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (reorderedTasks: Task[]) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  // Project Actions
  addProject: (project: Omit<Project, 'id'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Global Audio Mute
  isMuted: boolean;
  toggleGlobalMute: () => void;

  // Settings & System
  updateSettings: (updates: Partial<UserSettings>) => void;
  resetToDefaults: () => void;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
  triggerToast: (text: string, subtext?: string) => void;
}

const LOCAL_STORAGE_TASKS_KEY = 'cadence_life_dashboard_tasks_v2';
const LOCAL_STORAGE_PROJECTS_KEY = 'cadence_life_dashboard_projects_v2';
const LOCAL_STORAGE_SETTINGS_KEY = 'cadence_life_dashboard_settings_v2';
const LOCAL_STORAGE_FOCUS_STATS_KEY = 'cadence_life_dashboard_focus_v2';
const LOCAL_STORAGE_MUTE_KEY = 'cadence_life_dashboard_mute_v2';
const LOCAL_STORAGE_WORKFLOWS_KEY = 'cadence_project_workflows_v1';
const LOCAL_STORAGE_ACTIVE_WF_KEY = 'cadence_active_workflow_id_v1';
const LOCAL_STORAGE_TEMPLATES_KEY = 'cadence_workflow_templates_v1';

const ENCOURAGING_MICROCOPY = [
  "Nice.",
  "That's done.",
  "One less thing.",
  "Good progress.",
  "Keep going.",
  "That's a wrap.",
  "Crisp execution.",
  "Peace of mind.",
  "Check.",
  "Moving forward.",
];

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_TASKS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to load tasks", e);
    }
    return getInitialTasks();
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to load projects", e);
    }
    return INITIAL_PROJECTS;
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      if (saved) {
        return { ...INITIAL_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    }
    return INITIAL_SETTINGS;
  });

  const [activeArea, setActiveArea] = useState<AreaId | 'all'>('all');
  const [activeView, setActiveView] = useState<ViewMode>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeDetailTaskId, setActiveDetailTaskId] = useState<string | null>(null);
  const [activeDetailProjectId, setActiveDetailProjectId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Focus & Timer State
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  const [activeFocusTaskId, setActiveFocusTaskId] = useState<string | null>(null);
  const [timerMode, setTimerMode] = useState<TimerMode>('pomodoro');
  const [timerStatus, setTimerStatus] = useState<TimerStatus>('idle');
  const [timerPreset, setTimerPreset] = useState<TimerPreset>('25-5');
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);

  const [completedPomodorosToday, setCompletedPomodorosToday] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_FOCUS_STATS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date === getTodayString()) return parsed.pomodoros || 0;
      }
    } catch (e) {}
    return 0;
  });

  const [totalFocusTodaySeconds, setTotalFocusTodaySeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_FOCUS_STATS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date === getTodayString()) return parsed.seconds || 0;
      }
    } catch (e) {}
    return 0;
  });

  const [scenes] = useState<Scene[]>(INITIAL_SCENES);
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null);

  // Guided Workflows State
  const [workflows, setWorkflows] = useState<ProjectWorkflow[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_WORKFLOWS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to load workflows", e);
    }
    return [createInitialWWIIGiftGuideWorkflow()];
  });

  const [activeWorkflowId, setActiveWorkflowIdState] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ACTIVE_WF_KEY);
      if (saved) return saved;
    } catch (e) {}
    return null;
  });

  const [activeWorkflowStepId, setActiveWorkflowStepId] = useState<string | null>(null);

  const [completionHandoff, setCompletionHandoff] = useState<{
    completedStep: GeneratedWorkflowStep;
    nextStep?: GeneratedWorkflowStep;
    nextAfterNextStep?: GeneratedWorkflowStep;
    workflowId: string;
    totalStepsCount?: number;
    completedStepsCount?: number;
  } | null>(null);

  // Sync active workflow ID if not set
  useEffect(() => {
    if (!activeWorkflowId && workflows.length > 0) {
      setActiveWorkflowIdState(workflows[0].id);
    }
  }, [activeWorkflowId, workflows]);

  // Sync workflows to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_WORKFLOWS_KEY, JSON.stringify(workflows));
    } catch (e) {}
  }, [workflows]);

  useEffect(() => {
    try {
      if (activeWorkflowId) {
        localStorage.setItem(LOCAL_STORAGE_ACTIVE_WF_KEY, activeWorkflowId);
      }
    } catch (e) {}
  }, [activeWorkflowId]);

  // Workflow Templates State
  const [templates, setTemplates] = useState<WorkflowTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_TEMPLATES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error("Failed to load workflow templates", e);
    }
    return INITIAL_TEMPLATES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_TEMPLATES_KEY, JSON.stringify(templates));
    } catch (e) {
      console.error("Failed to save templates to localStorage", e);
    }
  }, [templates]);

  // Global Audio Mute
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_MUTE_KEY) === 'true';
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_MUTE_KEY, String(isMuted));
    } catch (e) {}
    audioFX.isMuted = isMuted;
    ambientSynth.setMute(isMuted);
  }, [isMuted]);

  const toggleGlobalMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error("Error saving tasks", e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error("Error saving projects", e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error("Error saving settings", e);
    }

    // Handle HTML theme class
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    // Apply Typography Preset attribute
    document.documentElement.setAttribute('data-typography', settings.typography || 'modern');

    // Apply Color Theme attribute
    document.documentElement.setAttribute('data-color-theme', settings.colorTheme || 'blue');
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_FOCUS_STATS_KEY,
        JSON.stringify({
          date: getTodayString(),
          pomodoros: completedPomodorosToday,
          seconds: totalFocusTodaySeconds,
        })
      );
    } catch (e) {}
  }, [completedPomodorosToday, totalFocusTodaySeconds]);

  // Ambient synth sync
  useEffect(() => {
    if (settings.ambient.isPlaying && settings.ambient.environment !== 'silence') {
      ambientSynth.start(settings.ambient.environment, settings.ambient.volume);
    } else {
      ambientSynth.stop();
    }
    return () => {
      ambientSynth.stop();
    };
  }, [settings.ambient]);

  // Timer Tick Engine
  useEffect(() => {
    if (timerStatus !== 'running' && timerStatus !== 'break') return;

    const interval = setInterval(() => {
      if (timerMode === 'pomodoro' || timerMode === 'countdown') {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            // Timer Session Complete!
            audioFX.playAllDone(settings.soundEnabled);
            setCompletedPomodorosToday((p) => p + 1);

            if (timerStatus === 'running') {
              triggerToast("Focus Session Complete!", "Take a well-deserved short break.");
              setTimerStatus('break');
              return 5 * 60; // 5 min break
            } else {
              triggerToast("Break Complete!", "Ready for the next session?");
              setTimerStatus('idle');
              return 25 * 60;
            }
          }
          return prev - 1;
        });

        if (timerStatus === 'running') {
          setTotalFocusTodaySeconds((s) => s + 1);
          if (activeFocusTaskId) {
            setTasks((prevTasks) =>
              prevTasks.map((t) =>
                t.id === activeFocusTaskId
                  ? { ...t, focusTimeSeconds: (t.focusTimeSeconds || 0) + 1 }
                  : t
              )
            );
          }
        }
      } else if (timerMode === 'stopwatch') {
        setStopwatchSeconds((s) => s + 1);
        setTotalFocusTodaySeconds((s) => s + 1);
        if (activeFocusTaskId) {
          setTasks((prevTasks) =>
            prevTasks.map((t) =>
              t.id === activeFocusTaskId
                ? { ...t, focusTimeSeconds: (t.focusTimeSeconds || 0) + 1 }
                : t
            )
          );
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerStatus, timerMode, activeFocusTaskId, settings.soundEnabled]);

  // Keyboard shortcuts (Cmd+K search, N quick add, F focus mode)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'n' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsQuickAddOpen(true);
      } else if (e.key.toLowerCase() === 'f' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsFocusModeOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerToast = (text: string, subtext?: string) => {
    if (!settings.microcopyEnabled) return;
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev.slice(-2), { id, text, subtext }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  // Timer Control Functions
  const setTimerPresetDuration = (preset: TimerPreset, customWorkSec?: number) => {
    setTimerPreset(preset);
    if (preset === '25-5') {
      setRemainingSeconds(25 * 60);
    } else if (preset === '50-10') {
      setRemainingSeconds(50 * 60);
    } else if (preset === '90-0') {
      setRemainingSeconds(90 * 60);
    } else if (customWorkSec) {
      setRemainingSeconds(customWorkSec);
    }
  };

  const startFocusForTask = (taskId?: string, preset: TimerPreset = '25-5') => {
    setActiveWorkflowStepId(null);
    if (taskId) setActiveFocusTaskId(taskId);
    setTimerPresetDuration(preset);
    setRemainingSeconds(25 * 60);
    setTimerStatus('idle');
    setIsFocusModeOpen(true);
    const taskObj = tasks.find((t) => t.id === taskId);
    triggerToast("Focus Ready", taskObj ? taskObj.title : "Deep work session ready.");
  };

  const pauseFocusTimer = () => setTimerStatus('paused');
  const resumeFocusTimer = () => setTimerStatus('running');

  const resetFocusTimer = () => {
    setTimerStatus('idle');
    setStopwatchSeconds(0);
    setLaps([]);
    if (timerPreset === '25-5') setRemainingSeconds(25 * 60);
    else if (timerPreset === '50-10') setRemainingSeconds(50 * 60);
    else if (timerPreset === '90-0') setRemainingSeconds(90 * 60);
  };

  const skipFocusSession = () => {
    resetFocusTimer();
    triggerToast("Session Skipped");
  };

  const finishFocusSession = () => {
    setCompletedPomodorosToday((p) => p + 1);
    if (activeWorkflowStepId) {
      completeWorkflowStep(activeWorkflowStepId, activeWorkflowId || undefined);
    }
    resetFocusTimer();
    triggerToast("Session Wrapped Up!", "Focus session logged.");
  };

  // Workflow Helper Methods
  const setActiveWorkflowId = (id: string | null) => {
    setActiveWorkflowIdState(id);
  };

  const getActiveWorkflow = (): ProjectWorkflow | null => {
    if (activeWorkflowId) {
      const found = workflows.find((w) => w.id === activeWorkflowId);
      if (found) return found;
    }
    return workflows[0] || null;
  };

  const getWhatsNextState = (): WhatsNextState | null => {
    const wf = getActiveWorkflow();
    if (!wf || wf.generatedSteps.length === 0) return null;

    const totalStepsCount = wf.generatedSteps.length;
    const completedStepsCount = wf.generatedSteps.filter((s) => s.completed).length;

    const currentStep = wf.generatedSteps.find((s) => !s.completed);
    if (!currentStep) {
      return {
        workflowId: wf.id,
        projectName: wf.projectName,
        currentStep: wf.generatedSteps[wf.generatedSteps.length - 1],
        completedInItem: [],
        isComplete: true,
        completedStepsCount,
        totalStepsCount,
      };
    }

    const currentItem = currentStep.itemIndex;
    let completedInItem: string[] = [];
    let justFinishedContext: string | undefined;

    if (currentStep.stageType === 'repeat' && currentItem) {
      completedInItem = wf.generatedSteps
        .filter((s) => s.itemIndex === currentItem && s.completed)
        .map((s) => s.stepTitle.replace(/^(Design|Create|Write)\s+/i, ''));

      if (completedInItem.length === 0) {
        if (currentItem > 1) {
          justFinishedContext = `Product ${currentItem - 1} complete (all steps)`;
        } else {
          justFinishedContext = 'Ready to begin Product 1';
        }
      }
    } else if (currentStep.stageType === 'final') {
      completedInItem = wf.generatedSteps
        .filter((s) => s.stageType === 'final' && s.completed)
        .map((s) => s.stepTitle);

      if (completedInItem.length === 0) {
        justFinishedContext = `All ${wf.itemCount} products complete`;
      }
    }

    const currentIdx = wf.generatedSteps.findIndex((s) => s.id === currentStep.id);
    const nextStep = wf.generatedSteps[currentIdx + 1];

    let nextStepLabel: string | undefined;
    if (nextStep) {
      if (nextStep.stageType === 'repeat' && nextStep.itemIndex) {
        if (nextStep.itemIndex === currentStep.itemIndex) {
          nextStepLabel = nextStep.stepTitle;
        } else {
          nextStepLabel = `Product ${nextStep.itemIndex} · ${nextStep.stepTitle}`;
        }
      } else {
        nextStepLabel = nextStep.stepTitle;
      }
    } else {
      nextStepLabel = 'Workflow Complete';
    }

    return {
      workflowId: wf.id,
      projectName: wf.projectName,
      currentStep,
      completedInItem,
      justFinishedContext,
      nextStepTitle: nextStep?.stepTitle,
      nextStepLabel,
      isComplete: false,
      completedStepsCount,
      totalStepsCount,
    };
  };

  const createWorkflowFromTemplate = (
    templateId: string,
    projectName: string,
    itemCount: number,
    collection: string
  ): ProjectWorkflow => {
    const template =
      templates.find((t) => t.id === templateId) ||
      WORKFLOW_TEMPLATES.find((t) => t.id === templateId) ||
      GIFT_GUIDE_TEMPLATE;
    const newWorkflow = generateProjectWorkflow(template, projectName, itemCount, collection);
    setWorkflows((prev) => [newWorkflow, ...prev]);
    setActiveWorkflowIdState(newWorkflow.id);
    setActiveWorkflowStepId(null);
    triggerToast("Workflow Project Created", `${newWorkflow.projectName} (${newWorkflow.generatedSteps.length} steps generated)`);
    return newWorkflow;
  };

  const saveWorkflowTemplate = (template: WorkflowTemplate) => {
    setTemplates((prev) => {
      const idx = prev.findIndex((t) => t.id === template.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = template;
        return updated;
      }
      return [template, ...prev];
    });
    triggerToast("Workflow Template Saved", template.name);
  };

  const deleteWorkflowTemplate = (templateId: string): boolean => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId));
    triggerToast("Workflow Template Removed");
    return true;
  };

  const duplicateWorkflowTemplate = (templateId: string): WorkflowTemplate => {
    const source = templates.find((t) => t.id === templateId) || GIFT_GUIDE_TEMPLATE;
    const duplicated: WorkflowTemplate = {
      ...JSON.parse(JSON.stringify(source)),
      id: `template-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `${source.name} Copy`,
    };
    setTemplates((prev) => [duplicated, ...prev]);
    triggerToast("Template Duplicated", duplicated.name);
    return duplicated;
  };

  const completeWorkflowStep = (stepId: string, workflowId?: string, showHandoffModal = true) => {
    const targetWfId = workflowId || activeWorkflowId;
    const currentWf = workflows.find((w) => w.id === targetWfId);
    const existingStep = currentWf?.generatedSteps.find((s) => s.id === stepId);

    // If step is ALREADY completed, UNCHECK IT (reopen step without resetting future steps)
    if (existingStep?.completed) {
      setWorkflows((prevWfs) =>
        prevWfs.map((wf) => {
          if (wf.id !== targetWfId) return wf;
          const updatedSteps = wf.generatedSteps.map((step) => {
            if (step.id === stepId) {
              return {
                ...step,
                completed: false,
                completedAt: undefined,
              };
            }
            return step;
          });
          return {
            ...wf,
            generatedSteps: updatedSteps,
            status: 'active',
            updatedAt: new Date().toISOString(),
          };
        })
      );

      audioFX.playUncheck(settings.soundEnabled);
      setCompletedPomodorosToday((p) => Math.max(0, p - 1));
      triggerToast("Step Reopened", existingStep.stepTitle);
      return;
    }

    // Step was incomplete: MARK COMPLETED
    let completedStepObj: GeneratedWorkflowStep | undefined;
    let nextStepObj: GeneratedWorkflowStep | undefined;
    let nextAfterNextObj: GeneratedWorkflowStep | undefined;
    let totalStepsCount = 0;
    let completedStepsCount = 0;

    setWorkflows((prevWfs) =>
      prevWfs.map((wf) => {
        if (wf.id !== targetWfId) return wf;

        const updatedSteps = wf.generatedSteps.map((step) => {
          if (step.id === stepId) {
            completedStepObj = {
              ...step,
              completed: true,
              completedAt: new Date().toISOString(),
              subtasks: step.subtasks.map((st) => ({ ...st, completed: true })),
            };
            return completedStepObj;
          }
          return step;
        });

        // Find next uncompleted step in sequence
        const currentIdx = updatedSteps.findIndex((s) => s.id === stepId);
        nextStepObj = updatedSteps.find((s, idx) => idx > currentIdx && !s.completed);
        if (!nextStepObj) {
          nextStepObj = updatedSteps.find((s) => !s.completed);
        }

        if (nextStepObj) {
          const nextIdx = updatedSteps.findIndex((s) => s.id === nextStepObj!.id);
          nextAfterNextObj = updatedSteps.find((s, idx) => idx > nextIdx && !s.completed);
        }

        totalStepsCount = updatedSteps.length;
        completedStepsCount = updatedSteps.filter((s) => s.completed).length;
        const isAllComplete = updatedSteps.every((s) => s.completed);

        return {
          ...wf,
          generatedSteps: updatedSteps,
          status: isAllComplete ? 'completed' : 'active',
          updatedAt: new Date().toISOString(),
        };
      })
    );

    if (completedStepObj) {
      // 4. Stop/pause the current timer
      setTimerStatus('idle');

      audioFX.playComplete(settings.soundEnabled);
      setCompletedPomodorosToday((p) => p + 1);
      triggerToast("✓ Step Complete", completedStepObj.stepTitle);
      if (showHandoffModal) {
        setCompletionHandoff({
          completedStep: completedStepObj,
          nextStep: nextStepObj,
          nextAfterNextStep: nextAfterNextObj,
          workflowId: targetWfId || '',
          totalStepsCount,
          completedStepsCount,
        });
      }
    }
  };

  const toggleWorkflowSubtask = (stepId: string, subtaskId: string, workflowId?: string) => {
    const targetWfId = workflowId || activeWorkflowId;
    setWorkflows((prevWfs) =>
      prevWfs.map((wf) => {
        if (wf.id !== targetWfId) return wf;
        return {
          ...wf,
          generatedSteps: wf.generatedSteps.map((step) => {
            if (step.id !== stepId) return step;
            return {
              ...step,
              subtasks: step.subtasks.map((st) =>
                st.id === subtaskId ? { ...st, completed: !st.completed } : st
              ),
            };
          }),
        };
      })
    );
  };

  const startWorkflowFocus = (stepId: string, workflowId?: string) => {
    const targetWfId = workflowId || activeWorkflowId;
    if (targetWfId) setActiveWorkflowIdState(targetWfId);
    setActiveWorkflowStepId(stepId);
    setActiveFocusTaskId(null);
    setTimerPresetDuration('25-5');
    setRemainingSeconds(25 * 60);
    setTimerStatus('idle'); // DO NOT autostart: timer is paused at 25:00 initially!
    setIsFocusModeOpen(true);
    audioFX.playAdd(settings.soundEnabled);
    const wf = workflows.find((w) => w.id === targetWfId);
    const step = wf?.generatedSteps.find((s) => s.id === stepId);
    triggerToast("Focus Ready", step ? `${wf?.projectName} · ${step.stepTitle}` : "Focus session ready.");
  };

  const continueToNextWorkflowStep = () => {
    if (!completionHandoff) return;
    const { nextStep, workflowId } = completionHandoff;
    setCompletionHandoff(null);
    if (nextStep) {
      const targetWfId = workflowId || activeWorkflowId;
      if (targetWfId) setActiveWorkflowIdState(targetWfId);
      setActiveWorkflowStepId(nextStep.id);
      setActiveFocusTaskId(null);
      setTimerPresetDuration('25-5');
      setRemainingSeconds(25 * 60);
      setTimerStatus('idle'); // Kept paused until explicit user click
      if (isFocusModeOpen) {
        setIsFocusModeOpen(true);
      }
      triggerToast("Next Step Loaded", `${nextStep.categoryLabel} · ${nextStep.stepTitle}`);
    } else {
      closeFocusMode();
      triggerToast("🎉 Workflow Complete!", "All stages and products published.");
    }
  };

  const startNextWorkflowFocus = () => {
    if (!completionHandoff) return;
    const { nextStep, workflowId } = completionHandoff;
    setCompletionHandoff(null);
    if (nextStep) {
      const targetWfId = workflowId || activeWorkflowId;
      if (targetWfId) setActiveWorkflowIdState(targetWfId);
      setActiveWorkflowStepId(nextStep.id);
      setActiveFocusTaskId(null);
      setTimerPresetDuration('25-5');
      setRemainingSeconds(25 * 60);
      setTimerStatus('idle'); // Kept paused at 25:00! User explicitly clicks Start.
      setIsFocusModeOpen(true);
      triggerToast("Next Step Loaded", `${nextStep.categoryLabel} · ${nextStep.stepTitle}`);
    }
  };

  const resetWorkflowProgress = (workflowId: string) => {
    setWorkflows((prev) =>
      prev.map((wf) => {
        if (wf.id !== workflowId) return wf;
        return {
          ...wf,
          status: 'active',
          generatedSteps: wf.generatedSteps.map((st) => ({
            ...st,
            completed: false,
            completedAt: undefined,
            subtasks: st.subtasks.map((sub) => ({ ...sub, completed: false })),
          })),
          updatedAt: new Date().toISOString(),
        };
      })
    );
    setActiveWorkflowStepId(null);
    triggerToast("Workflow Progress Reset", "Ready to start from Product 1 · Step 1.");
  };

  const updateWorkflowProject = (
    workflowId: string,
    updates: { projectName?: string; collection?: string; itemCount?: number }
  ) => {
    setWorkflows((prev) =>
      prev.map((wf) => {
        if (wf.id !== workflowId) return wf;

        let updatedSteps = [...wf.generatedSteps];
        let updatedItemCount = wf.itemCount;

        // If itemCount changed
        if (updates.itemCount !== undefined && updates.itemCount > 0 && updates.itemCount !== wf.itemCount) {
          const newItemCount = Math.max(1, updates.itemCount);
          const oldItemCount = wf.itemCount;
          const template =
            templates.find((t) => t.id === wf.templateId) ||
            WORKFLOW_TEMPLATES.find((t) => t.id === wf.templateId) ||
            GIFT_GUIDE_TEMPLATE;
          const itemLabel = template?.repeatBlock?.itemLabel?.trim() || 'Product';

          const initialSteps = updatedSteps.filter((s) => s.stageType === 'initial');
          const finalSteps = updatedSteps.filter((s) => s.stageType === 'final');
          const existingRepeatSteps = updatedSteps.filter((s) => s.stageType === 'repeat');

          if (newItemCount > oldItemCount) {
            // Update totalItems and categoryLabel on existing repeat steps
            const existingUpdated = existingRepeatSteps.map((s) => ({
              ...s,
              totalItems: newItemCount,
              categoryLabel: `${itemLabel} ${s.itemIndex} of ${newItemCount}`,
            }));

            // Generate new repeat steps for products from oldItemCount + 1 to newItemCount
            const repeatBlueprint = template?.repeatBlock?.steps || [];
            const sampleRepeatSteps = existingRepeatSteps.filter((s) => s.itemIndex === 1);
            const newRepeatSteps: GeneratedWorkflowStep[] = [];

            for (let i = oldItemCount + 1; i <= newItemCount; i++) {
              if (repeatBlueprint.length > 0) {
                repeatBlueprint.forEach((st, stepIdx) => {
                  newRepeatSteps.push({
                    id: `step-prod-${i}-${st.id || stepIdx}-${Date.now().toString(36)}`,
                    stageType: 'repeat',
                    itemIndex: i,
                    totalItems: newItemCount,
                    stepIndex: stepIdx + 1,
                    stepTitle: st.title,
                    categoryLabel: `${itemLabel} ${i} of ${newItemCount}`,
                    subtasks: (st.defaultSubtasks || []).map((t, sIdx) => ({
                      id: `st-${i}-${stepIdx}-${sIdx}`,
                      title: t,
                      completed: false,
                    })),
                    completed: false,
                  });
                });
              } else {
                sampleRepeatSteps.forEach((sample, stepIdx) => {
                  newRepeatSteps.push({
                    id: `step-prod-${i}-${stepIdx}-${Date.now().toString(36)}`,
                    stageType: 'repeat',
                    itemIndex: i,
                    totalItems: newItemCount,
                    stepIndex: stepIdx + 1,
                    stepTitle: sample.stepTitle,
                    categoryLabel: `${itemLabel} ${i} of ${newItemCount}`,
                    subtasks: sample.subtasks.map((st, sIdx) => ({
                      id: `st-${i}-${stepIdx}-${sIdx}`,
                      title: st.title,
                      completed: false,
                    })),
                    completed: false,
                  });
                });
              }
            }

            updatedSteps = [...initialSteps, ...existingUpdated, ...newRepeatSteps, ...finalSteps];
            updatedItemCount = newItemCount;
          } else if (newItemCount < oldItemCount) {
            // Keep repeat steps where itemIndex <= newItemCount
            const keptRepeatSteps = existingRepeatSteps
              .filter((s) => s.itemIndex && s.itemIndex <= newItemCount)
              .map((s) => ({
                ...s,
                totalItems: newItemCount,
                categoryLabel: `${itemLabel} ${s.itemIndex} of ${newItemCount}`,
              }));

            updatedSteps = [...initialSteps, ...keptRepeatSteps, ...finalSteps];
            updatedItemCount = newItemCount;
          }
        }

        const isAllComplete = updatedSteps.length > 0 && updatedSteps.every((s) => s.completed);

        const updatedWf: ProjectWorkflow = {
          ...wf,
          projectName: updates.projectName !== undefined ? updates.projectName.trim() || wf.projectName : wf.projectName,
          collection: updates.collection !== undefined ? updates.collection.trim() || wf.collection : wf.collection,
          itemCount: updatedItemCount,
          generatedSteps: updatedSteps,
          status: isAllComplete ? 'completed' : 'active',
          updatedAt: new Date().toISOString(),
        };

        return updatedWf;
      })
    );
    triggerToast("Project Updated");
  };

  const duplicateWorkflowProject = (workflowId: string): ProjectWorkflow | null => {
    const source = workflows.find((w) => w.id === workflowId);
    if (!source) return null;

    const newId = `wf-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newWorkflow: ProjectWorkflow = {
      ...JSON.parse(JSON.stringify(source)),
      id: newId,
      projectName: `${source.projectName} Copy`,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      generatedSteps: source.generatedSteps.map((step, idx) => ({
        ...step,
        id: `step-dup-${newId}-${idx}`,
        completed: false,
        completedAt: undefined,
        subtasks: step.subtasks.map((st, sIdx) => ({
          ...st,
          id: `st-dup-${newId}-${idx}-${sIdx}`,
          completed: false,
        })),
      })),
    };

    setWorkflows((prev) => [newWorkflow, ...prev]);
    setActiveWorkflowIdState(newWorkflow.id);
    setActiveWorkflowStepId(null);
    triggerToast("Project Duplicated", newWorkflow.projectName);
    return newWorkflow;
  };

  const dismissCompletionHandoff = () => {
    setCompletionHandoff(null);
  };

  const deleteWorkflow = (workflowId: string) => {
    setWorkflows((prev) => {
      const remaining = prev.filter((w) => w.id !== workflowId);
      if (activeWorkflowId === workflowId) {
        setActiveWorkflowIdState(remaining[0]?.id || null);
        setActiveWorkflowStepId(null);
      }
      return remaining;
    });
    if (activeWorkflowId === workflowId && isFocusModeOpen) {
      closeFocusMode();
    }
    triggerToast("Project Removed");
  };

  const openFocusMode = (taskId?: string) => {
    if (taskId) {
      setActiveWorkflowStepId(null);
      setActiveFocusTaskId(taskId);
    }
    setIsFocusModeOpen(true);
  };

  const closeFocusMode = () => setIsFocusModeOpen(false);

  const addStopwatchLap = () => {
    setLaps((prev) => [stopwatchSeconds, ...prev]);
  };

  const activateScene = (sceneId: string) => {
    const scene = scenes.find((s) => s.id === sceneId);
    if (!scene) return;
    setActiveSceneId(scene.id);
    updateBackground({ preset: scene.background });
    setTimerPresetDuration(scene.timerPreset);
    updateAmbient({ environment: scene.ambient, isPlaying: true });
    triggerToast(`Scene Active: ${scene.name}`, scene.description);
  };

  const updateBackground = (updates: Partial<BackgroundSettings>) => {
    setSettings((prev) => ({
      ...prev,
      background: { ...prev.background, ...updates },
    }));
  };

  const updateWidgets = (updates: Partial<WidgetVisibility>) => {
    setSettings((prev) => ({
      ...prev,
      widgets: { ...prev.widgets, ...updates },
    }));
  };

  const updateAmbient = (updates: Partial<AmbientSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ambient: { ...prev.ambient, ...updates },
    }));
  };

  const setDailyIntention = (dailyIntention: string) => {
    setSettings((prev) => ({ ...prev, dailyIntention }));
  };

  const setQuickNote = (quickNote: string) => {
    setSettings((prev) => ({ ...prev, quickNote }));
  };

  // Task Actions
  const toggleTaskComplete = (id: string) => {
    const today = getTodayString();
    let newlyCompleted = false;

    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === id) {
          const willComplete = !t.completed;
          newlyCompleted = willComplete;
          
          let streak = t.streak || 0;
          if (willComplete && t.recurring !== 'none') {
            streak = streak + 1;
          }

          return {
            ...t,
            completed: willComplete,
            completedAt: willComplete ? new Date().toISOString() : undefined,
            streak,
          };
        }
        return t;
      });

      const todayTasks = updated.filter((t) => t.dueDate === today);
      const remainingToday = todayTasks.filter((t) => !t.completed);

      if (newlyCompleted) {
        audioFX.playComplete(settings.soundEnabled);
        if (remainingToday.length === 0 && todayTasks.length > 0) {
          setTimeout(() => {
            audioFX.playAllDone(settings.soundEnabled);
          }, 300);
          triggerToast("All set for today.", "A moment to rest and reflect.");
        } else {
          const randomPhrase = ENCOURAGING_MICROCOPY[Math.floor(Math.random() * ENCOURAGING_MICROCOPY.length)];
          triggerToast(randomPhrase);
        }
      } else {
        audioFX.playUncheck(settings.soundEnabled);
      }

      return updated;
    });
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'order'> & { id?: string }): Task => {
    const newTask: Task = {
      id: taskData.id || `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: taskData.title,
      notes: taskData.notes || '',
      areaId: taskData.areaId || 'website-shop',
      projectId: taskData.projectId,
      priority: taskData.priority || 'none',
      dueDate: taskData.dueDate || getTodayString(),
      dueTime: taskData.dueTime,
      recurring: taskData.recurring || 'none',
      recurringDays: taskData.recurringDays,
      subtasks: taskData.subtasks || [],
      links: taskData.links || [],
      completed: taskData.completed || false,
      completedAt: taskData.completedAt,
      order: tasks.length + 1,
      createdAt: new Date().toISOString(),
      streak: taskData.streak || 0,
      focusTimeSeconds: 0,
    };

    setTasks((prev) => [newTask, ...prev]);
    audioFX.playAdd(settings.soundEnabled);
    triggerToast("Task added.", newTask.title);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (activeDetailTaskId === id) setActiveDetailTaskId(null);
    if (activeFocusTaskId === id) setActiveFocusTaskId(null);
    triggerToast("Task deleted.");
  };

  const reorderTasks = (reordered: Task[]) => setTasks(reordered);

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      })
    );
    audioFX.playComplete(settings.soundEnabled);
  };

  const addSubtask = (taskId: string, title: string) => {
    if (!title.trim()) return;
    const newSubtask = {
      id: `st-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: title.trim(),
      completed: false,
    };
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return { ...t, subtasks: [...t.subtasks, newSubtask] };
        }
        return t;
      })
    );
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return { ...t, subtasks: t.subtasks.filter((st) => st.id !== subtaskId) };
        }
        return t;
      })
    );
  };

  const addProject = (projectData: Omit<Project, 'id'>): Project => {
    const newProj: Project = {
      id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      ...projectData,
    };
    setProjects((prev) => [...prev, newProj]);
    triggerToast("Project created.", newProj.name);
    return newProj;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.map((t) => (t.projectId === id ? { ...t, projectId: undefined } : t)));
    if (activeDetailProjectId === id) setActiveDetailProjectId(null);
    triggerToast("Project deleted.");
  };

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    triggerToast("Settings saved.");
  };

  const resetToDefaults = () => {
    setTasks(getInitialTasks());
    setProjects(INITIAL_PROJECTS);
    setSettings(INITIAL_SETTINGS);
    setWorkflows([createInitialWWIIGiftGuideWorkflow()]);
    setTemplates(INITIAL_TEMPLATES);
    setCompletedPomodorosToday(0);
    setTotalFocusTodaySeconds(0);
    triggerToast("Data reset to default.", "Fresh start loaded.");
  };

  const exportData = () => {
    const exportObj = {
      version: 2,
      exportedAt: new Date().toISOString(),
      tasks,
      projects,
      settings,
      workflows,
      templates,
      completedPomodorosToday,
      totalFocusTodaySeconds,
    };
    return JSON.stringify(exportObj, null, 2);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.tasks && Array.isArray(parsed.tasks)) setTasks(parsed.tasks);
      if (parsed.projects && Array.isArray(parsed.projects)) setProjects(parsed.projects);
      if (parsed.settings) setSettings((prev) => ({ ...prev, ...parsed.settings }));
      if (parsed.workflows && Array.isArray(parsed.workflows)) setWorkflows(parsed.workflows);
      if (parsed.templates && Array.isArray(parsed.templates)) setTemplates(parsed.templates);
      if (typeof parsed.completedPomodorosToday === 'number') setCompletedPomodorosToday(parsed.completedPomodorosToday);
      if (typeof parsed.totalFocusTodaySeconds === 'number') setTotalFocusTodaySeconds(parsed.totalFocusTodaySeconds);
      triggerToast("Data imported successfully!");
      return true;
    } catch (e) {
      console.error("Failed to import data", e);
      triggerToast("Import failed", "Invalid JSON format.");
      return false;
    }
  };

  const openTaskDetail = (id: string) => setActiveDetailTaskId(id);
  const closeTaskDetail = () => setActiveDetailTaskId(null);

  const openProjectDetail = (id: string) => setActiveDetailProjectId(id);
  const closeProjectDetail = () => setActiveDetailProjectId(null);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        projects,
        categories: CATEGORIES,
        settings,
        scenes,
        activeArea,
        setActiveArea,
        activeView,
        setActiveView,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        isQuickAddOpen,
        setIsQuickAddOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        activeDetailTaskId,
        openTaskDetail,
        closeTaskDetail,
        activeDetailProjectId,
        openProjectDetail,
        closeProjectDetail,
        toasts,

        // Focus State & Actions
        isFocusModeOpen,
        activeFocusTaskId,
        timerMode,
        setTimerMode,
        timerStatus,
        timerPreset,
        remainingSeconds,
        stopwatchSeconds,
        laps,
        completedPomodorosToday,
        totalFocusTodaySeconds,
        activeSceneId,

        startFocusForTask,
        pauseFocusTimer,
        resumeFocusTimer,
        resetFocusTimer,
        skipFocusSession,
        finishFocusSession,
        openFocusMode,
        closeFocusMode,
        addStopwatchLap,
        setTimerPresetDuration,

        activateScene,
        updateBackground,
        updateWidgets,
        updateAmbient,
        setDailyIntention,
        setQuickNote,

        // Task Actions
        toggleTaskComplete,
        addTask,
        updateTask,
        deleteTask,
        reorderTasks,
        toggleSubtask,
        addSubtask,
        deleteSubtask,

        // Project Actions
        addProject,
        updateProject,
        deleteProject,

        // Global Mute
        isMuted,
        toggleGlobalMute,

        // Workflows & Templates
        templates,
        saveWorkflowTemplate,
        deleteWorkflowTemplate,
        duplicateWorkflowTemplate,
        workflows,
        activeWorkflowId,
        activeWorkflowStepId,
        completionHandoff,
        createWorkflowFromTemplate,
        updateWorkflowProject,
        duplicateWorkflowProject,
        completeWorkflowStep,
        toggleWorkflowSubtask,
        startWorkflowFocus,
        continueToNextWorkflowStep,
        startNextWorkflowFocus,
        dismissCompletionHandoff,
        deleteWorkflow,
        resetWorkflowProgress,
        setActiveWorkflowId,
        getActiveWorkflow,
        getWhatsNextState,

        // Settings & System
        updateSettings,
        resetToDefaults,
        exportData,
        importData,
        triggerToast,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return ctx;
};
