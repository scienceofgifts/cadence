export interface NoteCategory {
  id: string;
  name: string;
  iconName: string;
  accentColor: string;
}

export interface PersonalNote {
  id: string;
  categoryId: string;
  title: string;
  text: string;
  color?: string;
  createdAt: string;
}

export const NOTE_CATEGORIES: NoteCategory[] = [
  { id: 'remember', name: 'Remember', iconName: 'Bookmark', accentColor: '#99BFF9' },
  { id: 'about-life', name: 'About Life', iconName: 'Sprout', accentColor: '#C3F3DF' },
  { id: 'perspective', name: 'Perspective', iconName: 'Eye', accentColor: '#5C93D6' },
  { id: 'relax', name: 'Relax', iconName: 'Coffee', accentColor: '#88C1A8' },
  { id: 'create', name: 'Create', iconName: 'Wand2', accentColor: '#99BFF9' },
  { id: 'ideas', name: 'Ideas', iconName: 'Lightbulb', accentColor: '#F59E0B' },
  { id: 'people', name: 'People', iconName: 'Users', accentColor: '#EC4899' },
  { id: 'health', name: 'Health', iconName: 'Activity', accentColor: '#10B981' },
  { id: 'money', name: 'Money', iconName: 'Coins', accentColor: '#3B82F6' },
  { id: 'work', name: 'Work', iconName: 'Briefcase', accentColor: '#28537D' },
  { id: 'read', name: 'Read', iconName: 'BookOpen', accentColor: '#8B5CF6' },
  { id: 'watch', name: 'Watch', iconName: 'Film', accentColor: '#6366F1' },
  { id: 'explore', name: 'Explore', iconName: 'Compass', accentColor: '#0EA5E9' },
  { id: 'learn', name: 'Learn', iconName: 'GraduationCap', accentColor: '#14B8A6' },
  { id: 'gratitude', name: 'Gratitude', iconName: 'HeartHandshake', accentColor: '#F43F5E' },
  { id: 'funny', name: 'Funny', iconName: 'Laugh', accentColor: '#F97316' },
  { id: 'important', name: 'Important', iconName: 'AlertCircle', accentColor: '#EF4444' },
  { id: 'someday', name: 'Someday', iconName: 'Hourglass', accentColor: '#64748B' },
  { id: 'quote', name: 'Quote', iconName: 'Quote', accentColor: '#A855F7' },
  { id: 'personal', name: 'Personal', iconName: 'User', accentColor: '#1B3D5F' },
];

export const INITIAL_PERSONAL_NOTES: PersonalNote[] = [
  {
    id: 'note-1',
    categoryId: 'remember',
    title: 'REMEMBER',
    text: "Create, don't just consume.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 'note-2',
    categoryId: 'about-life',
    title: 'ABOUT LIFE',
    text: 'A calmer mind makes better work.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'note-3',
    categoryId: 'relax',
    title: 'RELAX',
    text: 'Good food. Good sleep. Better ideas.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'note-4',
    categoryId: 'explore',
    title: 'EXPLORE',
    text: 'See more places. More stories.',
    createdAt: new Date().toISOString(),
  },
];
