export type ColorPalette = {
  label: string;
  shades: string[];
};

export const COLOR_PALETTES: ColorPalette[] = [
  { label: 'Ocean', shades: ['#DBEAFE', '#93C5FD', '#60A5FA', '#2563EB', '#1D4ED8'] },
  { label: 'Sky', shades: ['#CFFAFE', '#67E8F9', '#22D3EE', '#06B6D4', '#0E7490'] },
  { label: 'Mint', shades: ['#D1FAE5', '#86EFAC', '#34D399', '#10B981', '#047857'] },
  { label: 'Forest', shades: ['#DCFCE7', '#86EFAC', '#4ADE80', '#16A34A', '#166534'] },
  { label: 'Gold', shades: ['#FEF3C7', '#FCD34D', '#FBBF24', '#F59E0B', '#B45309'] },
  { label: 'Coral', shades: ['#FFEDD5', '#FDBA74', '#FB923C', '#EA580C', '#C2410C'] },
  { label: 'Rose', shades: ['#FFE4E6', '#FDA4AF', '#FB7185', '#F43F5E', '#BE123C'] },
  { label: 'Berry', shades: ['#FCE7F3', '#F9A8D4', '#F472B6', '#DB2777', '#9D174D'] },
  { label: 'Violet', shades: ['#EDE9FE', '#C4B5FD', '#A78BFA', '#8B7CF6', '#7C3AED'] },
  { label: 'Slate', shades: ['#E2E8F0', '#94A3B8', '#64748B', '#475569', '#334155'] },
];

export function findPaletteByColor(value: string, palettes: ColorPalette[]) {
  return (
    palettes.find((palette) => palette.shades.includes(value)) ??
    palettes.find((palette) => palette.shades[3] === value) ??
    palettes[0]
  );
}
