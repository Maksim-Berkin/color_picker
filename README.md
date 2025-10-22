📋 Description
Color Picker App is a modern React app for working with colors. Ideal for designers and developers who need quick access to a color palette with the ability to save custom colors.

✨ Features
 - 🎨 22 Preset Colors — a ready-made palette of popular shades
 - 💾 Save Colors — create a personal palette with named colors
 - 🔍 Search — quickly search by name or HEX code
 - 📋 Copy — instantly copy the HEX code to the clipboard
 - 👁️ Preview — visually preview the selected color
 - 🏷️ Naming — customize your saved colors
 - 🗑️ Manage — delete individual or all custom colors
 - 💫 Save Session — all custom colors are saved to localStorage

🚀 Quick Start
Requirements:
 - Node.js 18+
 - npm or yarn

Installation
 1 - Clone the repository:
   git clone https://github.com/yourusername/color-picker-app.git
   cd color-picker-app

 2 - Install dependencies:
   npm install
   # OR
   yarn install

 3 - Launch the application:
   npm run dev
   # OR
   yarn dev

 4 - Open in browser:
   http://localhost:5173

🛠️ Technologies
 - React 19.1.1 — UI library
 - Vite 7.1.2 — builder and dev server
 - CSS3 — styling with Grid and Flexbox
 - LocalStorage API — data storage
 - Clipboard API — working with the clipboard

📁 Project structure
```
color_picker
└─ vite-project
   ├─ eslint.config.js
   ├─ index.html
   ├─ package-lock.json
   ├─ package.json
   ├─ public
   ├─ README.md
   ├─ src
   │  ├─ App.css
   │  ├─ App.jsx
   │  ├─ assets
   │  ├─ ColorPicker.jsx
   │  ├─ index.css
   │  └─ main.jsx
   └─ vite.config.js

```