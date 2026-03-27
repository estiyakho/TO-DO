import { Settings } from '@/types/task';

export function getThemeColors(settings: Settings, resolvedTheme: 'light' | 'dark') {
  const isLight = resolvedTheme === 'light';
  const accent = settings.accentColor;
  const useAmoled = !isLight && settings.amoledTheme;

  return {
    accent,
    background: isLight ? '#F3F6FB' : useAmoled ? '#000000' : '#090B10',
    surface: isLight ? '#FFFFFF' : useAmoled ? '#05070B' : '#13161C',
    surfaceMuted: isLight ? '#EDF2F8' : useAmoled ? '#090C12' : '#171A21',
    surfaceElevated: isLight ? '#FFFFFF' : useAmoled ? '#0B0F16' : '#1A1F29',
    border: isLight ? '#D8E1EC' : '#1E293B',
    text: isLight ? '#0F172A' : '#F8FAFC',
    textMuted: isLight ? '#64748B' : '#94A3B8',
    textSoft: isLight ? '#475569' : '#CBD5E1',
    danger: '#F87171',
    success: '#34D399',
    warning: '#FBBF24',
  };
}
