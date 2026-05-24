// src/lib/cursorSystem.ts
// Robust cursor effects system with GPU acceleration

export interface CursorConfig {
  type: 'none' | 'glow' | 'sparkle' | 'trail';
  color: string;
  size?: number;
  opacity?: number;
}

// CSS for cursor effects - injected into page
export function generateCursorCSS(config: CursorConfig): string {
  if (config.type === 'none') return '';
  
  const color = config.color || '#6366f1';
  const size = config.size || 30;
  const opacity = config.opacity || 0.8;
  
  let css = `
/* Cursor Effects System */
.lq-cursor-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999999;
}
`;

  if (config.type === 'glow') {
    css += `
.lq-cursor-glow {
  position: absolute;
  width: ${size}px;
  height: ${size}px;
  background: radial-gradient(circle, ${color} 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(1);
  opacity: ${opacity};
  filter: blur(4px);
  box-shadow: 
    0 0 20px ${color},
    0 0 40px ${color}80,
    0 0 60px ${color}40;
  transition: transform 0.15s ease-out, opacity 0.2s ease;
  will-change: transform, opacity;
  pointer-events: none;
}

.lq-cursor-glow.clicking {
  transform: translate(-50%, -50%) scale(0.6);
  opacity: ${opacity * 1.5};
}

.lq-cursor-glow-ring {
  position: absolute;
  width: ${size * 1.5}px;
  height: ${size * 1.5}px;
  border: 2px solid ${color}40;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: lq-cursor-pulse 2s ease-out infinite;
  pointer-events: none;
}

@keyframes lq-cursor-pulse {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
}
`;
  }
  
  if (config.type === 'sparkle') {
    css += `
.lq-cursor-sparkle {
  position: absolute;
  width: ${size}px;
  height: ${size}px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.lq-cursor-sparkle::before,
.lq-cursor-sparkle::after {
  content: '';
  position: absolute;
  background: ${color};
  border-radius: 50%;
}

.lq-cursor-sparkle::before {
  width: 100%;
  height: 20%;
  top: 40%;
  left: 0;
  box-shadow: 0 0 10px ${color}, 0 0 20px ${color}80;
}

.lq-cursor-sparkle::after {
  width: 20%;
  height: 100%;
  top: 0;
  left: 40%;
  box-shadow: 0 0 10px ${color}, 0 0 20px ${color}80;
}

.lq-cursor-trail {
  position: absolute;
  width: 8px;
  height: 8px;
  background: ${color};
  border-radius: 50%;
  pointer-events: none;
  animation: lq-trail-fade 0.6s ease-out forwards;
  box-shadow: 0 0 6px ${color};
}

@keyframes lq-trail-fade {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0); opacity: 0; }
}
`;
  }
  
  return css;
}

// JavaScript for cursor tracking
export function generateCursorJS(config: CursorConfig): string {
  if (config.type === 'none') return '';
  
  if (config.type === 'glow') {
    return `
(function(){
  var wrapper = document.createElement('div');
  wrapper.className = 'lq-cursor-wrapper';
  wrapper.innerHTML = '<div class="lq-cursor-glow-ring"></div><div class="lq-cursor-glow"></div>';
  document.body.appendChild(wrapper);
  
  var glow = wrapper.querySelector('.lq-cursor-glow');
  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var currentX = mouseX;
  var currentY = mouseY;
  var isMoving = false;
  var moveTimeout;
  
  document.addEventListener('mousemove', function(e){
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(function(){ isMoving = false; }, 100);
  }, {passive: true});
  
  document.addEventListener('mousedown', function(){ glow.classList.add('clicking'); });
  document.addEventListener('mouseup', function(){ glow.classList.remove('clicking'); });
  
  function animate(){
    var dx = mouseX - currentX;
    var dy = mouseY - currentY;
    currentX += dx * 0.15;
    currentY += dy * 0.15;
    
    glow.style.left = currentX + 'px';
    glow.style.top = currentY + 'px';
    
    requestAnimationFrame(animate);
  }
  animate();
})();
`;
  }
  
  if (config.type === 'sparkle') {
    return `
(function(){
  var wrapper = document.createElement('div');
  wrapper.className = 'lq-cursor-wrapper';
  wrapper.innerHTML = '<div class="lq-cursor-sparkle"></div>';
  document.body.appendChild(wrapper);
  
  var sparkle = wrapper.querySelector('.lq-cursor-sparkle');
  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  
  document.addEventListener('mousemove', function(e){
    mouseX = e.clientX;
    mouseY = e.clientY;
    sparkle.style.left = mouseX + 'px';
    sparkle.style.top = mouseY + 'px';
    
    // Create trail
    var trail = document.createElement('div');
    trail.className = 'lq-cursor-trail';
    trail.style.left = mouseX + 'px';
    trail.style.top = mouseY + 'px';
    wrapper.appendChild(trail);
    setTimeout(function(){ trail.remove(); }, 600);
  }, {passive: true});
})();
`;
  }
  
  return '';
}

// Design Token System for Borders
export interface BorderDesignToken {
  name: string;
  category: 'formal' | 'informal' | 'semiformal' | 'biasa' | 'keren' | 'particle';
  className: string;
  borderRadius: string;
  borderWidth: string;
  borderStyle: string;
  colors: {
    primary: string;
    secondary?: string;
    glow?: string;
  };
  animations?: {
    name: string;
    duration: string;
    timing: string;
    delay?: string;
  }[];
  shadow?: {
    x: string;
    y: string;
    blur: string;
    spread: string;
    color: string;
  };
}

// Generate design tokens for all 6 categories
export function generateBorderDesignTokens(primaryColor: string, accentColor: string): BorderDesignToken[] {
  const tokens: BorderDesignToken[] = [];
  
  // FORMAL - Clean lines, minimal shadow
  tokens.push(
    {
      name: 'Executive Thin',
      category: 'formal',
      className: 'lq-border-formal-executive-thin',
      borderRadius: '4px',
      borderWidth: '1px',
      borderStyle: 'solid',
      colors: { primary: primaryColor },
      shadow: { x: '0', y: '1px', blur: '2px', spread: '0', color: 'rgba(0,0,0,0.05)' }
    },
    {
      name: 'Corporate Standard',
      category: 'formal',
      className: 'lq-border-formal-corporate',
      borderRadius: '8px',
      borderWidth: '2px',
      borderStyle: 'solid',
      colors: { primary: primaryColor },
      shadow: { x: '0', y: '2px', blur: '4px', spread: '0', color: 'rgba(0,0,0,0.08)' }
    },
    {
      name: 'Premium Edge',
      category: 'formal',
      className: 'lq-border-formal-premium',
      borderRadius: '12px',
      borderWidth: '3px',
      borderStyle: 'solid',
      colors: { primary: primaryColor, secondary: '#ffffff' },
      shadow: { x: '0', y: '4px', blur: '12px', spread: '0', color: 'rgba(0,0,0,0.1)' }
    },
    {
      name: 'Minimal Dot',
      category: 'formal',
      className: 'lq-border-formal-minimal-dot',
      borderRadius: '16px',
      borderWidth: '2px',
      borderStyle: 'dotted',
      colors: { primary: primaryColor },
      shadow: { x: '0', y: '0', blur: '0', spread: '0', color: 'transparent' }
    },
    {
      name: 'Double Frame',
      category: 'formal',
      className: 'lq-border-formal-double-frame',
      borderRadius: '8px',
      borderWidth: '4px',
      borderStyle: 'double',
      colors: { primary: primaryColor },
      shadow: { x: '0', y: '3px', blur: '6px', spread: '0', color: 'rgba(0,0,0,0.08)' }
    }
  );
  
  // INFORMAL - Rounded corners, soft gradients
  tokens.push(
    {
      name: 'Soft Pill',
      category: 'informal',
      className: 'lq-border-informal-soft-pill',
      borderRadius: '999px',
      borderWidth: '2px',
      borderStyle: 'solid',
      colors: { primary: primaryColor, secondary: accentColor },
      animations: [{ name: 'soft-pulse', duration: '3s', timing: 'ease-in-out' }]
    },
    {
      name: 'Bubble Pop',
      category: 'informal',
      className: 'lq-border-informal-bubble',
      borderRadius: '24px 24px 24px 4px',
      borderWidth: '3px',
      borderStyle: 'solid',
      colors: { primary: primaryColor },
      animations: [{ name: 'bubble-bounce', duration: '2s', timing: 'ease' }]
    },
    {
      name: 'Candy Stripe',
      category: 'informal',
      className: 'lq-border-informal-candy',
      borderRadius: '16px',
      borderWidth: '4px',
      borderStyle: 'solid',
      colors: { primary: primaryColor, secondary: accentColor },
      animations: [{ name: 'candy-rotate', duration: '10s', timing: 'linear' }]
    },
    {
      name: 'Cloud Float',
      category: 'informal',
      className: 'lq-border-informal-cloud',
      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
      borderWidth: '2px',
      borderStyle: 'solid',
      colors: { primary: primaryColor },
      animations: [{ name: 'cloud-float', duration: '4s', timing: 'ease-in-out' }]
    },
    {
      name: 'Wave Flow',
      category: 'informal',
      className: 'lq-border-informal-wave',
      borderRadius: '50%',
      borderWidth: '3px',
      borderStyle: 'solid',
      colors: { primary: primaryColor, secondary: accentColor },
      animations: [{ name: 'wave-flow', duration: '3s', timing: 'ease' }]
    }
  );
  
  return tokens;
}

// Generate complete CSS for all border tokens
export function generateBorderTokensCSS(tokens: BorderDesignToken[]): string {
  return tokens.map(token => {
    let css = `
/* ${token.name} - ${token.category} */
.${token.className} .lq-avatar-wrapper {
  border-radius: ${token.borderRadius};
  border: ${token.borderWidth} ${token.borderStyle} ${token.colors.primary};
`;

    if (token.shadow) {
      css += `  box-shadow: ${token.shadow.x} ${token.shadow.y} ${token.shadow.blur} ${token.shadow.spread} ${token.shadow.color};
`;
    }

    if (token.colors.secondary) {
      css += `  background: linear-gradient(135deg, ${token.colors.primary}20, ${token.colors.secondary}20);
`;
    }

    css += `}
`;

    if (token.animations) {
      token.animations.forEach(anim => {
        css += `
.${token.className} .lq-avatar-wrapper {
  animation: ${anim.name} ${anim.duration} ${anim.timing} infinite${anim.delay ? ` ${anim.delay}` : ''};
}
`;
      });
    }

    return css;
  }).join('\n');
}

// Keyframe animations for borders
export const BORDER_ANIMATIONS = `
@keyframes soft-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.02); opacity: 0.9; }
}

@keyframes bubble-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

@keyframes candy-rotate {
  from { background-position: 0 0; }
  to { background-position: 20px 0; }
}

@keyframes cloud-float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-5px) scale(1.01); }
}

@keyframes wave-flow {
  0%, 100% { border-radius: 50%; }
  25% { border-radius: 45% 55% 50% 50%; }
  50% { border-radius: 50% 50% 45% 55%; }
  75% { border-radius: 55% 45% 50% 50%; }
}
`;
