# LumaAnimate Usage Guide

## Quick Start

```html
<script src="dist/luma-animate.min.js"></script>
<script>
  // Animate an element
  LumaAnimate.to('.box', {
    transform: { translateX: 200, rotate: 360 },
    opacity: 0.5
  }, {
    duration: 1000,
    easing: 'easeOutCubic'
  });
</script>
```

## Transform Animations

Transform properties must be passed as an **object**:

```js
// CORRECT
LumaAnimate.to('.box', {
  transform: {
    translateX: 200,    // Move right 200px
    translateY: 100,    // Move down 100px
    rotate: 360,        // Rotate 360 degrees
    scale: 1.5          // Scale to 1.5x
  }
}, { duration: 1000 });

// WRONG - Don't use strings
LumaAnimate.to('.box', {
  transform: 'translateX(200px) rotate(360deg)'  // This won't work well
}, { duration: 1000 });
```

## Important: Resetting Transforms

Before animating, reset the element's transform if needed:

```js
function animateBox() {
  const box = document.querySelector('.box');
  
  // Reset transform before animating
  box.style.transform = '';
  
  // Now animate
  LumaAnimate.to(box, {
    transform: { rotate: 360 }
  }, { duration: 1000 });
}
```

## Common Transform Properties

```js
{
  // Translation
  translateX: 100,      // pixels
  translateY: -50,      // pixels
  translateZ: 200,      // pixels (3D)
  
  // Rotation
  rotate: 180,          // degrees
  rotateX: 45,          // degrees (3D)
  rotateY: 90,          // degrees (3D)
  rotateZ: 180,         // degrees (3D)
  
  // Scale
  scale: 1.5,           // uniform scale
  scaleX: 2,            // horizontal only
  scaleY: 0.5,          // vertical only
  
  // Skew
  skewX: 15,            // degrees
  skewY: 10             // degrees
}
```

## Stagger Animations

```js
// Get all elements
const boxes = document.querySelectorAll('.box');

// IMPORTANT: Set initial state first
boxes.forEach(box => {
  box.style.opacity = '0';
  box.style.transform = 'translateY(50px) scale(0.8)';
});

// Wait a frame, then animate
setTimeout(() => {
  LumaAnimate.stagger(boxes, {
    opacity: 1,
    transform: { translateY: 0, scale: 1 }
  }, {
    duration: 600,
    stagger: 100,  // 100ms delay between each
    easing: 'easeOutBack'
  });
}, 50);
```

## Color Animations

Colors work automatically:

```js
LumaAnimate.to('.box', {
  backgroundColor: '#ff6b6b',  // Hex colors
  color: 'rgb(255, 100, 100)', // RGB colors
  borderColor: '#00ff00'
}, { duration: 1000 });
```

## Bounce Effect

```js
// Set starting position
const box = document.querySelector('.box');
box.style.transform = 'translateY(-100px)';

// Wait a moment, then bounce down
setTimeout(() => {
  LumaAnimate.to(box, {
    transform: { translateY: 0 }
  }, {
    duration: 1200,
    easing: 'bounce'
  });
}, 100);
```

## Timeline Sequencing

```js
const tl = LumaAnimate.timeline();

tl.to('.box1', { 
  opacity: 1, 
  transform: { scale: 1, rotate: 0 } 
}, { 
  duration: 500, 
  easing: 'easeOutBack' 
})
.to('.box2', { 
  opacity: 1, 
  transform: { scale: 1, rotate: 0 } 
}, { 
  duration: 500, 
  easing: 'easeOutBack' 
})
.to('.box3', { 
  opacity: 1, 
  transform: { scale: 1, rotate: 0 } 
}, { 
  duration: 500, 
  easing: 'easeOutBack' 
})
.play();
```

## Repeat & Yoyo

```js
LumaAnimate.to('.box', {
  transform: { scale: 1.3 }
}, {
  duration: 500,
  repeat: 2,        // Repeat 2 times
  yoyo: true,       // Reverse on each repeat
  repeatDelay: 200  // Delay between repeats
});
```

## Advanced Controls

```js
// Store animation reference
const anim = LumaAnimate.to('.box', {
  transform: { translateX: 200 }
}, {
  duration: 3000,
  easing: 'linear'
});

// Control it
anim.pause();
anim.resume();
anim.reverse();
anim.restart();
anim.seek(0.5);  // Jump to 50%
anim.kill();     // Stop and cleanup
```

## Spring Physics

```js
LumaAnimate.to('.box', {
  transform: { translateY: -200 }
}, {
  duration: 2000,
  easing: LumaAnimate.easing.spring(170, 26)  // tension, friction
});
```

## All Easing Functions

```js
// Basic
'linear'
'easeInQuad', 'easeOutQuad', 'easeInOutQuad'
'easeInCubic', 'easeOutCubic', 'easeInOutCubic'
'easeInQuart', 'easeOutQuart', 'easeInOutQuart'
'easeInQuint', 'easeOutQuint'

// Sine
'easeInSine', 'easeOutSine', 'easeInOutSine'

// Expo
'easeInExpo', 'easeOutExpo', 'easeInOutExpo'

// Circ
'easeInCirc', 'easeOutCirc', 'easeInOutCirc'

// Back
'easeInBack', 'easeOutBack', 'easeInOutBack'

// Elastic
'elastic', 'easeInElastic', 'easeOutElastic', 'easeInOutElastic'

// Bounce
'bounce', 'easeInBounce', 'easeOutBounce', 'easeInOutBounce'

// Spring (function)
LumaAnimate.easing.spring(tension, friction)
```

## Common Patterns

### Fade In on Page Load
```js
window.addEventListener('load', () => {
  LumaAnimate.to('.hero-title', {
    opacity: 1,
    transform: { translateY: 0 }
  }, {
    duration: 1000,
    easing: 'easeOutCubic'
  });
});
```

### Scroll-Triggered Animation
```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      LumaAnimate.to(entry.target, {
        opacity: 1,
        transform: { translateY: 0 }
      }, {
        duration: 800,
        easing: 'easeOutCubic'
      });
      observer.unobserve(entry.target);
    }
  });
});

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});
```

### Button Click Animation
```js
button.addEventListener('click', () => {
  LumaAnimate.to(button, {
    transform: { scale: 1.1 }
  }, {
    duration: 200,
    yoyo: true,
    repeat: 1
  });
});
```

## Troubleshooting

### Animations Not Showing

1. **Check element exists:**
   ```js
   const el = document.querySelector('.box');
   console.log('Element found:', el); // Should not be null
   ```

2. **Reset transform before animating:**
   ```js
   el.style.transform = '';
   ```

3. **Check console for errors:**
   Open browser DevTools (F12) and check Console tab

4. **Verify LumaAnimate is loaded:**
   ```js
   console.log('LumaAnimate:', typeof LumaAnimate);
   console.log('Version:', LumaAnimate.version);
   ```

### Transform Not Working

Make sure transform is an **object**, not a string:
```js
// CORRECT
{ transform: { rotate: 360 } }

// WRONG
{ transform: 'rotate(360deg)' }
```

### Stagger Not Working

Set initial state first, then animate after a small delay:
```js
// 1. Set initial state
elements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(50px)';
});

// 2. Wait a frame
setTimeout(() => {
  // 3. Now animate
  LumaAnimate.stagger(elements, {
    opacity: 1,
    transform: { translateY: 0 }
  }, { duration: 600, stagger: 100 });
}, 50);
```

## Test File

Use `examples/test-animation.html` to test the API and see working examples.
Open it in your browser and click the test buttons to verify animations work.
