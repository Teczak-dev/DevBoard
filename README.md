# DevBoard

**DevBoard** is a lightweight, **local-first developer workspace** designed to keep projects, notes and development tools in one place.

The goal of the project is to support **daily developer workflow** with a simple, fast and distraction-free environment — without the overhead of complex project management tools.

---

## ✨ Features

- 📊 Local project dashboard
- 📝 Markdown editor with live preview
- ✂️ Local code snippet manager (per project)
- ✅ Per-project TODO tracking
- 🗒️ Development notes & code review notes
- 🌙 Light / Dark theme
- 📄 Markdown → PDF export
- 📊 GitHub repository statistics (read-only)
- 🖥 Desktop builds using Tauri

---

## 🧩 Core concept

DevBoard is organized around **local projects**.

Each project:
- is created manually by the user
- has a title and description
- can be marked as **active** or **inactive**
- acts as a container for:
  - code snippets
  - markdown notes
  - TODO items

This structure allows developers to keep all development context related to a project in one place.

---

## 🔗 GitHub integration (planned)

DevBoard will support **read-only GitHub integration**.

Planned options:
- fetching basic repository statistics by repository name
- optional authentication via GitHub account
- no write access and no modification of repositories

GitHub integration is designed as an **optional enhancement**, not a requirement.

---

## 🧠 Philosophy

- Local-first
- No mandatory accounts
- No cloud dependency
- Minimal setup
- Developer-focused UX

DevBoard is intentionally **not** a project management tool.  
It is designed to support everyday development flow, not to replace tools like Jira, Notion or Trello.

---

## 💾 Local-first by design

DevBoard does not rely on cloud services or remote databases.

- All data is stored locally on the user’s machine  
  (e.g. JSON / filesystem — implementation detail)
- No authentication or accounts required
- Fully usable offline

This approach prioritizes **privacy, performance and simplicity**.

---

## 🏗 Architecture overview

- Component-based UI built with React
- Project-centric data model
- Local data persistence layer
- Clear separation between UI, state and domain logic

---

## 🛠 Tech Stack

- React + TypeScript
- Vite
- Tauri (planned desktop builds)
- GitHub API (read-only integration)

---

## 🚧 Project status

DevBoard is an actively developed personal project.

Core concepts and application architecture are stable, while features are implemented incrementally.

---

## 📌 Roadmap 2025 / 2026

- [x] Core project dashboard
- [ ] MVP release
- [ ] Complete snippet manager
- [ ] Complete Markdown editor with PDF export
- [ ] Complete per-project TODO system
- [ ] Desktop build (Tauri)
- [ ] v0.1.0

---

## 📄 License

[MIT](./LICENSE)

---

## 👨‍💻 Author

**Mikołaj Sobczak**  
- GitHub: [Teczak-dev](https://github.com/Teczak-dev)
