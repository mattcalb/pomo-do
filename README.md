<div align="center">
<img src="./assets/images/logo.png" width="300">
</div>

# pomo.do
A minimalist Pomodoro timer with an integrated to-do list, built to help you stay focused on what matters.

## 🔗 Live Demo
Deployments are updated automatically. You can access the live application here:
* **[🚀 Deploy Link: View Live Application](https://mattcalb.github.io/pomo-do/)**

## ✨ Features
- **Pomodoro timer** — classic focus / short break / long break cycle, with automatic rotation (long break every 4 focus sessions)
- **Play / pause / reset / skip** controls for full manual control over the session
- **Session counter** (e.g. `1/4`) to track progress through the current cycle
- **Sound notification** when a session ends
- **Desktop notification** when a session ends and the tab isn't focused (requires browser permission)
- **Task list** with active and completed sections
- **Add, complete, and delete tasks**, with persistent state across page reloads
- **Current focus** — pin a task as your active focus, shown alongside the timer
- **No sign-up, no login** — open the page and start
- **No data collection** — everything is stored locally in your browser (`localStorage`), nothing sent to a server
- **Fully responsive** — works on desktop and mobile, no installation required
- **Free and open source**

## 🛠️ Tech Stack
-   **HTML5**
-  **CSS3**
-   **JavaScript**

## 📁 Project Structure
Below is an overview of the project's directory structure and the purpose of each file.

```text
.
├── assets/                  # Static assets (images, icons, audio)
├── css/                     # Stylesheets
├── js/
│   ├── app.js               # Application entry point; initializes all modules
│   ├── errors.js            # Error handling and display helpers
│   ├── icons.js             # Inline SVG icon definitions
│   ├── notifications.js     # Notification system
│   ├── pomodoro.js          # Pomodoro timer logic (start, pause, reset, skip, session rotation)
│   ├── sidebar.js           # Sidebar open/close state management
│   ├── storage.js           # localStorage persistence (tasks, focus, preferences)
│   ├── todo.js              # Task management (add, toggle, delete, focus)
│   └── utils.js             # Shared utility functions
├── index.html               # Main application HTML
├── LICENSE                  # Project license
└── README.md                # Project documentation
```

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

## 👤 Authors
Matthäus Campanher Albrecht
- Github: [@mattcalb](https://www.github.com/mattcalb)
