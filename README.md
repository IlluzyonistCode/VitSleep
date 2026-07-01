# VitSleep

![JSON](https://img.shields.io/badge/JSON-000000.svg?style=flat-square&logo=JSON&logoColor=white)  ![npm](https://img.shields.io/badge/npm-CB3837.svg?style=flat-square&logo=npm&logoColor=white)  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat-square&logo=JavaScript&logoColor=black)  ![React](https://img.shields.io/badge/React-61DAFB.svg?style=flat-square&logo=React&logoColor=black)  ![Vite](https://img.shields.io/badge/Vite-646CFF.svg?style=flat-square&logo=Vite&logoColor=white)  ![CSS](https://img.shields.io/badge/CSS-663399.svg?style=flat-square&logo=CSS&logoColor=white)  ![datefns](https://img.shields.io/badge/datefns-770C56.svg?style=flat-square&logo=date-fns&logoColor=white)

## Overview

VitSleep is a React PWA (Progressive Web App) for sleep tracking and analysis. It runs as a single-page application with offline capability, mobile responsiveness, and a dependency manifest that ensures deterministic installs across all environments.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

---

## Features

|      | Component         | Details                                                                                                                                                                                                                                          |
| :--- | :---------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ⚙️  | **Architecture**  | <ul><li>**SPA** (Single Page Application) built with `React` + `Vite`</li><li>**PWA**-enabled via `vite-plugin-pwa` — installable, offline-capable</li><li>Client-side routing via `react-router-dom`</li><li>Global state managed with `zustand` store pattern</li><li>Offline-first data persistence using `idb` (IndexedDB wrapper)</li></ul> |
| 🔩 | **Code Quality**  | <ul><li>Component-based structure using `.jsx` files</li><li>Modern ES module syntax throughout</li><li>Declarative UI patterns consistent with React best practices</li><li>No linting config detected (e.g., ESLint/Prettier absent from dependencies)</li></ul> |
| 📄 | **Documentation** | <ul><li>No dedicated docs directory or wiki detected</li><li>`LICENSE` file present — project is openly licensed</li><li>Inline code documentation not verifiable from metadata alone</li><li>`package.json` serves as primary project manifest</li></ul> |
| 🔌 | **Integrations**  | <ul><li>`recharts` — data visualization for sleep analytics/charts</li><li>`date-fns` — lightweight date manipulation (e.g., sleep duration, formatting)</li><li>`lucide-react` — icon library for UI components</li><li>`idb` — browser IndexedDB API for local data storage</li><li>PWA service worker integration via `vite-plugin-pwa`</li></ul> |
| 🧩 | **Modularity**    | <ul><li>React component model enforces UI modularity</li><li>`zustand` enables isolated, composable state slices</li><li>`react-router-dom` separates routing logic from view components</li><li>Vite plugin system (`@vitejs/plugin-react`, `vite-plugin-pwa`) keeps build config modular</li></ul> |

---

## Project Structure

```
└── VitSleep/
    ├── index.html
    ├── LICENSE
    ├── package-lock.json
    ├── package.json
    ├── README.md
    ├── src
    │   ├── App.jsx
    │   ├── components
    │   ├── data
    │   ├── index.css
    │   ├── main.jsx
    │   ├── pages
    │   ├── store
    │   └── utils
    └── vite.config.js
```

---

## Getting Started

### Prerequisites

- Python 3.10+ / Node.js 18+ *(depending on the stack above)*

### Installation

```sh
git clone "https://github.com/IlluzyonistCode/VitSleep
cd VitSleep"
npm install
```

### Usage

```sh
npm start
```

---

## Contributing

- [Report Issues](https://github.com/IlluzyonistCode/VitSleep/issues)
- [Submit Pull Requests](https://github.com/IlluzyonistCode/VitSleep/pulls)
- [Discussions](https://github.com/IlluzyonistCode/VitSleep/discussions)

---

## License

Distributed under the [AGPL-3.0](LICENSE) license.
