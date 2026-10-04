import { QuickLink } from '../types';

export const QUICK_LINKS: QuickLink[] = [
  {
    id: 'link-cms',
    title: 'My website CMS',
    url: 'http://localhost:3000/',
    description: 'Science of Gifts CMS',
    iconName: 'Globe',
    isExternal: false,
  },
  {
    id: 'link-preview',
    title: 'My website Preview',
    url: 'http://127.0.0.1:4000/',
    description: 'Science of Gifts Preview',
    iconName: 'Eye',
    isExternal: false,
  },
  {
    id: 'link-thoughts',
    title: 'My personal thoughts',
    url: 'https://my-thoughts.scienceofgifts.workers.dev/',
    description: 'Personal thoughts app',
    iconName: 'BookOpen',
    isExternal: true,
  },
  {
    id: 'link-[#prompt-studio]',
    title: 'Custom Prompt generator',
    url: 'https://prompt-studio.scienceofgifts.workers.dev/',
    description: 'Prompt Studio',
    iconName: 'Wand2',
    isExternal: true,
  },
];
