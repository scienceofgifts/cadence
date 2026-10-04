export type AreaId = 'website-shop' | 'youtube' | 'house' | 'reading' | 'workout';

export type Priority = 'none' | 'low' | 'medium' | 'high';

export type RecurringCadence = 'none' | 'daily' | 'weekdays' | 'weekly' | 'monthly';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface AttachmentLink {
  id: string;
  title: string;
  url: string;
}

export interface Task {
  id: string;
  title: string;
  notes: string;
  areaId: AreaId;
  projectId?: string;
  priority: Priority;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // e.g. "09:00", "14:30"
  recurring: RecurringCadence;
  recurringDays?: number[]; // [0..6] for Sunday..Saturday
  subtasks: Subtask[];
  links: AttachmentLink[];
  completed: boolean;
  completedAt?: string; // ISO string
  order: number;
  createdAt: string;
  streak?: number;
  focusTimeSeconds?: number;
}

export interface Project {
  id: string;
  name: string;
  areaId: AreaId;
  description: string;
  deadline?: string;
  color?: string;
  isArchived?: boolean;
}

export interface CategoryInfo {
  id: AreaId;
  name: string;
  shortName: string;
  description: string;
  accentColor: string; // Hex or CSS color
  bgTint: string;
  borderTint: string;
  iconName: string;
}

export type ViewMode = 'today' | 'week' | 'projects' | 'habits' | 'workflows';

export type ThemeMode = 'light' | 'dark' | 'system';

export type TypographyPreset = 'modern' | 'editorial' | 'literary' | 'classic';

export type ColorTheme = 'blue' | 'black' | 'forest' | 'burgundy' | 'slate';

export type BackgroundPreset =
  | 'clean'
  | 'paper'
  | 'soft-blue'
  | 'soft-mint'
  | 'blue-mint'
  | 'dark-navy'
  | 'neutral-gradient'
  | 'misty-lake'
  | 'sunlit-desk'
  | 'nordic-forest'
  | 'custom';

export interface BackgroundSettings {
  preset: BackgroundPreset;
  customImageUrl?: string;
  opacity: number; // 0.1 to 1.0
  overlayStrength: number; // 0 to 0.9
  blurPx: number; // 0 to 20
  readabilityMode: boolean;
}

export interface WidgetVisibility {
  focusToday: boolean;
  pomodoros: boolean;
  progress: boolean;
  currentFocus: boolean;
  stopwatch: boolean;
  dailyIntention: boolean;
  quickNote: boolean;
  clock: boolean;
  streak: boolean;
}

export type AmbientEnvironment = 'silence' | 'rain' | 'cafe' | 'fireplace' | 'forest' | 'ocean' | 'white-noise';

export interface AmbientSettings {
  environment: AmbientEnvironment;
  volume: number; // 0 to 1
  isPlaying: boolean;
}

export type TimerMode = 'pomodoro' | 'stopwatch' | 'countdown';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'break';
export type TimerPreset = '25-5' | '50-10' | '90-0' | 'custom';

export interface UserSettings {
  userName: string;
  theme: ThemeMode;
  typography: TypographyPreset;
  colorTheme: ColorTheme;
  soundEnabled: boolean;
  microcopyEnabled: boolean;
  showCompletedTasks: boolean;
  compactView: boolean;
  background: BackgroundSettings;
  widgets: WidgetVisibility;
  ambient: AmbientSettings;
  dailyIntention: string;
  quickNote: string;
  focusTargetMinutes: number;
}

export interface Scene {
  id: string;
  name: string;
  description: string;
  iconName: string;
  background: BackgroundPreset;
  timerPreset: TimerPreset;
  ambient: AmbientEnvironment;
}

export interface ToastMessage {
  id: string;
  text: string;
  subtext?: string;
}

export interface QuickLink {
  id: string;
  title: string;
  url: string;
  description: string;
  iconName: string;
  isExternal: boolean;
}
