import { Category, Settings } from '@/types/task';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'default',
    name: 'General',
    description: 'Default category for new tasks',
    color: '#2563EB',
    icon: 'folder-open-outline',
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_SETTINGS: Settings = {
  resetInterval: 'none',
  lastResetAt: null,
  statsResetAt: null,
  theme: 'dark',
  amoledTheme: false,
  accentColor: '#8B7CF6',
  timeFormat: '12h',
  firstDayOfWeek: 'saturday',
  snoozeDuration: 10,
  defaultScreen: 'todos',
  language: 'english',
};
