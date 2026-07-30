import { requestNotificationPermission } from "./notifications.js";
import { initPomodoro } from "./pomodoro.js";
import { initSidebar } from "./sidebar.js";
import { initTodo } from "./todo.js";

function initApp() {
    initSidebar();
    initTodo();
    initPomodoro();
    requestNotificationPermission();
}

initApp();
