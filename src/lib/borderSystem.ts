// src/lib/borderSystem.ts
// Complete border design system with 6 categories

export type BorderCategory = 
  | 'formal'      // Clean lines, minimal shadow
  | 'informal'    // Rounded corners, soft gradients
  | 'semiformal'  // Balanced combination
  | 'biasa'       // Simple solid borders
  | 'keren'       // Gradient borders dengan glow
  | 'particle';   // Full effect dengan particle system

export interface BorderDesignToken {
  id: string;
  name: string;
  category: BorderCategory;
  className: string;
  // Structural properties
  borderRadius: string;    // 4px - 24px
  borderWidth: string;   // 1px - 6px
  borderStyle: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  // Colors
  colors: {
    primary: string;       // Main border color
    secondary?: string;  // Accent/gradient second color
    glow?: string;       // Glow/shadow color
  };
  // Animations - 60fps optimized
  animations?: {
    name: string;
    duration: string;      // 0.3s - 2s
    timing: string;        // cubic-bezier values
    delay?: string;
    iteration?: 'infinite' | number;
  }[];
  // Shadow effects
  shadow?: {
    x: string;
    y: string;
    blur: string;
    spread: string;
    color: string;
    inset?: boolean;
  };
  // Pseudo elements
  pseudo?: {
    before?: PseudoConfig;
    after?: PseudoConfig;
  };
  // Performance
  willChange?: string[];
  transform?: string;
  filter?: string;
}

interface PseudoConfig {
  content: string;
  position: 'absolute' | 'relative' | 'fixed';
  inset?: string;
  width?: string;
  height?: string;
  background?: string;
  border?: string;
  borderRadius?: string;
  animation?: string;
}

// ============================================
// DESIGN TOKENS - 6 Categories
// ============================================

export function generateBorderTokens(primaryColor: string, accentColor: string): BorderDesignToken[] {
  const tokens: BorderDesignToken[] = [];
  
  // ============================================
  // 1. FORMAL - Clean lines, minimal shadow
  // ============================================
  tokens.push(
    {
      id: 'formal-executive',
      name: 'Executive Thin',
      category: 'formal',
      className: 'lq-border-formal-executive',
      borderRadius: '4px',
      borderWidth: '1px',
      borderStyle: 'solid',
      colors: { primary: primaryColor },
      shadow: { x: '0', y: '1px', blur: '2px', spread: '0', color: 'rgba(0,0,0,0.04)' },
      willChange: ['box-shadow']
    },
    {
      id: 'formal-corporate',
      name: 'Corporate Standard',
      category: 'formal',
      className: 'lq-border-formal-corporate',
      borderRadius: '8px',
      borderWidth: '2px',
      borderStyle: 'solid',
      colors: { primary: primaryColor },
      shadow: { x: '0', y: '2px', blur: '4px', spread: '0', color: 'rgba(0,0,0,0.06)' },
      willChange: ['box-shadow']
    },
    {
      id: 'formal-premium',
      name: 'Premium Edge',
      category: 'formal',
      className: 'lq-border-formal-premium',
      borderRadius: '12px',
      borderWidth: '3px',
      borderStyle: 'solid',
      colors: { primary: primaryColor, secondary: '#ffffff' },
      shadow: { x: '0', y: '4px', blur: '12px', spread: '0', color: 'rgba(0,0,0,0.08)' },
      willChange: ['box-shadow']
    },
    {
      id: 'formal-minimal',
      name: 'Minimal Dot',
      category: 'formal',
      className: 'lq-border-formal-minimal',
      borderRadius: '16px',
      borderWidth: '2px',
      borderStyle: 'dotted',
      colors: { primary: primaryColor },
      willChange: ['border-color']
    },
    {
      id: 'formal-double',
      name: 'Double Frame',
      category: 'formal',
      className: 'lq-border-formal-double',
      borderRadius: '8px',
      borderWidth: '4px',
      borderStyle: 'double',
      colors: { primary: primaryColor },
      shadow: { x: '0', y: '3px', blur: '6px', spread: '0', color: 'rgba(0,0,0,0.06)' },
      willChange: ['box-shadow']
    }
  );
  
  return tokens;
}

// ============================================
// CSS Generator for Design Tokens
// ============================================

export function generateTokenCSS(tokens: BorderDesignToken[]): string {
  return tokens.map(token => {
    const selector = `.${token.className}`;
    let css = `${selector} .lq-avatar-wrapper {`;
    
    // Base styles
    css += `\n  border-radius: ${token.borderRadius};`;
    css += `\n  border: ${token.borderWidth} ${token.borderStyle} ${token.colors.primary};`;
    
    // Secondary color / gradient
    if (token.colors.secondary) {
      css += `\n  background: linear-gradient(135deg, ${token.colors.primary}20, ${token.colors.secondary}20);`;
    }
    
    // Shadow
    if (token.shadow) {
      const { x, y, blur, spread, color, inset } = token.shadow;
      const insetStr = inset ? 'inset ' : '';
      css += `\n  box-shadow: ${insetStr}${x} ${y} ${blur} ${spread} ${color};`;
    }
    
    // Transform & Filter
    if (token.transform) {
      css += `\n  transform: ${token.transform};`;
    }
    if (token.filter) {
      css += `\n  filter: ${token.filter};`;
    }
    
    // Performance
    if (token.willChange && token.willChange.length > 0) {
      css += `\n  will-change: ${token.willChange.join(', ')};`;
    }
    
    css += '\n}\n';
    
    // Animations
    if (token.animations && token.animations.length > 0) {
      token.animations.forEach(anim => {
        css += `${selector} .lq-avatar-wrapper {\n`;
        css += `  animation: ${anim.name} ${anim.duration} ${anim.timing} ${anim.iteration || 'infinite'}${anim.delay ? ` ${anim.delay}` : ''};\n`;
        css += `}\n`;
      });
    }
    
    // Pseudo elements
    if (token.pseudo) {
      if (token.pseudo.before) {
        css += `${selector} .lq-avatar-wrapper::before {\n`;
        css += `  content: ${token.pseudo.before.content};\n`;
        css += `  position: ${token.pseudo.before.position};\n`;
        if (token.pseudo.before.inset) css += `  inset: ${token.pseudo.before.inset};\n`;
        if (token.pseudo.before.width) css += `  width: ${token.pseudo.before.width};\n`;
        if (token.pseudo.before.height) css += `  height: ${token.pseudo.before.height};\n`;
        if (token.pseudo.before.background) css += `  background: ${token.pseudo.before.background};\n`;
        if (token.pseudo.before.border) css += `  border: ${token.pseudo.before.border};\n`;
        if (token.pseudo.before.borderRadius) css += `  border-radius: ${token.pseudo.before.borderRadius};\n`;
        if (token.pseudo.before.animation) css += `  animation: ${token.pseudo.before.animation};\n`;
        css += `}\n`;
      }
      if (token.pseudo.after) {
        css += `${selector} .lq-avatar-wrapper::after {\n`;
        css += `  content: ${token.pseudo.after.content};\n`;
        css += `  position: ${token.pseudo.after.position};\n`;
        if (token.pseudo.after.inset) css += `  inset: ${token.pseudo.after.inset};\n`;
        if (token.pseudo.after.width) css += `  width: ${token.pseudo.after.width};\n`;
        if (token.pseudo.after.height) css += `  height: ${token.pseudo.after.height};\n`;
        if (token.pseudo.after.background) css += `  background: ${token.pseudo.after.background};\n`;
        if (token.pseudo.after.border) css += `  border: ${token.pseudo.after.border};\n`;
        if (token.pseudo.after.borderRadius) css += `  border-radius: ${token.pseudo.after.borderRadius};\n`;
        if (token.pseudo.after.animation) css += `  animation: ${token.pseudo.after.animation};\n`;
        css += `}\n`;
      }
    }
    
    return css;
  }).join('\n');
}

// ============================================
// Animation Keyframes Library
// ============================================

export const ANIMATION_KEYFRAMES = `
/* Border Drawing Effect */
@keyframes border-draw {
  0% { clip-path: polygon(0 0, 0 0, 0 0, 0 0); }
  25% { clip-path: polygon(0 0, 100% 0, 100% 0, 0 0); }
  50% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
  75% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
  100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
}

/* Gradient Shift */
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Shadow Pulse */
@keyframes shadow-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.4); }
  50% { box-shadow: 0 0 20px 10px rgba(var(--primary-rgb), 0); }
}

/* Border Rotate */
@keyframes border-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Morphing Border Radius */
@keyframes morph-radius {
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
}

/* Shimmer Effect */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Breathe Animation */
@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.03); opacity: 0.95; }
}
`;

// Export all
export default {
  generateBorderTokens,
  generateTokenCSS,
  ANIMATION_KEYFRAMES
};
