import { Scene } from '../types';

export const INITIAL_SCENES: Scene[] = [
  {
    id: 'scene-deep-work',
    name: 'Deep Work',
    description: 'Dark navy canvas, 50-minute focused session with subtle ocean swell.',
    iconName: 'Brain',
    background: 'dark-navy',
    timerPreset: '50-10',
    ambient: 'ocean',
  },
  {
    id: 'scene-writing',
    name: 'Writing',
    description: 'Warm paper texture, 25-minute Pomodoro sprints with café murmur.',
    iconName: 'Feather',
    background: 'paper',
    timerPreset: '25-5',
    ambient: 'cafe',
  },
  {
    id: 'scene-reading',
    name: 'Reading',
    description: 'Soft neutral backdrop, open-ended stopwatch with cozy fireplace crackle.',
    iconName: 'BookOpen',
    background: 'neutral-gradient',
    timerPreset: 'custom',
    ambient: 'fireplace',
  },
  {
    id: 'scene-night',
    name: 'Night',
    description: 'Low-brightness dark theme, 90-minute ultradian flow with soft rain.',
    iconName: 'Moon',
    background: 'dark-navy',
    timerPreset: '90-0',
    ambient: 'rain',
  },
];
