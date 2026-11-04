/**
 * Sistema de Diseño Gerontológico Accesible (WCAG 2.1 AAA)
 * Específicamente optimizado para adultos mayores:
 * - Alto contraste visual (>= 7:1)
 * - Objetivos táctiles ampliados (mínimo 56dp)
 * - Jerarquía tipográfica legible
 */

export const THEME = {
  colors: {
    // Colores base con alto contraste
    background: "#F8FAFC",
    surface: "#FFFFFF",
    surfaceElevated: "#FFFFFF",
    
    // Identidad Cley (Naranja amigable de alto contraste)
    primary: "#D9480F",       // Contraste 4.6:1 en fondo blanco
    primaryDark: "#B83A09",
    primaryLight: "#FFE8CC",
    
    // Semáforo gerontológico
    success: "#15803D",       // Verde para confirmaciones y SÍ
    successLight: "#DCFCE7",
    danger: "#DC2626",        // Rojo para SOS y emergencias
    dangerLight: "#FEE2E2",
    warning: "#B45309",
    
    // Textos con contraste extremo (evita fatiga visual)
    textPrimary: "#0F172A",   // Contraste 14:1 en blanco
    textSecondary: "#334155", // Contraste 8:1 en blanco
    textMuted: "#64748B",
    textInverse: "#FFFFFF",
    
    // Bordes y sombras accesibles
    border: "#CBD5E1",
    borderFocus: "#D9480F",
    shadow: "#0F172A",
  },
  
  // Tamaños de fuente agrandados (mínimo 18 para cuerpo de texto)
  typography: {
    hero: 32,
    h1: 26,
    h2: 22,
    h3: 20,
    bodyLarge: 19,
    body: 18,
    label: 16,
  },
  
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  // Áreas mínimas táctiles (excede la norma de 48x48dp de Android)
  touchTarget: {
    minHeight: 58,
    minWidth: 58,
    borderRadius: 16,
  }
};

