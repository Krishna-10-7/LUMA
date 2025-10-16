# 🚀 LumaJS Quick Start Guide

Get started with LumaJS in under 5 minutes!

---

## 🎯 Try It Right Now (No Installation)

### 1. Open the Demo Website

Double-click this file:
```
examples/showcase-website.html
```

This opens a fully functional website built with LumaJS featuring:
- Interactive counter
- Todo list
- Form binding
- Professional UI

### 2. View the Code

Open `examples/showcase-website.html` in your code editor to see how it works.

---

## 💻 Create Your First App

Create a new file `my-app.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My LumaJS App</title>
  <style>
    body {
      font-family: system-ui;
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .card {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    button {
      background: #667eea;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      margin: 5px;
    }
    button:hover {
      background: #5568d3;
    }
    h1 { color: #667eea; }
    .counter { font-size: 48px; text-align: center; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="card" id="app">
    <h1>My First LumaJS App</h1>
    <div class="counter" l-text="count"></div>
    <div style="text-align: center;">
      <button l-on:click="count++">+</button>
      <button l-on:click="count--">-</button>
      <button l-on:click="count = 0">Reset</button>
    </div>
  </div>

  <!-- Option 1: Use built version (after npm run build) -->
  <script src="../dist/luma.umd.js"></script>
  
  <!-- Option 2: Use source directly -->
  <!-- <script src="../src/index.js"></script> -->
  
  <script>
    Luma.mount('#app', {
      state: { count: 0 }
    });
  </script>
</body>
</html>
```

Open this file in your browser - it works immediately!

---

## 📚 Core Concepts

### 1. Reactive State

```javascript
Luma.mount('#app', {
  state: {
    count: 0,
    name: 'John',
    todos: []
  }
});
```

Any change to `state` automatically updates the DOM.

### 2. Directives

**Display Data:**
```html
<h1 l-text="name"></h1>
<div l-html="htmlContent"></div>
```

**Two-Way Binding:**
```html
<input type="text" l-model="name">
<input type="checkbox" l-model="agreed">
```

**Event Handlers:**
```html
<button l-on:click="count++">Click Me</button>
<input l-on:input="handleInput()">
```

**Conditional Display:**
```html
<div l-show="isLoggedIn">Welcome!</div>
```

**Dynamic Attributes:**
```html
<img l-bind:src="imageUrl" l-bind:alt="imageAlt">
<button l-bind:disabled="!isValid">Submit</button>
```

### 3. Methods

```javascript
Luma.mount('#app', {
  state: { items: [] },
  methods: {
    addItem() {
      this.state.items.push({ id: Date.now(), text: 'New' });
    },
    removeItem(id) {
      this.state.items = this.state.items.filter(i => i.id !== id);
    }
  }
});
```

---

## 🎨 Examples

### Counter

```html
<div id="counter">
  <h1 l-text="count"></h1>
  <button l-on:click="count++">Increment</button>
</div>

<script src="../src/index.js"></script>
<script>
  Luma.mount('#counter', {
    state: { count: 0 }
  });
</script>
```

### Form with Validation

```html
<div id="form">
  <input l-model="email" placeholder="Email">
  <p l-show="email && !isValid">Invalid email!</p>
  <button l-bind:disabled="!isValid" l-on:click="submit()">Submit</button>
</div>

<script src="../src/index.js"></script>
<script>
  Luma.mount('#form', {
    state: { email: '' },
    methods: {
      get isValid() {
        return this.state.email.includes('@');
      },
      submit() {
        alert('Submitted: ' + this.state.email);
      }
    }
  });
</script>
```

### Todo List

```html
<div id="todos">
  <input l-model="newTodo" l-on:keydown="if(event.key==='Enter') add()">
  <button l-on:click="add()">Add</button>
  <ul id="list"></ul>
  <p>Total: <span l-text="todos.length"></span></p>
</div>

<script src="../src/index.js"></script>
<script>
  const app = Luma.mount('#todos', {
    state: { newTodo: '', todos: [] },
    methods: {
      add() {
        if (!this.state.newTodo.trim()) return;
        this.state.todos.push({
          id: Date.now(),
          text: this.state.newTodo
        });
        this.state.newTodo = '';
        this.render();
      },
      remove(id) {
        this.state.todos = this.state.todos.filter(t => t.id !== id);
        this.render();
      },
      render() {
        document.querySelector('#list').innerHTML = this.state.todos
          .map(t => `<li>${t.text} <button onclick="app.methods.remove(${t.id})">X</button></li>`)
          .join('');
      }
    }
  });
</script>
```

---

## 🔨 Build for Production

### 1. Build the package
```bash
npm run build
```

This creates optimized bundles in `dist/`:
- `luma.esm.js` - ES Modules
- `luma.cjs.js` - CommonJS (Node.js)
- `luma.umd.js` - UMD (browsers)
- `.min.js` versions of all above

### 2. Use in your HTML

```html
<!-- Use UMD build -->
<script src="dist/luma.umd.min.js"></script>

<!-- Or ES Module -->
<script type="module">
  import Luma from './dist/luma.esm.js';
  // Your code
</script>
```

---

## 📦 Use from npm (After Publishing)

### Install
```bash
npm install @lumajs/core
```

### Import in JS
```javascript
// ES Modules
import Luma from '@lumajs/core';

// CommonJS
const Luma = require('@lumajs/core');
```

### Use with Vite, Webpack, etc.
```javascript
import Luma from '@lumajs/core';

const app = Luma.mount('#app', {
  state: { count: 0 }
});
```

---

## 🌐 Use from CDN (After Publishing)

```html
<!-- From unpkg -->
<script src="https://unpkg.com/@lumajs/core"></script>

<!-- From jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/@lumajs/core"></script>

<script>
  // Luma is now global
  Luma.mount('#app', { state: { count: 0 } });
</script>
```

---

## 🐛 Debugging Tips

### View State in Console
```javascript
const app = Luma.mount('#app', {
  state: { count: 0 }
});

// In browser console:
console.log(app.state.count);
app.state.count = 10; // Updates UI automatically
```

### Check Reactive Effects
```javascript
Luma.effect(() => {
  console.log('Count changed:', app.state.count);
});
```

---

## 📖 Next Steps

1. **Explore Examples**: Check `examples/` folder
2. **Read Docs**: Open `README.md` for full API reference
3. **Build Something**: Create your own app
4. **Publish to npm**: Follow `PUBLISHING.md`
5. **Share**: Show the world what you built!

---

## 🆘 Help

- **Issues**: Check `PROJECT_SUMMARY.md`
- **API**: Read `README.md`
- **Publishing**: See `PUBLISHING.md`
- **Questions**: Open GitHub issue (after creating repo)

---

## 🎉 You're Ready!

Start building reactive web apps with LumaJS today.

**Happy coding!** 🚀
