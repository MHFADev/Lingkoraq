// src/lib/cursorEffects.ts
// 10 Premium Cursor Effects - Non-intrusive, keeps default cursor visible

export type CursorEffectType = 
  | 'ring-halo'
  | 'trail-dots'
  | 'magnetic-snap'
  | 'ripple-wave'
  | 'neon-glow'
  | 'particle-burst'
  | 'spotlight'
  | 'outline-stroke'
  | 'compass-nav'
  | 'ghost-trail';

export interface CursorEffectConfig {
  type: CursorEffectType;
  primaryColor: string;
  accentColor?: string;
  size?: number;
  opacity?: number;
}

// ============================================
// 1. RING HALO - Elegant circular halo
// ============================================
function generateRingHaloCSS(config: CursorEffectConfig): string {
  const color = config.primaryColor;
  const size = config.size || 40;
  
  return `
.lq-cursor-ring-halo {
  position: fixed;
  width: ${size}px;
  height: ${size}px;
  pointer-events: none;
  z-index: 999999;
  transform: translate(-50%, -50%);
  will-change: transform;
}

.lq-cursor-ring-halo::before,
.lq-cursor-ring-halo::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid ${color};
  opacity: 0.6;
  animation: lq-ring-pulse 2s ease-out infinite;
}

.lq-cursor-ring-halo::after {
  animation-delay: 1s;
  border-width: 1px;
  opacity: 0.3;
}

@keyframes lq-ring-pulse {
  0% { transform: scale(0.8); opacity: 0.6; }
  100% { transform: scale(1.5); opacity: 0; }
}
`;
}

function generateRingHaloJS(): string {
  return `
(function(){
  var halo = document.createElement('div');
  halo.className = 'lq-cursor-ring-halo';
  document.body.appendChild(halo);
  
  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var currentX = mouseX;
  var currentY = mouseY;
  
  document.addEventListener('mousemove', function(e){
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, {passive: true});
  
  function animate(){
    var dx = mouseX - currentX;
    var dy = mouseY - currentY;
    currentX += dx * 0.12;
    currentY += dy * 0.12;
    
    halo.style.left = currentX + 'px';
    halo.style.top = currentY + 'px';
    
    requestAnimationFrame(animate);
  }
  animate();
})();
`;
}

// ============================================
// 2. TRAIL DOTS - Follower dots trail
// ============================================
function generateTrailDotsCSS(config: CursorEffectConfig): string {
  const color = config.primaryColor;
  
  return `
.lq-cursor-trail-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999999;
}

.lq-cursor-trail-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  background: ${color};
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(1);
  opacity: 0.8;
  box-shadow: 0 0 10px ${color}60;
  animation: lq-trail-fade 0.6s ease-out forwards;
  will-change: transform, opacity;
}

@keyframes lq-trail-fade {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
  100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
}
`;
}

function generateTrailDotsJS(): string {
  return `
(function(){
  var container = document.createElement('div');
  container.className = 'lq-cursor-trail-container';
  document.body.appendChild(container);
  
  var lastDot = 0;
  var minDistance = 15;
  
  document.addEventListener('mousemove', function(e){
    var now = Date.now();
    if (now - lastDot < 20) return;
    lastDot = now;
    
    var dot = document.createElement('div');
    dot.className = 'lq-cursor-trail-dot';
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    container.appendChild(dot);
    
    setTimeout(function(){ dot.remove(); }, 600);
  }, {passive: true});
})();
`;
}

// ============================================
// 3. MAGNETIC SNAP - Snap to elements
// ============================================
function generateMagneticSnapCSS(config: CursorEffectConfig): string {
  const color = config.primaryColor;
  const size = config.size || 24;
  
  return `
.lq-cursor-magnetic {
  position: fixed;
  width: ${size}px;
  height: ${size}px;
  pointer-events: none;
  z-index: 999999;
  transform: translate(-50%, -50%);
  transition: transform 0.15s ease-out, width 0.2s, height 0.2s;
  will-change: transform, width, height;
}

.lq-cursor-magnetic::before {
  content: '';
  position: absolute;
  inset: 0;
  border: 2px solid ${color};
  border-radius: 50%;
  opacity: 0.8;
  transition: all 0.2s ease;
}

.lq-cursor-magnetic::after {
  content: '';
  position: absolute;
  inset: 4px;
  background: ${color}40;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.lq-cursor-magnetic.snapping {
  width: ${size * 1.5}px;
  height: ${size * 1.5}px;
}

.lq-cursor-magnetic.snapping::after {
  opacity: 1;
}

.lq-magnetic-target {
  cursor: none !important;
}
`;
}

function generateMagneticSnapJS(): string {
  return `
(function(){
  var magnetic = document.createElement('div');
  magnetic.className = 'lq-cursor-magnetic';
  document.body.appendChild(magnetic);
  
  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var currentX = mouseX;
  var currentY = mouseY;
  var isSnapping = false;
  
  // Find magnetic targets
  var targets = [];
  function findTargets(){
    targets = [];
    var buttons = document.querySelectorAll('.lq-btn, .lq-share-btn, a[href]');
    buttons.forEach(function(btn){
      var rect = btn.getBoundingClientRect();
      targets.push({
        element: btn,
        rect: rect,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
        radius: Math.max(rect.width, rect.height) / 2 + 30
      });
      btn.classList.add('lq-magnetic-target');
    });
  }
  
  setTimeout(findTargets, 500);
  
  document.addEventListener('mousemove', function(e){
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Check for magnetic snap
    isSnapping = false;
    for (var i = 0; i < targets.length; i++) {
      var t = targets[i];
      var dx = mouseX - t.centerX;
      var dy = mouseY - t.centerY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < t.radius) {
        isSnapping = true;
        mouseX = t.centerX;
        mouseY = t.centerY;
        break;
      }
    }
  }, {passive: true});
  
  function animate(){
    var dx = mouseX - currentX;
    var dy = mouseY - currentY;
    
    if (isSnapping) {
      currentX += dx * 0.2;
      currentY += dy * 0.2;
      magnetic.classList.add('snapping');
    } else {
      currentX += dx * 0.15;
      currentY += dy * 0.15;
      magnetic.classList.remove('snapping');
    }
    
    magnetic.style.left = currentX + 'px';
    magnetic.style.top = currentY + 'px';
    
    requestAnimationFrame(animate);
  }
  animate();
})();
`;
}

// ============================================
// 4. RIPPLE WAVE - Expanding rings on click
// ============================================
function generateRippleWaveCSS(config: CursorEffectConfig): string {
  const color = config.primaryColor;
  
  return `
.lq-cursor-ripple-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999998;
}

.lq-cursor-ripple {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid ${color};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.6;
  animation: lq-ripple-expand 0.8s ease-out forwards;
  pointer-events: none;
}

.lq-cursor-ripple:nth-child(2) {
  animation-delay: 0.1s;
}

.lq-cursor-ripple:nth-child(3) {
  animation-delay: 0.2s;
}

@keyframes lq-ripple-expand {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  100% {
    transform: translate(-50%, -50%) scale(4);
    opacity: 0;
  }
}

.lq-cursor-hover-ring {
  position: fixed;
  width: 40px;
  height: 40px;
  border: 1px solid ${color}60;
  border-radius: 50%;
  pointer-events: none;
  z-index: 999999;
  transform: translate(-50%, -50%);
  transition: width 0.2s, height 0.2s, border-color 0.2s;
  will-change: transform, width, height;
}

.lq-cursor-hover-ring.expanded {
  width: 60px;
  height: 60px;
  border-color: ${color};
}
`;
}

function generateRippleWaveJS(): string {
  return `
(function(){
  // Create hover ring
  var hoverRing = document.createElement('div');
  hoverRing.className = 'lq-cursor-hover-ring';
  document.body.appendChild(hoverRing);
  
  // Create ripple container
  var rippleContainer = document.createElement('div');
  rippleContainer.className = 'lq-cursor-ripple-container';
  document.body.appendChild(rippleContainer);
  
  var mouseX = 0, mouseY = 0;
  var currentX = 0, currentY = 0;
  var lastClick = 0;
  
  document.addEventListener('mousemove', function(e){
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, {passive: true});
  
  // Click ripple
  document.addEventListener('click', function(e){
    var now = Date.now();
    if (now - lastClick < 50) return;
    lastClick = now;
    
    for (var i = 0; i < 3; i++) {
      setTimeout(function(){
        var ripple = document.createElement('div');
        ripple.className = 'lq-cursor-ripple';
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        rippleContainer.appendChild(ripple);
        
        setTimeout(function(){ ripple.remove(); }, 800);
      }, i * 100);
    }
  }, {passive: true});
  
  // Hover detection
  var hoverTargets = [];
  function updateTargets(){
    hoverTargets = [];
    var targets = document.querySelectorAll('.lq-btn, .lq-share-btn, a, button');
    targets.forEach(function(t){
      var rect = t.getBoundingClientRect();
      hoverTargets.push({
        rect: rect,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2
      });
    });
  }
  
  setTimeout(updateTargets, 500);
  setInterval(updateTargets, 2000);
  
  function animate(){
    // Smooth follow
    var dx = mouseX - currentX;
    var dy = mouseY - currentY;
    currentX += dx * 0.18;
    currentY += dy * 0.18;
    
    hoverRing.style.left = currentX + 'px';
    hoverRing.style.top = currentY + 'px';
    
    // Check hover
    var isHovering = false;
    for (var i = 0; i < hoverTargets.length; i++) {
      var t = hoverTargets[i];
      var dist = Math.sqrt(Math.pow(currentX - t.centerX, 2) + Math.pow(currentY - t.centerY, 2));
      if (dist < 50) {
        isHovering = true;
        break;
      }
    }
    
    if (isHovering) {
      hoverRing.classList.add('expanded');
    } else {
      hoverRing.classList.remove('expanded');
    }
    
    requestAnimationFrame(animate);
  }
  animate();
})();
`;
}

// ============================================
// 5. NEON GLOW - Vibrant neon effect
// ============================================
function generateNeonGlowCSS(config: CursorEffectConfig): string {
  const color = config.primaryColor;
  const accent = config.accentColor || color;
  
  return `
.lq-cursor-neon {
  position: fixed;
  width: 24px;
  height: 24px;
  pointer-events: none;
  z-index: 999999;
  transform: translate(-50%, -50%);
  will-change: transform;
}

.lq-cursor-neon::before {
  content: '';
  position: absolute;
  inset: 0;
  background: ${color};
  border-radius: 50%;
  filter: blur(8px);
  opacity: 0.8;
  animation: lq-neon-pulse 1.5s ease-in-out infinite;
}

.lq-cursor-neon::after {
  content: '';
  position: absolute;
  inset: 4px;
  background: ${accent};
  border-radius: 50%;
  box-shadow: 
    0 0 10px ${color},
    0 0 20px ${color}80,
    0 0 30px ${color}40;
}

@keyframes lq-neon-pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 0.6; }
}

.lq-cursor-neon-spark {
  position: absolute;
  width: 4px;
  height: 4px;
  background: ${accent};
  border-radius: 50%;
  pointer-events: none;
  animation: lq-neon-spark 0.4s ease-out forwards;
}

@keyframes lq-neon-spark {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
}
`;
}

function generateNeonGlowJS(): string {
  return `
(function(){
  var neon = document.createElement('div');
  neon.className = 'lq-cursor-neon';
  document.body.appendChild(neon);
  
  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var currentX = mouseX;
  var currentY = mouseY;
  var lastSpark = 0;
  
  document.addEventListener('mousemove', function(e){
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Create spark
    var now = Date.now();
    if (now - lastSpark > 50) {
      lastSpark = now;
      var spark = document.createElement('div');
      spark.className = 'lq-cursor-neon-spark';
      spark.style.left = e.clientX + 'px';
      spark.style.top = e.clientY + 'px';
      document.body.appendChild(spark);
      setTimeout(function(){ spark.remove(); }, 400);
    }
  }, {passive: true});
  
  function animate(){
    var dx = mouseX - currentX;
    var dy = mouseY - currentY;
    currentX += dx * 0.15;
    currentY += dy * 0.15;
    
    neon.style.left = currentX + 'px';
    neon.style.top = currentY + 'px';
    
    requestAnimationFrame(animate);
  }
  animate();
})();
`;
}

// ============================================
// 6. PARTICLE BURST - Explosive particles
// ============================================
function generateParticleBurstCSS(config: CursorEffectConfig): string {
  const color = config.primaryColor;
  
  return `
.lq-cursor-particle-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999998;
}

.lq-cursor-particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: ${color};
  border-radius: 50%;
  pointer-events: none;
  will-change: transform, opacity;
}

.lq-cursor-core {
  position: fixed;
  width: 12px;
  height: 12px;
  background: ${color};
  border-radius: 50%;
  pointer-events: none;
  z-index: 999999;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 15px ${color}80, 0 0 30px ${color}40;
  will-change: transform;
}
`;
}

function generateParticleBurstJS(): string {
  return `
(function(){
  var container = document.createElement('div');
  container.className = 'lq-cursor-particle-container';
  document.body.appendChild(container);
  
  var core = document.createElement('div');
  core.className = 'lq-cursor-core';
  document.body.appendChild(core);
  
  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var currentX = mouseX;
  var currentY = mouseY;
  var lastBurst = 0;
  var particles = [];
  
  function createParticle(x, y, angle, speed) {
    var p = document.createElement('div');
    p.className = 'lq-cursor-particle';
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    container.appendChild(p);
    
    var vx = Math.cos(angle) * speed;
    var vy = Math.sin(angle) * speed;
    var life = 1;
    
    return {
      element: p,
      x: x,
      y: y,
      vx: vx,
      vy: vy,
      life: life,
      update: function() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.02;
        this.vx *= 0.98;
        this.vy *= 0.98;
        
        this.element.style.transform = 'translate(-50%, -50%)';
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.element.style.opacity = this.life;
        
        return this.life > 0;
      }
    };
  }
  
  document.addEventListener('mousemove', function(e){
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Particle burst on movement
    var now = Date.now();
    if (now - lastBurst > 50) {
      lastBurst = now;
      var angle = Math.random() * Math.PI * 2;
      var speed = 2 + Math.random() * 3;
      particles.push(createParticle(e.clientX, e.clientY, angle, speed));
    }
  }, {passive: true});
  
  // Click burst
  document.addEventListener('click', function(e){
    for (var i = 0; i < 12; i++) {
      var angle = (i / 12) * Math.PI * 2;
      var speed = 4 + Math.random() * 2;
      particles.push(createParticle(e.clientX, e.clientY, angle, speed));
    }
  }, {passive: true});
  
  function animate(){
    // Update core position
    var dx = mouseX - currentX;
    var dy = mouseY - currentY;
    currentX += dx * 0.12;
    currentY += dy * 0.12;
    
    core.style.left = currentX + 'px';
    core.style.top = currentY + 'px';
    
    // Update particles
    for (var i = particles.length - 1; i >= 0; i--) {
      if (!particles[i].update()) {
        particles[i].element.remove();
        particles.splice(i, 1);
      }
    }
    
    requestAnimationFrame(animate);
  }
  animate();
})();
`;
}

// ============================================
// 7. SPOTLIGHT - Illumination effect
// ============================================
function generateSpotlightCSS(config: CursorEffectConfig): string {
  const color = config.primaryColor;
  
  return `
.lq-cursor-spotlight {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999997;
  background: radial-gradient(
    circle 150px at var(--spotlight-x, 50%) var(--spotlight-y, 50%),
    transparent 0%,
    rgba(0,0,0,0.15) 100%
  );
  transition: background 0.1s ease-out;
}

.lq-cursor-spotlight-beam {
  position: fixed;
  width: 4px;
  height: 100px;
  background: linear-gradient(to bottom, ${color}, transparent);
  pointer-events: none;
  z-index: 999998;
  transform: translate(-50%, -50%) rotate(45deg);
  opacity: 0.3;
  will-change: transform, opacity;
}
`;
}

function generateSpotlightJS(): string {
  return `
(function(){
  var spotlight = document.createElement('div');
  spotlight.className = 'lq-cursor-spotlight';
  document.body.appendChild(spotlight);
  
  var beam = document.createElement('div');
  beam.className = 'lq-cursor-spotlight-beam';
  document.body.appendChild(beam);
  
  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var currentX = mouseX;
  var currentY = mouseY;
  
  document.addEventListener('mousemove', function(e){
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Update spotlight gradient position
    var xPercent = (mouseX / window.innerWidth) * 100;
    var yPercent = (mouseY / window.innerHeight) * 100;
    spotlight.style.setProperty('--spotlight-x', xPercent + '%');
    spotlight.style.setProperty('--spotlight-y', yPercent + '%');
  }, {passive: true});
  
  function animate(){
    var dx = mouseX - currentX;
    var dy = mouseY - currentY;
    currentX += dx * 0.1;
    currentY += dy * 0.1;
    
    beam.style.left = currentX + 'px';
    beam.style.top = currentY + 'px';
    
    // Rotate beam based on movement direction
    var angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    beam.style.transform = 'translate(-50%, -50%) rotate(' + angle + 'deg)';
    
    // Fade based on movement speed
    var speed = Math.sqrt(dx * dx + dy * dy);
    var opacity = Math.min(speed / 20, 0.5);
    beam.style.opacity = opacity;
    
    requestAnimationFrame(animate);
  }
  animate();
})();
`;
}

// ============================================
// 8. OUTLINE STROKE - Animated border stroke
// ============================================
function generateOutlineStrokeCSS(config: CursorEffectConfig): string {
  const color = config.primaryColor;
  
  return `
.lq-cursor-outline {
  position: fixed;
  width: 32px;
  height: 32px;
  pointer-events: none;
  z-index: 999999;
  transform: translate(-50%, -50%);
  will-change: transform;
}

.lq-cursor-outline svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.lq-cursor-outline-circle {
  fill: none;
  stroke: ${color};
  stroke-width: 2;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: lq-outline-draw 2s ease-in-out infinite;
  transform-origin: center;
}

@keyframes lq-outline-draw {
  0% {
    stroke-dashoffset: 100;
    transform: rotate(0deg);
  }
  50% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -100;
    transform: rotate(360deg);
  }
}

.lq-cursor-outline-corner {
  position: absolute;
  width: 8px;
  height: 8px;
  border: 2px solid ${color};
  opacity: 0;
  transition: all 0.3s ease;
}

.lq-cursor-outline-corner.top-left {
  top: -4px;
  left: -4px;
  border-right: 0;
  border-bottom: 0;
}

.lq-cursor-outline-corner.top-right {
  top: -4px;
  right: -4px;
  border-left: 0;
  border-bottom: 0;
}

.lq-cursor-outline-corner.bottom-left {
  bottom: -4px;
  left: -4px;
  border-right: 0;
  border-top: 0;
}

.lq-cursor-outline-corner.bottom-right {
  bottom: -4px;
  right: -4px;
  border-left: 0;
  border-top: 0;
}

.lq-cursor-outline.hovering .lq-cursor-outline-corner {
  opacity: 1;
}
`;
}

function generateOutlineStrokeJS(): string {
  return `
(function(){
  var outline = document.createElement('div');
  outline.className = 'lq-cursor-outline';
  outline.innerHTML = 
    '<svg viewBox="0 0 32 32"><circle class="lq-cursor-outline-circle" cx="16" cy="16" r="14"/></svg>' +
    '<div class="lq-cursor-outline-corner top-left"></div>' +
    '<div class="lq-cursor-outline-corner top-right"></div>' +
    '<div class="lq-cursor-outline-corner bottom-left"></div>' +
    '<div class="lq-cursor-outline-corner bottom-right"></div>';
  document.body.appendChild(outline);
  
  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var currentX = mouseX;
  var currentY = mouseY;
  var isHovering = false;
  
  // Detect hover on interactive elements
  function checkHover(){
    var targets = document.querySelectorAll('.lq-btn, .lq-share-btn, a[href], button');
    var found = false;
    for (var i = 0; i < targets.length; i++) {
      var rect = targets[i].getBoundingClientRect();
      if (currentX >= rect.left && currentX <= rect.right &&
          currentY >= rect.top && currentY <= rect.bottom) {
        found = true;
        break;
      }
    }
    isHovering = found;
    if (isHovering) {
      outline.classList.add('hovering');
    } else {
      outline.classList.remove('hovering');
    }
  }
  
  setInterval(checkHover, 100);
  
  document.addEventListener('mousemove', function(e){
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, {passive: true});
  
  function animate(){
    var dx = mouseX - currentX;
    var dy = mouseY - currentY;
    currentX += dx * 0.15;
    currentY += dy * 0.15;
    
    outline.style.left = currentX + 'px';
    outline.style.top = currentY + 'px';
    
    requestAnimationFrame(animate);
  }
  animate();
})();
`;
}

// ============================================
// 9. COMPASS NAV - Directional indicator
// ============================================
function generateCompassNavCSS(config: CursorEffectConfig): string {
  const color = config.primaryColor;
  const accent = config.accentColor || color;
  
  return `
.lq-cursor-compass {
  position: fixed;
  width: 40px;
  height: 40px;
  pointer-events: none;
  z-index: 999999;
  transform: translate(-50%, -50%);
  will-change: transform;
}

.lq-cursor-compass-ring {
  position: absolute;
  inset: 0;
  border: 2px solid ${color}40;
  border-radius: 50%;
  border-top-color: ${color};
  animation: lq-compass-spin 3s linear infinite;
}

.lq-cursor-compass-inner {
  position: absolute;
  inset: 8px;
  border: 1px solid ${accent}60;
  border-radius: 50%;
  border-bottom-color: ${accent};
  animation: lq-compass-spin 2s linear infinite reverse;
}

.lq-cursor-compass-arrow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 10px solid ${color};
  transform: translate(-50%, -50%);
  filter: drop-shadow(0 0 4px ${color});
}

.lq-cursor-compass-directions {
  position: absolute;
  inset: 2px;
  pointer-events: none;
}

.lq-cursor-compass-dir {
  position: absolute;
  font-size: 8px;
  color: ${color}60;
  font-weight: 600;
  font-family: monospace;
}

.lq-cursor-compass-dir.n { top: 2px; left: 50%; transform: translateX(-50%); }
.lq-cursor-compass-dir.s { bottom: 2px; left: 50%; transform: translateX(-50%); }
.lq-cursor-compass-dir.e { right: 2px; top: 50%; transform: translateY(-50%); }
.lq-cursor-compass-dir.w { left: 2px; top: 50%; transform: translateY(-50%); }

@keyframes lq-compass-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;
}

function generateCompassNavJS(): string {
  return `
(function(){
  var compass = document.createElement('div');
  compass.className = 'lq-cursor-compass';
  compass.innerHTML = 
    '<div class="lq-cursor-compass-ring"></div>' +
    '<div class="lq-cursor-compass-inner"></div>' +
    '<div class="lq-cursor-compass-directions">' +
      '<span class="lq-cursor-compass-dir n">N</span>' +
      '<span class="lq-cursor-compass-dir s">S</span>' +
      '<span class="lq-cursor-compass-dir e">E</span>' +
      '<span class="lq-cursor-compass-dir w">W</span>' +
    '</div>' +
    '<div class="lq-cursor-compass-arrow"></div>';
  document.body.appendChild(compass);
  
  var arrow = compass.querySelector('.lq-cursor-compass-arrow');
  var inner = compass.querySelector('.lq-cursor-compass-inner');
  
  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var currentX = mouseX;
  var currentY = mouseY;
  var velocityX = 0;
  var velocityY = 0;
  
  document.addEventListener('mousemove', function(e){
    var newX = e.clientX;
    var newY = e.clientY;
    velocityX = newX - mouseX;
    velocityY = newY - mouseY;
    mouseX = newX;
    mouseY = newY;
  }, {passive: true});
  
  function animate(){
    var dx = mouseX - currentX;
    var dy = mouseY - currentY;
    currentX += dx * 0.12;
    currentY += dy * 0.12;
    
    compass.style.left = currentX + 'px';
    compass.style.top = currentY + 'px';
    
    // Calculate direction based on velocity
    var speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    if (speed > 1) {
      var angle = Math.atan2(velocityY, velocityX) * (180 / Math.PI) + 90;
      arrow.style.transform = 'translate(-50%, -50%) rotate(' + angle + 'deg)';
      
      // Rotate inner ring opposite direction
      inner.style.animation = 'none';
      inner.style.transform = 'rotate(' + (-angle) + 'deg)';
    }
    
    requestAnimationFrame(animate);
  }
  animate();
})();
`;
}

// ============================================
// 10. GHOST TRAIL - Fading ghost copies
// ============================================
function generateGhostTrailCSS(config: CursorEffectConfig): string {
  const color = config.primaryColor;
  
  return `
.lq-cursor-ghost-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999998;
}

.lq-cursor-ghost {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid ${color}60;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(1);
  opacity: 0.6;
  animation: lq-ghost-fade 0.8s ease-out forwards;
  will-change: transform, opacity;
}

.lq-cursor-ghost::before {
  content: '';
  position: absolute;
  inset: 4px;
  border: 1px solid ${color}40;
  border-radius: 50%;
}

@keyframes lq-ghost-fade {
  0% { 
    transform: translate(-50%, -50%) scale(1); 
    opacity: 0.6; 
  }
  100% { 
    transform: translate(-50%, -50%) scale(1.5); 
    opacity: 0; 
  }
}

.lq-cursor-ghost-main {
  position: fixed;
  width: 16px;
  height: 16px;
  border: 2px solid ${color};
  border-radius: 50%;
  pointer-events: none;
  z-index: 999999;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px ${color}60, inset 0 0 5px ${color}40;
  will-change: transform;
}

.lq-cursor-ghost-main::after {
  content: '';
  position: absolute;
  inset: 4px;
  background: ${color};
  border-radius: 50%;
  opacity: 0.3;
}
`;
}

function generateGhostTrailJS(): string {
  return `
(function(){
  var container = document.createElement('div');
  container.className = 'lq-cursor-ghost-container';
  document.body.appendChild(container);
  
  var main = document.createElement('div');
  main.className = 'lq-cursor-ghost-main';
  document.body.appendChild(main);
  
  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var positions = [];
  var maxGhosts = 8;
  
  document.addEventListener('mousemove', function(e){
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Add to position history
    positions.push({x: mouseX, y: mouseY, time: Date.now()});
    if (positions.length > maxGhosts) {
      positions.shift();
    }
    
    // Create ghost
    if (positions.length > 1) {
      var ghost = document.createElement('div');
      ghost.className = 'lq-cursor-ghost';
      var pos = positions[positions.length - 2];
      ghost.style.left = pos.x + 'px';
      ghost.style.top = pos.y + 'px';
      container.appendChild(ghost);
      
      setTimeout(function(){ ghost.remove(); }, 800);
    }
  }, {passive: true});
  
  function animate(){
    // Update main cursor position with smooth follow
    var targetX = mouseX;
    var targetY = mouseY;
    
    // Add slight lag for ghost effect
    var currentX = parseFloat(main.style.left) || targetX;
    var currentY = parseFloat(main.style.top) || targetY;
    
    var dx = targetX - currentX;
    var dy = targetY - currentY;
    
    currentX += dx * 0.15;
    currentY += dy * 0.15;
    
    main.style.left = currentX + 'px';
    main.style.top = currentY + 'px';
    
    requestAnimationFrame(animate);
  }
  animate();
})();
`;
}

// ============================================
// Export All Effects
// ============================================

export interface CursorEffect {
  id: CursorEffectType;
  name: string;
  description: string;
  generateCSS: (config: CursorEffectConfig) => string;
  generateJS: () => string;
}

export const CURSOR_EFFECTS: CursorEffect[] = [
  {
    id: 'ring-halo',
    name: 'Ring Halo',
    description: 'Elegant expanding circular halos',
    generateCSS: generateRingHaloCSS,
    generateJS: generateRingHaloJS
  },
  {
    id: 'trail-dots',
    name: 'Trail Dots',
    description: 'Following dots that fade away',
    generateCSS: generateTrailDotsCSS,
    generateJS: generateTrailDotsJS
  },
  {
    id: 'magnetic-snap',
    name: 'Magnetic Snap',
    description: 'Snaps to clickable elements',
    generateCSS: generateMagneticSnapCSS,
    generateJS: generateMagneticSnapJS
  },
  {
    id: 'ripple-wave',
    name: 'Ripple Wave',
    description: 'Expanding water-like ripples',
    generateCSS: generateRippleWaveCSS,
    generateJS: generateRippleWaveJS
  },
  {
    id: 'neon-glow',
    name: 'Neon Glow',
    description: 'Vibrant neon light effect',
    generateCSS: generateNeonGlowCSS,
    generateJS: generateNeonGlowJS
  },
  {
    id: 'particle-burst',
    name: 'Particle Burst',
    description: 'Explosive particle system',
    generateCSS: generateParticleBurstCSS,
    generateJS: generateParticleBurstJS
  },
  {
    id: 'spotlight',
    name: 'Spotlight',
    description: 'Illumination with beam',
    generateCSS: generateSpotlightCSS,
    generateJS: generateSpotlightJS
  },
  {
    id: 'outline-stroke',
    name: 'Outline Stroke',
    description: 'Animated drawing border',
    generateCSS: generateOutlineStrokeCSS,
    generateJS: generateOutlineStrokeJS
  },
  {
    id: 'ghost-trail',
    name: 'Ghost Trail',
    description: 'Fading ghost copies',
    generateCSS: generateGhostTrailCSS,
    generateJS: generateGhostTrailJS
  }
];

// Function to generate complete cursor effect
export function generateCursorEffect(config: CursorEffectConfig): { css: string; js: string } {
  const effect = CURSOR_EFFECTS.find(e => e.id === config.type);
  if (!effect) {
    return { css: '', js: '' };
  }
  
  return {
    css: effect.generateCSS(config),
    js: effect.generateJS()
  };
}

// Export all effect generators for individual use
export {
  generateRingHaloCSS,
  generateRingHaloJS,
  generateTrailDotsCSS,
  generateTrailDotsJS,
  generateMagneticSnapCSS,
  generateMagneticSnapJS,
  generateRippleWaveCSS,
  generateRippleWaveJS,
  generateNeonGlowCSS,
  generateNeonGlowJS,
  generateParticleBurstCSS,
  generateParticleBurstJS,
  generateSpotlightCSS,
  generateSpotlightJS,
  generateOutlineStrokeCSS,
  generateOutlineStrokeJS,
  generateGhostTrailCSS,
  generateGhostTrailJS
};

export default CURSOR_EFFECTS;
