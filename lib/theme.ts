/**
 * AETHERCV AI Global Design System & Unified Enterprise Theme
 * Primary Blue Palette & Unified SaaS Dark Theme
 */

export const themeTokens = {
  colors: {
    // Backgrounds
    backgroundPrimary: '#07101F',
    backgroundSecondary: '#0A1528',
    cardBackground: '#111D34',
    secondaryCard: '#162440',
    navbarBackground: '#0C162B',
    sidebarBackground: '#0B1628',

    // Primary Blue Spectrum
    primaryBlue: '#2563EB',
    secondaryBlue: '#3B82F6',
    accentBlue: '#60A5FA',
    highlightBlue: '#4F7DFF',
    hoverBlue: '#5D8CFF',
    activeBlue: '#2F6FFF',
    blueGlow: 'rgba(59, 130, 246, 0.35)',

    // Borders & Glass
    borderBlue: 'rgba(59, 130, 246, 0.18)',
    borderCard: 'rgba(59, 130, 246, 0.12)',
    borderActive: '#3B82F6',

    // Typography
    textPrimary: '#FFFFFF',
    textSecondary: '#9CAEC9',
    textMuted: '#64748B',

    // Status
    success: '#22C55E',
    warning: '#F59E0B',
    info: '#3B82F6',
    error: '#4D48E6'
  },
  radii: {
    button: '14px',
    input: '14px',
    card: '24px',
    modal: '24px'
  },
  gradients: {
    buttonPrimary: 'linear-gradient(to right, #4F7DFF, #2563EB)',
    buttonHover: 'linear-gradient(to right, #5D8CFF, #3B82F6)',
    brandAccent: 'linear-gradient(to right, #4F7DFF, #2563EB)'
  }
} as const
