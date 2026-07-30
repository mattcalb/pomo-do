/* sidebar */
export function loadShouldOpenSidebar() {
    return JSON.parse(localStorage.getItem("shouldOpenSidebar")) ?? false;
}

export function setShouldOpenSidebar(shouldOpenSidebar) {
    localStorage.setItem("shouldOpenSidebar", JSON.stringify(shouldOpenSidebar));
}

/* tasks */
export function loadTasks() {
    return JSON.parse(localStorage.getItem("tasks")) ?? [];
}

export function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

export function loadCurrentFocusTask() {
    return JSON.parse(localStorage.getItem("currentFocusTask"));
}

export function saveCurrentFocusTask(task) {
    localStorage.setItem("currentFocusTask", JSON.stringify(task));
}

export function clearCurrentFocusTask() {
    localStorage.removeItem("currentFocusTask");
}
