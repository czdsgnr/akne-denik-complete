// src/styles/designSystem.js
// 🎨 MODERNÍ PINK DESIGN SYSTÉM - inspirovaný clean e-shopem
// ═══════════════════════════════════════════════════════════════════

import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 🌸 MODERNÍ RŮŽOVÁ PALETA - jako na obrázku
export const colors = {
  // Primary - jemné růžové tóny
  primary: '#E91E63',              // Material Pink 500
  primaryLight: '#F8BBD9',         // Světlá růžová
  primaryDark: '#C2185B',          // Tmavší růžová
  primaryExtraLight: '#FCE4EC',    // Velmi světlá růžová
  primaryAlpha10: 'rgba(233, 30, 99, 0.1)',
  primaryAlpha20: 'rgba(233, 30, 99, 0.2)',
  
  // Background - čisté bílé a jemné růžové
  background: '#FDF2F8',           // Velmi světlý růžový background
  backgroundSoft: '#FEFCFF',       // Krémově bílá
  backgroundCard: '#FFFFFF',       // Čistě bílé karty
  backgroundPink: '#FCE4EC',       // Jemně růžové pozadí
  
  // Surface - čisté bílé tóny
  surface: '#FFFFFF',              // Bílé
  surfaceElevated: '#FFFFFF',      // Bílé s stínem
  surfaceSubtle: '#FAFAFA',        // Velmi jemně šedé
  surfaceTinted: '#FDF2F8',        // Jemně růžové
  
  // Text - kontrastní ale jemné
  text: '#2D3748',                 // Tmavě šedý
  textSecondary: '#718096',        // Střední šedý
  textMuted: '#A0AEC0',            // Světlý šedý
  textPlaceholder: '#E2E8F0',      // Placeholder šedá
  textInverse: '#FFFFFF',          // Bílý text
  textPink: '#E91E63',             // Růžový text
  
  // Borders - velmi jemné
  border: '#F7FAFC',               // Téměř neviditelné
  borderLight: '#EDF2F7',          // Extra jemné
  borderMedium: '#E2E8F0',         // Střední
  borderActive: '#F8BBD9',         // Růžové borders
  
  // Status barvy - jemné tóny
  success: '#48BB78',              // Zelená
  successLight: '#F0FFF4',         // Světlá zelená
  warning: '#ED8936',              // Oranžová
  warningLight: '#FFFAF0',         // Světlá oranžová
  error: '#F56565',                // Červená
  errorLight: '#FED7D7',           // Světlá červená
  info: '#4299E1',                 // Modrá
  infoLight: '#EBF8FF',            // Světlá modrá
  
  // Grays - jemné šedé tóny
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F7FAFC',
  gray200: '#EDF2F7',
  gray300: '#E2E8F0',
  gray400: '#CBD5E0',
  gray500: '#A0AEC0',
  gray600: '#718096',
  gray700: '#4A5568',
  gray800: '#2D3748',
  gray900: '#1A202C',
  
  // Special colors
  accent: '#FF6B9D',               // Akcent růžová
  highlight: '#C53030',            // Zvýraznění
  overlay: 'rgba(45, 55, 72, 0.6)',
  overlayLight: 'rgba(255, 255, 255, 0.95)',
};

// 📏 SPACING - více prostoru pro clean look
export const spacing = {
  xs: 4,    // 4px
  sm: 8,    // 8px
  md: 16,   // 16px
  lg: 24,   // 24px
  xl: 32,   // 32px
  xxl: 48,  // 48px
  xxxl: 64, // 64px
  huge: 96, // 96px
  mega: 128, // 128px
};

// 🔤 TYPOGRAPHY - čistá a moderní
export const typography = {
  // Headlines - bold a clean
  title: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 30,
    color: colors.text,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    color: colors.text,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
    color: colors.text,
  },
  
  // Body text
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: colors.text,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 26,
    color: colors.text,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.text,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    color: colors.text,
  },
  
  // Small text
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.textSecondary,
  },
  small: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: colors.textSecondary,
  },
  tiny: {
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 14,
    color: colors.textMuted,
  },
  
  // Button text
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  buttonLarge: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 22,
  },
  
  // Labels
  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: colors.text,
  },
};

// 📐 BORDER RADIUS - více zaoblené pro moderní look
export const borderRadius = {
  none: 0,
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 56,
  full: 9999,
};

// 🌟 SHADOWS - jemnější, elegantnější
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: colors.gray600,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sm: {
    shadowColor: colors.gray600,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  md: {
    shadowColor: colors.gray600,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: colors.gray600,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },
  xl: {
    shadowColor: colors.gray600,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 28,
    elevation: 15,
  },
  // Pink shadow pro special případy
  pink: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// 🎨 GRADIENTY - jemné růžové
export const gradients = {
  primary: [colors.primary, colors.primaryDark],
  primaryLight: [colors.primaryLight, colors.primary],
  secondary: [colors.accent, colors.primary],
  subtle: [colors.backgroundCard, colors.surfaceTinted],
  backgroundSoft: [colors.backgroundSoft, colors.background],
  pink: [colors.primaryExtraLight, colors.primaryLight],
  sunset: [colors.accent, colors.primary, colors.primaryDark],
  morning: [colors.white, colors.backgroundPink],
  overlayLight: ['rgba(255, 255, 255, 0.95)', 'rgba(253, 242, 248, 0.8)'],
  overlayDark: ['rgba(45, 55, 72, 0.6)', 'rgba(45, 55, 72, 0.4)'],
};

// 🎬 ANIMATIONS
export const animations = {
  durations: {
    instant: 0,
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 750,
  },
  easings: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
};

// 🔧 UTILITY FUNKCE
export const responsive = (value, factor = 1) => {
  const scale = (screenWidth / 375) * factor;
  return Math.round(value * scale);
};

export const getStatusColor = (status, variant = 'main') => {
  const colorMap = {
    success: variant === 'light' ? colors.successLight : colors.success,
    warning: variant === 'light' ? colors.warningLight : colors.warning,
    error: variant === 'light' ? colors.errorLight : colors.error,
    info: variant === 'light' ? colors.infoLight : colors.info,
    primary: variant === 'light' ? colors.primaryLight : colors.primary,
  };
  return colorMap[status] || colors.primary;
};

export const getGradient = (type) => {
  return gradients[type] || gradients.primary;
};

// 📦 COMPONENT STYLES - clean a moderní

// Container styly
export const containers = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenSoft: {
    flex: 1,
    backgroundColor: colors.backgroundSoft,
  },
  screenWhite: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.mega,
  },
});

// Layout komponenty
export const layouts = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowAround: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  column: {
    flexDirection: 'column',
  },
  columnCenter: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Card styly - čisté a moderne
export const cards = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  elevated: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  subtle: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  clean: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.lg,
  },
  minimal: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
});

// Button styly - růžové a čisté
export const buttons = StyleSheet.create({
  // Velikosti
  small: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    minHeight: 36,
  },
  medium: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    minHeight: 48,
  },
  large: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    minHeight: 56,
  },
  
  // Base style
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  
  // Variants - růžové tóny
  primary: {
    backgroundColor: colors.primary,
    ...shadows.sm,
  },
  primaryLight: {
    backgroundColor: colors.primaryLight,
  },
  accent: {
    backgroundColor: colors.accent,
    ...shadows.sm,
  },
  subtle: {
    backgroundColor: colors.surfaceTinted,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  clean: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    ...shadows.xs,
  },
});

// Form styly
export const forms = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.borderMedium,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    backgroundColor: colors.surface,
    ...typography.body,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryExtraLight,
    ...shadows.xs,
  },
  error: {
    ...typography.small,
    color: colors.error,
    marginTop: spacing.xs,
  },
  helper: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});

// Další styly...
export const progress = StyleSheet.create({
  track: {
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
});

export const avatars = StyleSheet.create({
  small: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  medium: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  large: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  xlarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});

export const badges = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  primary: {
    backgroundColor: colors.primaryExtraLight,
  },
  success: {
    backgroundColor: colors.successLight,
  },
  warning: {
    backgroundColor: colors.warningLight,
  },
  error: {
    backgroundColor: colors.errorLight,
  },
});

// 🚀 EXPORT
export default {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  gradients,
  animations,
  responsive,
  getStatusColor,
  getGradient,
  containers,
  layouts,
  cards,
  buttons,
  forms,
  progress,
  avatars,
  badges,
};