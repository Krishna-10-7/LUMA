/*!
 * LumaAnimate v0.2.0 - Animation Engine
 * Built-in GSAP-like animations for LumaJS
 * @license MIT
 */
(function(global) {
  'use strict';

  // ==================== EASING FUNCTIONS ====================
  
  const Easing = {
    linear: t => t,
    
    // Ease In
    easeInQuad: t => t * t,
    easeInCubic: t => t * t * t,
    easeInQuart: t => t * t * t * t,
    easeInQuint: t => t * t * t * t * t,
    easeInSine: t => 1 - Math.cos((t * Math.PI) / 2),
    easeInExpo: t => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
    easeInCirc: t => 1 - Math.sqrt(1 - t * t),
    easeInBack: t => {
      const c1 = 1.70158;
      return (c1 + 1) * t * t * t - c1 * t * t;
    },
    
    // Ease Out
    easeOutQuad: t => t * (2 - t),
    easeOutCubic: t => (--t) * t * t + 1,
    easeOutQuart: t => 1 - (--t) * t * t * t,
    easeOutQuint: t => 1 + (--t) * t * t * t * t,
    easeOutSine: t => Math.sin((t * Math.PI) / 2),
    easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    easeOutCirc: t => Math.sqrt(1 - (--t) * t),
    easeOutBack: t => {
      const c1 = 1.70158;
      return 1 + (c1 + 1) * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
    
    // Ease In Out
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
    easeInOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
    easeInOutExpo: t => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      return t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;
    },
    
    // Elastic
    elastic: t => {
      if (t === 0 || t === 1) return t;
      const p = 0.3;
      return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
    },
    
    // Bounce
    bounce: t => {
      const n1 = 7.5625;
      const d1 = 2.75;
      if (t < 1 / d1) {
        return n1 * t * t;
      } else if (t < 2 / d1) {
        return n1 * (t -= 1.5 / d1) * t + 0.75;
      } else if (t < 2.5 / d1) {
        return n1 * (t -= 2.25 / d1) * t + 0.9375;
      } else {
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
      }
    }
  };

  // ==================== ANIMATION CLASS ====================
  
  class Animation {
    constructor(element, properties, options = {}) {
      this.element = element;
      this.properties = properties;
      this.duration = options.duration || 1000;
      this.delay = options.delay || 0;
      this.easing = Easing[options.easing] || Easing.easeOutCubic;
      this.onComplete = options.onComplete;
      this.onUpdate = options.onUpdate;
      
      this.startTime = null;
      this.startValues = {};
      this.endValues = {};
      this.animationFrame = null;
      this.isRunning = false;
      
      this._parseProperties();
    }
    
    _parseProperties() {
      for (const [key, value] of Object.entries(this.properties)) {
        if (key === 'transform') {
          // Handle transform properties
          this._parseTransform(value);
        } else {
          const current = this._getCurrentValue(key);
          this.startValues[key] = current;
          this.endValues[key] = this._parseValue(value, current);
        }
      }
    }
    
    _parseTransform(transform) {
      // Parse transform string like "translateX(100px) rotate(45deg)"
      const transforms = typeof transform === 'string' ? this._parseTransformString(transform) : transform;
      
      for (const [key, value] of Object.entries(transforms)) {
        const current = this._getCurrentTransform(key);
        this.startValues[`transform.${key}`] = current;
        this.endValues[`transform.${key}`] = this._parseValue(value, current);
      }
    }
    
    _parseTransformString(str) {
      const transforms = {};
      const regex = /(\w+)\(([^)]+)\)/g;
      let match;
      
      while ((match = regex.exec(str)) !== null) {
        transforms[match[1]] = match[2];
      }
      
      return transforms;
    }
    
    _getCurrentValue(property) {
      const computed = window.getComputedStyle(this.element);
      const value = computed[property];
      return parseFloat(value) || 0;
    }
    
    _getCurrentTransform(property) {
      const matrix = window.getComputedStyle(this.element).transform;
      if (matrix === 'none') return 0;
      
      // Parse matrix for transform values
      // For simplicity, return 0 - in production, parse matrix properly
      return 0;
    }
    
    _parseValue(value, current) {
      if (typeof value === 'string') {
        // Handle relative values like "+=100" or "-=50"
        if (value.startsWith('+=')) {
          return current + parseFloat(value.slice(2));
        } else if (value.startsWith('-=')) {
          return current - parseFloat(value.slice(2));
        }
        return parseFloat(value);
      }
      return value;
    }
    
    start() {
      if (this.isRunning) return this;
      
      setTimeout(() => {
        this.isRunning = true;
        this.startTime = performance.now();
        this._animate();
      }, this.delay);
      
      return this;
    }
    
    _animate(currentTime) {
      if (!this.isRunning) return;
      
      if (!this.startTime) this.startTime = currentTime;
      
      const elapsed = currentTime - this.startTime;
      const progress = Math.min(elapsed / this.duration, 1);
      const easedProgress = this.easing(progress);
      
      this._updateValues(easedProgress);
      
      if (this.onUpdate) {
        this.onUpdate(easedProgress);
      }
      
      if (progress < 1) {
        this.animationFrame = requestAnimationFrame((time) => this._animate(time));
      } else {
        this.isRunning = false;
        if (this.onComplete) {
          this.onComplete();
        }
      }
    }
    
    _updateValues(progress) {
      const transforms = {};
      
      for (const [key, startValue] of Object.entries(this.startValues)) {
        const endValue = this.endValues[key];
        const currentValue = startValue + (endValue - startValue) * progress;
        
        if (key.startsWith('transform.')) {
          const transformKey = key.split('.')[1];
          transforms[transformKey] = currentValue;
        } else {
          this._applyStyle(key, currentValue);
        }
      }
      
      if (Object.keys(transforms).length > 0) {
        this._applyTransform(transforms);
      }
    }
    
    _applyStyle(property, value) {
      // Auto-add units for certain properties
      const needsUnit = ['width', 'height', 'top', 'left', 'right', 'bottom', 
                         'margin', 'padding', 'fontSize', 'borderRadius'];
      
      if (needsUnit.some(prop => property.includes(prop))) {
        this.element.style[property] = `${value}px`;
      } else {
        this.element.style[property] = value;
      }
    }
    
    _applyTransform(transforms) {
      const transformStrings = [];
      
      for (const [key, value] of Object.entries(transforms)) {
        let unit = '';
        if (key.includes('translate')) unit = 'px';
        if (key.includes('rotate') || key.includes('skew')) unit = 'deg';
        if (key.includes('scale')) unit = '';
        
        transformStrings.push(`${key}(${value}${unit})`);
      }
      
      this.element.style.transform = transformStrings.join(' ');
    }
    
    pause() {
      this.isRunning = false;
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
      return this;
    }
    
    resume() {
      if (!this.isRunning) {
        this.start();
      }
      return this;
    }
    
    kill() {
      this.pause();
      return this;
    }
  }

  // ==================== TIMELINE CLASS ====================
  
  class Timeline {
    constructor(options = {}) {
      this.animations = [];
      this.options = options;
    }
    
    to(element, properties, options = {}) {
      const animation = new Animation(element, properties, options);
      this.animations.push(animation);
      return this;
    }
    
    from(element, properties, options = {}) {
      // Reverse start and end values
      const animation = new Animation(element, properties, options);
      // Swap start and end
      const temp = animation.startValues;
      animation.startValues = animation.endValues;
      animation.endValues = temp;
      
      this.animations.push(animation);
      return this;
    }
    
    play() {
      this.animations.forEach(anim => anim.start());
      return this;
    }
    
    pause() {
      this.animations.forEach(anim => anim.pause());
      return this;
    }
    
    kill() {
      this.animations.forEach(anim => anim.kill());
      return this;
    }
  }

  // ==================== SCROLL ANIMATIONS ====================
  
  class ScrollTrigger {
    constructor(element, options = {}) {
      this.element = element;
      this.start = options.start || 'top 80%';
      this.end = options.end || 'bottom 20%';
      this.animation = options.animation;
      this.onEnter = options.onEnter;
      this.onLeave = options.onLeave;
      this.once = options.once || false;
      this.hasTriggered = false;
      
      this._setup();
    }
    
    _setup() {
      const observerOptions = {
        threshold: this._calculateThreshold(),
        rootMargin: '0px'
      };
      
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!this.hasTriggered || !this.once) {
              if (this.animation) {
                this.animation.start();
              }
              if (this.onEnter) {
                this.onEnter(this.element);
              }
              this.hasTriggered = true;
            }
          } else {
            if (this.onLeave && this.hasTriggered) {
              this.onLeave(this.element);
            }
          }
        });
      }, observerOptions);
      
      this.observer.observe(this.element);
    }
    
    _calculateThreshold() {
      // Parse start position to threshold
      // For simplicity, using a default threshold
      return 0.1;
    }
    
    kill() {
      if (this.observer) {
        this.observer.disconnect();
      }
      if (this.animation) {
        this.animation.kill();
      }
    }
  }

  // ==================== PRESET ANIMATIONS ====================
  
  const Presets = {
    fadeIn: {
      opacity: 1,
      duration: 600,
      easing: 'easeOutCubic'
    },
    
    fadeOut: {
      opacity: 0,
      duration: 600,
      easing: 'easeOutCubic'
    },
    
    slideInLeft: {
      transform: 'translateX(0)',
      opacity: 1,
      duration: 800,
      easing: 'easeOutCubic'
    },
    
    slideInRight: {
      transform: 'translateX(0)',
      opacity: 1,
      duration: 800,
      easing: 'easeOutCubic'
    },
    
    slideInUp: {
      transform: 'translateY(0)',
      opacity: 1,
      duration: 800,
      easing: 'easeOutCubic'
    },
    
    slideInDown: {
      transform: 'translateY(0)',
      opacity: 1,
      duration: 800,
      easing: 'easeOutCubic'
    },
    
    zoomIn: {
      transform: 'scale(1)',
      opacity: 1,
      duration: 600,
      easing: 'easeOutBack'
    },
    
    zoomOut: {
      transform: 'scale(0)',
      opacity: 0,
      duration: 600,
      easing: 'easeInBack'
    },
    
    rotateIn: {
      transform: 'rotate(0deg)',
      opacity: 1,
      duration: 800,
      easing: 'easeOutBack'
    },
    
    bounce: {
      transform: 'translateY(0)',
      duration: 1000,
      easing: 'bounce'
    },
    
    pulse: {
      transform: 'scale(1.05)',
      duration: 400,
      easing: 'easeInOutQuad'
    }
  };

  // ==================== PUBLIC API ====================
  
  const LumaAnimate = {
    // Core animation
    to: (element, properties, options) => {
      const el = typeof element === 'string' ? document.querySelector(element) : element;
      return new Animation(el, properties, options).start();
    },
    
    from: (element, properties, options) => {
      const el = typeof element === 'string' ? document.querySelector(element) : element;
      const animation = new Animation(el, properties, options);
      // Swap start and end
      const temp = animation.startValues;
      animation.startValues = animation.endValues;
      animation.endValues = temp;
      return animation.start();
    },
    
    // Timeline
    timeline: (options) => new Timeline(options),
    
    // Scroll trigger
    scrollTrigger: (element, options) => {
      const el = typeof element === 'string' ? document.querySelector(element) : element;
      return new ScrollTrigger(el, options);
    },
    
    // Preset animations
    animate: (element, presetName, options = {}) => {
      const el = typeof element === 'string' ? document.querySelector(element) : element;
      const preset = Presets[presetName];
      
      if (!preset) {
        console.warn(`[LumaAnimate] Preset "${presetName}" not found`);
        return;
      }
      
      const props = { ...preset };
      const animOptions = { ...props, ...options };
      delete animOptions.transform;
      delete animOptions.opacity;
      
      const animProps = {};
      if (preset.transform) animProps.transform = preset.transform;
      if (preset.opacity !== undefined) animProps.opacity = preset.opacity;
      
      return new Animation(el, animProps, animOptions).start();
    },
    
    // Easing
    easing: Easing,
    
    // Presets
    presets: Presets,
    
    // Version
    version: '0.2.0'
  };

  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LumaAnimate;
  } else {
    global.LumaAnimate = LumaAnimate;
  }

})(typeof window !== 'undefined' ? window : globalThis);
